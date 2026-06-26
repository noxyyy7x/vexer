import { Resend } from 'resend';
import crypto from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY);

function generateOrderNumber() {
  return 'VEXER-' + Math.floor(1000 + Math.random() * 9000);
}

export const config = {
  api: { bodyParser: false },
};

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => { data += chunk; });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') { res.status(405).end(); return; }

  const rawBody = await getRawBody(req);
  const signature = req.headers['revolut-signature'];
  const webhookSecret = process.env.REVOLUT_WEBHOOK_SECRET_VEXER;

  if (webhookSecret && signature) {
    try {
      const timestamp = req.headers['revolut-request-timestamp'];
      const v1 = signature.split(',').find(s => s.startsWith('v1='))?.split('=')[1];
      const signedPayload = `v1.${timestamp}.${rawBody}`;
      const expectedSig = crypto.createHmac('sha256', webhookSecret).update(signedPayload).digest('hex');
      if (expectedSig !== v1) {
        console.error('Invalid webhook signature');
        return res.status(400).json({ error: 'Invalid signature' });
      }
    } catch(err) {
      console.error('Signature error:', err.message);
      return res.status(400).json({ error: 'Signature verification failed' });
    }
  }

  let event;
  try { event = JSON.parse(rawBody); } catch(err) { return res.status(400).json({ error: 'Invalid JSON' }); }

  if (event.event === 'ORDER_COMPLETED') {
    const orderId = event.order_id;
    let order;
    try {
      const r = await fetch(`https://merchant.revolut.com/api/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${process.env.REVOLUT_SECRET_KEY}`,
          'Revolut-Api-Version': '2024-09-01',
        },
      });
      order = await r.json();
    } catch(err) {
      console.error('Failed to fetch order:', err.message);
      return res.status(500).json({ error: 'Failed to fetch order' });
    }

    // Skip ANAYX orders
    if (order?.redirect_url?.includes('anayx.com')) {
      console.log('Skipping ANAYX order');
      return res.status(200).json({ received: true });
    }
    console.log('Processing Vexer order:', orderId);

    const payment = order?.payments?.[0];
    const customerEmail = payment?.payer?.email || '';
    const customerName = payment?.payment_method?.cardholder_name || 'Valued Customer';
    const customerPhone = payment?.payer?.phone || '';
    const total = ((order?.amount || 0) / 100).toFixed(2);
    const shipping = payment?.billing_address;
    const orderNumber = generateOrderNumber();
    const meta = order?.metadata || {};
    const SHEETS_URL = process.env.VEXER_SHEETS_URL || '';

    const itemCount = parseInt(meta.item_count || '1');
    const itemsHtml = Array.from({length: itemCount}, (_, i) => {
      const name = meta[`item_${i}_name`] || 'Jersey';
      const team = meta[`item_${i}_team`] || '';
      const qty = meta[`item_${i}_qty`] || '1';
      const size = meta[`item_${i}_size`] || '';
      const gender = meta[`item_${i}_gender`] || '';
      const playerName = meta[`item_${i}_playerName`] || '';
      const playerNumber = meta[`item_${i}_playerNumber`] || '';
      const badge = meta[`item_${i}_badge`] || '';
      return `
        <div style="padding:14px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
          <div style="font-size:13px;color:#fff;font-weight:600;margin-bottom:4px;">${team} — ${name}</div>
          <div style="font-size:11px;color:rgba(255,255,255,0.4);">Qty: ${qty}${size?` · Size: ${size}`:''}${gender?` · ${gender}`:''}</div>
          ${playerName?`<div style="font-size:11px;color:rgba(255,255,255,0.5);margin-top:4px;">Name: ${playerName} #${playerNumber}</div>`:''}
          ${badge?`<div style="font-size:11px;color:rgba(255,255,255,0.5);">Badge: Included</div>`:''}
        </div>`;
    }).join('');

    const itemsText = Array.from({length: itemCount}, (_, i) =>
      `${meta[`item_${i}_team`]||''} ${meta[`item_${i}_name`]||''} x${meta[`item_${i}_qty`]||1}`
    ).join(', ');

    const addressText = shipping ? `${shipping.street_line_1||''}, ${shipping.city||''}, ${shipping.postcode||''}` : 'N/A';

    // Email to you
    await resend.emails.send({
      from: 'Vexer Orders <support@vexer.org>',
      to: 'support@vexer.org',
      subject: `⚽ New Order ${orderNumber} — £${total}`,
      html: `
<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#050508;font-family:'Inter',sans-serif;">
<div style="max-width:600px;margin:0 auto;background:#0a0a0f;padding:40px 20px;">
  <div style="text-align:center;margin-bottom:28px;padding-bottom:20px;border-bottom:1px solid rgba(255,255,255,0.08);">
    <img src="https://vexer.org/logo.png" alt="Vexer" style="height:50px;width:auto;"/>
  </div>
  <div style="text-align:center;margin-bottom:28px;">
    <div style="font-size:10px;letter-spacing:6px;color:rgba(255,255,255,0.4);margin-bottom:8px;">NEW ORDER RECEIVED</div>
    <div style="font-size:28px;font-weight:700;color:#fff;margin-bottom:4px;">${orderNumber}</div>
    <div style="font-size:22px;font-weight:700;color:#fff;">£${total}</div>
  </div>
  <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:20px;margin-bottom:20px;">
    <div style="font-size:9px;letter-spacing:4px;color:rgba(255,255,255,0.4);margin-bottom:14px;">CUSTOMER</div>
    <table style="width:100%;border-collapse:collapse;">
      <tr><td style="font-size:11px;color:rgba(255,255,255,0.4);padding:4px 0;width:100px;">Name</td><td style="font-size:12px;color:#fff;">${customerName}</td></tr>
      <tr><td style="font-size:11px;color:rgba(255,255,255,0.4);padding:4px 0;">Email</td><td style="font-size:12px;color:#fff;">${customerEmail}</td></tr>
      <tr><td style="font-size:11px;color:rgba(255,255,255,0.4);padding:4px 0;">Phone</td><td style="font-size:12px;color:#fff;">${customerPhone||'N/A'}</td></tr>
    </table>
  </div>
  <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:20px;margin-bottom:20px;">
    <div style="font-size:9px;letter-spacing:4px;color:rgba(255,255,255,0.4);margin-bottom:14px;">SHIPPING ADDRESS</div>
    <div style="font-size:12px;color:#fff;line-height:1.9;">
      ${shipping?.street_line_1||'N/A'}<br/>
      ${shipping?.city||'N/A'}<br/>
      ${shipping?.postcode||'N/A'}<br/>
      ${shipping?.country_code||''}
    </div>
  </div>
  <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:20px;margin-bottom:20px;">
    <div style="font-size:9px;letter-spacing:4px;color:rgba(255,255,255,0.4);margin-bottom:14px;">ORDER ITEMS</div>
    ${itemsHtml}
    <div style="display:flex;justify-content:space-between;padding-top:14px;">
      <div style="font-size:11px;color:rgba(255,255,255,0.4);">TOTAL PAID</div>
      <div style="font-size:18px;font-weight:700;color:#fff;">£${total}</div>
    </div>
  </div>
  <div style="text-align:center;padding-top:20px;border-top:1px solid rgba(255,255,255,0.06);">
    <p style="font-size:9px;letter-spacing:3px;color:rgba(255,255,255,0.2);">VEXER · FOOTBALL JERSEYS</p>
  </div>
</div></body></html>`,
    });

    // Email to customer
    if (customerEmail) {
      await resend.emails.send({
        from: 'Vexer <support@vexer.org>',
        to: customerEmail,
        subject: `Order Confirmed — ${orderNumber}`,
        html: `
<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#050508;font-family:'Inter',sans-serif;">
<div style="max-width:600px;margin:0 auto;background:#0a0a0f;padding:40px 20px;">
  <div style="text-align:center;margin-bottom:32px;padding-bottom:24px;border-bottom:1px solid rgba(255,255,255,0.08);">
    <img src="https://vexer.org/logo.png" alt="Vexer" style="height:50px;width:auto;"/>
  </div>
  <div style="text-align:center;margin-bottom:32px;">
    <div style="font-size:11px;letter-spacing:6px;color:rgba(255,255,255,0.4);margin-bottom:12px;">ORDER CONFIRMED</div>
    <h1 style="font-size:28px;font-weight:700;color:#fff;margin:0 0 8px;">THANK YOU</h1>
    <p style="font-size:13px;color:rgba(255,255,255,0.4);margin:0;">Hi ${customerName} — your order is confirmed.</p>
  </div>
  <div style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);border-radius:8px;padding:20px;text-align:center;margin-bottom:28px;">
    <div style="font-size:10px;letter-spacing:4px;color:rgba(255,255,255,0.4);margin-bottom:8px;">ORDER NUMBER</div>
    <div style="font-size:24px;font-weight:700;color:#fff;">${orderNumber}</div>
    <div style="font-size:12px;color:rgba(255,255,255,0.4);margin-top:8px;">Total Paid: £${total}</div>
  </div>
  <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:20px;margin-bottom:24px;">
    <div style="font-size:9px;letter-spacing:4px;color:rgba(255,255,255,0.4);margin-bottom:14px;">YOUR ORDER</div>
    ${itemsHtml}
    <div style="display:flex;justify-content:space-between;padding-top:14px;">
      <div style="font-size:11px;color:rgba(255,255,255,0.4);">TOTAL</div>
      <div style="font-size:18px;font-weight:700;color:#fff;">£${total}</div>
    </div>
  </div>
  <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:20px;margin-bottom:24px;">
    <div style="font-size:9px;letter-spacing:4px;color:rgba(255,255,255,0.4);margin-bottom:12px;">DELIVERY ADDRESS</div>
    <div style="font-size:13px;color:rgba(255,255,255,0.6);line-height:1.9;">
      ${shipping?.street_line_1||''}<br/>
      ${shipping?.city||''}<br/>
      ${shipping?.postcode||''}<br/>
      ${shipping?.country_code||''}
    </div>
  </div>
  <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:20px;margin-bottom:28px;">
    <div style="font-size:9px;letter-spacing:4px;color:rgba(255,255,255,0.4);margin-bottom:14px;text-align:center;">WHAT HAPPENS NEXT</div>
    ${[["1","We source your jersey from our supplier"],["2","Your order is dispatched with tracking"],["3","Your jersey arrives at your door"]].map(([n,s])=>`
      <div style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.05);display:flex;gap:14px;align-items:center;">
        <div style="width:24px;height:24px;border-radius:50%;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);text-align:center;line-height:24px;font-size:11px;color:#fff;flex-shrink:0;">${n}</div>
        <div style="font-size:12px;color:rgba(255,255,255,0.5);">${s}</div>
      </div>`).join('')}
  </div>
  <div style="text-align:center;padding-top:24px;border-top:1px solid rgba(255,255,255,0.06);">
    <p style="font-size:12px;color:rgba(255,255,255,0.3);margin:0 0 8px;">Questions? Contact us at</p>
    <p style="font-size:13px;color:#fff;margin:0 0 20px;">support@vexer.org</p>
    <a href="https://discord.gg/6Xk2HmgT9N" style="display:inline-block;padding:10px 24px;background:#5865f2;color:#fff;text-decoration:none;border-radius:6px;font-size:10px;letter-spacing:0.15em;">JOIN DISCORD →</a>
    <p style="font-size:9px;color:rgba(255,255,255,0.2);margin:20px 0 0;letter-spacing:0.2em;">VEXER · FOOTBALL JERSEYS · WORLDWIDE</p>
  </div>
</div></body></html>`,
      });
    }
  }

  res.status(200).json({ received: true });
}