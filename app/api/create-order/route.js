import { createClient } from '@supabase/supabase-js'
import { createRevolutOrder } from '@/lib/revolut'
import { isShippingAllowed } from '@/lib/currency'
import { validateDiscountCode } from '@/lib/discounts'

// Service role client — bypasses RLS. Only ever used server-side here.
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

function generateOrderNumber() {
  const t = Date.now().toString(36).toUpperCase().slice(-5)
  const r = Math.floor(10 + Math.random() * 89)
  return `VEXER-${t}-${r}`
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { items, customer, shipping, discountCode } = body

    if (!items?.length) {
      return Response.json({ error: 'No items provided.' }, { status: 400 })
    }
    if (!customer?.email || !shipping?.line1 || !shipping?.city || !shipping?.postcode || !shipping?.country) {
      return Response.json({ error: 'Missing required customer or shipping details.' }, { status: 400 })
    }
    if (!isShippingAllowed(shipping.country)) {
      return Response.json({ error: 'Sorry, we currently only ship to Europe, the UK and the USA.' }, { status: 400 })
    }

    // Total always computed server-side from item prices — never trust a
    // client-supplied total. Prices are always GBP regardless of what
    // currency was displayed to the shopper.
    const subtotalGBP = items.reduce((sum, item) => sum + Number(item.price) * Number(item.qty), 0)
    if (!(subtotalGBP > 0)) {
      return Response.json({ error: 'Order total must be a positive amount.' }, { status: 400 })
    }

    // Discount is re-validated here regardless of what the checkout preview
    // showed — the client's "Apply" step is just UX, this is the real check.
    let discountAmount = 0
    let appliedCode = null
    if (discountCode) {
      const result = await validateDiscountCode(supabase, discountCode, subtotalGBP)
      if (!result.valid) {
        return Response.json({ error: result.error || 'Invalid discount code.' }, { status: 400 })
      }
      discountAmount = result.discountAmount
      appliedCode = result.discount.code
    }

    const totalGBP = subtotalGBP - discountAmount
    if (!(totalGBP > 0)) {
      return Response.json({ error: 'This discount reduces your order to £0 — please contact support to place a free order.' }, { status: 400 })
    }
    const totalMinorUnits = Math.round(totalGBP * 100)

    const orderNumber = generateOrderNumber()
    const countryCode = (shipping.country || '').toUpperCase()
    const region = countryCode === 'GB' ? 'uk' : 'international'

    // 1. Create the order in our own database first, as pending_payment —
    // this is the source of truth even before Revolut is involved. If the
    // customer abandons payment, we still have a record of the attempt.
    const { data: order, error: insertError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_email: customer.email,
        customer_name: customer.name || null,
        customer_phone: customer.phone || null,
        shipping_line1: shipping.line1,
        shipping_line2: shipping.line2 || null,
        shipping_city: shipping.city,
        shipping_postcode: shipping.postcode,
        shipping_country: countryCode,
        items,
        total: totalGBP,
        discount_code: appliedCode,
        discount_amount: discountAmount,
        currency: 'GBP',
        region,
        status: 'pending_payment',
        payment_status: 'pending',
      })
      .select()
      .single()

    if (insertError) {
      console.error('Order insert failed:', insertError.message)
      return Response.json({ error: 'Failed to create order.' }, { status: 500 })
    }

    // 2. Create the matching order on Revolut's side to get a payment token.
    let revolutOrder
    try {
      revolutOrder = await createRevolutOrder({
        amount: totalMinorUnits,
        currency: 'GBP',
        description: (appliedCode ? `[${appliedCode}] ` : '') + items.map(i => `${i.team || ''} ${i.name} x${i.qty}`).join(', ').slice(0, 250),
        reference: orderNumber,
        customer: {
          email: customer.email,
          full_name: customer.name || undefined,
          phone: customer.phone || undefined,
        },
        // Revolut requires line item totals to sum exactly to the order
        // amount — when a discount changes the charged total, we skip
        // itemized line items rather than risk a mismatch. The order
        // description above still records what was ordered and the code used.
        lineItems: appliedCode ? undefined : items.map(item => ({
          name: `${item.team ? item.team + ' — ' : ''}${item.name}${item.size ? ` (${item.size})` : ''}`.slice(0, 250),
          type: 'physical',
          quantity: { value: item.qty },
          unit_price_amount: Math.round(Number(item.price) * 100),
          total_amount: Math.round(Number(item.price) * 100) * item.qty,
        })),
        shipping: {
          address: {
            street_line_1: shipping.line1,
            street_line_2: shipping.line2 || undefined,
            city: shipping.city,
            postcode: shipping.postcode,
            country_code: countryCode,
          },
          contact: {
            name: customer.name || undefined,
            email: customer.email,
            phone: customer.phone || undefined,
          },
        },
      })
    } catch (revolutError) {
      console.error('Revolut order creation failed:', revolutError.message)
      // Clean up the pending order so it doesn't sit there forever with no
      // way to ever be paid.
      await supabase.from('orders').update({ status: 'cancelled' }).eq('id', order.id)
      return Response.json({ error: 'Payment provider error. Please try again.' }, { status: 502 })
    }

    // 3. Link the two records together so the webhook can find this order later.
    await supabase.from('orders').update({ revolut_order_id: revolutOrder.id }).eq('id', order.id)

    return Response.json({
      token: revolutOrder.token,
      orderId: order.id,
      orderNumber,
    })
  } catch (err) {
    console.error('create-order error:', err.message)
    return Response.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
