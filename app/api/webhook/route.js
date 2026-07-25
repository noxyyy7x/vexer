import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'
import { Resend } from 'resend'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
const resend = new Resend(process.env.RESEND_API_KEY)

function verifySignature(rawBody, timestamp, signatureHeader, signingSecret) {
  // Reject stale requests — protects against replay attacks.
  const age = Math.abs(Date.now() - Number(timestamp))
  if (age > 5 * 60 * 1000) return false

  const payloadToSign = `v1.${timestamp}.${rawBody}`
  const expected = 'v1=' + crypto.createHmac('sha256', signingSecret).update(payloadToSign).digest('hex')

  // Header can contain multiple comma-separated signatures during secret rotation.
  const provided = signatureHeader.split(',').map(s => s.trim())
  return provided.includes(expected)
}

export async function POST(request) {
  const rawBody = await request.text()
  const signature = request.headers.get('revolut-signature') || ''
  const timestamp = request.headers.get('revolut-request-timestamp') || ''

  if (!verifySignature(rawBody, timestamp, signature, process.env.REVOLUT_WEBHOOK_SECRET)) {
    console.error('Webhook signature verification failed.')
    return Response.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const payload = JSON.parse(rawBody)
  const { event, order_id } = payload

  if (!order_id) return Response.json({ received: true })

  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('revolut_order_id', order_id)
    .maybeSingle()

  if (!order) {
    console.error('Webhook received for unknown order:', order_id)
    return Response.json({ received: true })
  }

  if (event === 'ORDER_COMPLETED') {
    // Idempotency guard — webhooks can be delivered more than once.
    if (order.status === 'pending_payment') {
      await supabase.from('orders').update({ status: 'processing', payment_status: 'paid' }).eq('id', order.id)
      await sendConfirmationEmail(order)
    }
  } else if (event === 'ORDER_PAYMENT_DECLINED' || event === 'ORDER_FAILED') {
    await supabase.from('orders').update({ status: 'cancelled', payment_status: 'failed' }).eq('id', order.id)
  } else if (event === 'ORDER_CANCELLED') {
    await supabase.from('orders').update({ status: 'cancelled', payment_status: 'cancelled' }).eq('id', order.id)
  }

  return Response.json({ received: true })
}

async function sendConfirmationEmail(order) {
  try {
    const itemsHtml = (order.items || []).map(i =>
      `<tr><td style="padding:8px 0;">${i.team ? i.team + ' — ' : ''}${i.name}${i.size ? ` (${i.size})` : ''} x${i.qty}</td><td style="padding:8px 0;text-align:right;">£${(i.price * i.qty).toFixed(2)}</td></tr>`
    ).join('')

    await resend.emails.send({
      from: 'Vexer <support@vexer.org>',
      to: order.customer_email,
      subject: `Order Confirmed — ${order.order_number}`,
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto;">
          <h2>Thanks for your order!</h2>
          <p>Order <strong>${order.order_number}</strong> is confirmed and being prepared.</p>
          <table style="width:100%;border-collapse:collapse;margin:20px 0;">${itemsHtml}</table>
          <p style="font-weight:bold;">Total: £${Number(order.total).toFixed(2)}</p>
          <p>Delivery in approximately 2 weeks. We'll email you when it's dispatched.</p>
          <p style="color:#888;font-size:13px;">Questions? Join our Discord: https://discord.gg/6Xk2HmgT9N</p>
        </div>
      `,
    })
  } catch (err) {
    console.error('Confirmation email failed:', err.message)
    // Don't fail the webhook over an email issue — the order is still correctly marked paid.
  }
}
