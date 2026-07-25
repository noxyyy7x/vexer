import { createClient } from '@supabase/supabase-js'
import { refundRevolutOrder } from '@/lib/revolut'

// Service role client — needed to write the refund result regardless of RLS,
// but every request is still gated on a real, permission-checked staff
// session before any refund is attempted.
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization') || ''
    const accessToken = authHeader.replace('Bearer ', '')
    if (!accessToken) {
      return Response.json({ error: 'Not authenticated.' }, { status: 401 })
    }

    // Verify the token actually belongs to a real, logged-in Supabase user.
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken)
    if (authError || !user) {
      return Response.json({ error: 'Not authenticated.' }, { status: 401 })
    }

    // Verify that user is active staff with permission to touch orders —
    // never trust the client to have enforced this itself.
    const { data: staff } = await supabase
      .from('staff')
      .select('role, is_active, permissions')
      .eq('auth_user_id', user.id)
      .maybeSingle()

    const canRefund = staff?.is_active && (staff.role === 'owner' || staff.permissions?.orders)
    if (!canRefund) {
      return Response.json({ error: 'You do not have permission to process refunds.' }, { status: 403 })
    }

    const { orderId, itemIndex } = await request.json()
    if (!orderId || itemIndex === undefined) {
      return Response.json({ error: 'Missing orderId or itemIndex.' }, { status: 400 })
    }

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .maybeSingle()

    if (orderError || !order) {
      return Response.json({ error: 'Order not found.' }, { status: 404 })
    }
    if (!order.revolut_order_id) {
      return Response.json({ error: 'This order has no linked payment to refund.' }, { status: 400 })
    }

    const items = order.items || []
    const item = items[itemIndex]
    if (!item) {
      return Response.json({ error: 'Item not found on this order.' }, { status: 404 })
    }
    if (item.refunded) {
      return Response.json({ error: 'This item has already been refunded.' }, { status: 400 })
    }

    const refundAmountGBP = Number(item.price) * Number(item.qty)
    const refundAmountMinor = Math.round(refundAmountGBP * 100)

    // Refund with Revolut first — only mark it refunded in our own records
    // once the money has actually moved.
    await refundRevolutOrder({
      orderId: order.revolut_order_id,
      amount: refundAmountMinor,
      currency: order.currency || 'GBP',
      idempotencyKey: `refund-${order.id}-item-${itemIndex}`,
    })

    const updatedItems = items.map((it, i) => i === itemIndex ? { ...it, refunded: true, refunded_at: new Date().toISOString() } : it)
    const newRefundedTotal = Number(order.refunded_amount || 0) + refundAmountGBP

    await supabase
      .from('orders')
      .update({
        items: updatedItems,
        refunded_amount: newRefundedTotal,
        status: newRefundedTotal >= Number(order.total) ? 'refunded' : order.status,
      })
      .eq('id', order.id)

    return Response.json({ success: true, refundedAmount: refundAmountGBP })
  } catch (err) {
    console.error('Refund failed:', err.message)
    return Response.json({ error: err.message || 'Refund failed.' }, { status: 500 })
  }
}
