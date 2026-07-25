import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization') || ''
    const accessToken = authHeader.replace('Bearer ', '')
    if (!accessToken) return Response.json({ error: 'Not authenticated.' }, { status: 401 })

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken)
    if (authError || !user) return Response.json({ error: 'Not authenticated.' }, { status: 401 })

    const { data: staff } = await supabase
      .from('staff')
      .select('role, is_active, permissions')
      .eq('auth_user_id', user.id)
      .maybeSingle()

    const canDispatch = staff?.is_active && (staff.role === 'owner' || staff.permissions?.orders)
    if (!canDispatch) return Response.json({ error: 'No permission to dispatch orders.' }, { status: 403 })

    const { orderId, trackingNumber } = await request.json()
    if (!orderId || !trackingNumber) return Response.json({ error: 'Missing orderId or trackingNumber.' }, { status: 400 })

    const { data: order } = await supabase.from('orders').select('*').eq('id', orderId).maybeSingle()
    if (!order) return Response.json({ error: 'Order not found.' }, { status: 404 })

    const trackingUrl = order.region === 'uk'
      ? `https://www.royalmail.com/track-your-item#/tracking-results/${trackingNumber}`
      : null

    await supabase
      .from('orders')
      .update({
        status: 'dispatched',
        tracking_number: trackingNumber,
        tracking_url: trackingUrl,
        dispatched_at: new Date().toISOString(),
        dispatched_by: staff.id,
      })
      .eq('id', orderId)

    try {
      await resend.emails.send({
        from: 'Vexer <support@vexer.org>',
        to: order.customer_email,
        subject: `Your order is on its way — ${order.order_number}`,
        html: `
          <div style="font-family:sans-serif;max-width:520px;margin:0 auto;">
            <h2>Your order has been dispatched!</h2>
            <p>Order <strong>${order.order_number}</strong> is on its way.</p>
            <p>Tracking number: <strong>${trackingNumber}</strong></p>
            ${trackingUrl ? `<p><a href="${trackingUrl}">Track your delivery</a></p>` : ''}
            <p style="color:#888;font-size:13px;">Questions? Join our Discord: https://discord.gg/6Xk2HmgT9N</p>
          </div>
        `,
      })
    } catch (emailErr) {
      console.error('Dispatch email failed:', emailErr.message)
      // Order is still correctly marked dispatched even if the email fails.
    }

    return Response.json({ success: true })
  } catch (err) {
    console.error('Dispatch failed:', err.message)
    return Response.json({ error: err.message || 'Dispatch failed.' }, { status: 500 })
  }
}
