import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') { res.status(405).end(); return; }

  const { customerEmail, orderNumber, trackingNumber, dispatchType } = req.body;

  const isUK = dispatchType === 'uk';
  const trackingUrl = `https://www.royalmail.com/track-your-item#/tracking-results/${trackingNumber}`;

  try {
    await resend.emails.send({
      from: 'Vexer <support@vexer.org>',
      to: customerEmail,
      subject: `Your Vexer Order Is On Its Way — ${orderNumber}`,
      html: `
<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#050508;font-family:'Inter',sans-serif;">
<div style="max-width:600px;margin:0 auto;background:#0a0a0f;padding:40px 20px;">
  <div style="text-align:center;margin-bottom:32px;padding-bottom:24px;border-bottom:1px solid rgba(255,255,255,0.08);">
    <img src="https://vexer.org/logo.png" alt="Vexer" style="height:50px;width:auto;"/>
  </div>
  <div style="text-align:center;margin-bottom:32px;">
    <div style="font-size:11px;letter-spacing:6px;color:rgba(255,255,255,0.4);margin-bottom:12px;">ORDER DISPATCHED</div>
    <h1 style="font-size:28px;font-weight:700;color:#fff;margin:0 0 8px;">IT'S ON ITS WAY!</h1>
    <p style="font-size:13px;color:rgba(255,255,255,0.4);margin:0;">Your jersey has been dispatched and is heading your way</p>
  </div>

  <div style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);border-radius:8px;padding:24px;text-align:center;margin-bottom:28px;">
    <div style="font-size:10px;letter-spacing:4px;color:rgba(255,255,255,0.4);margin-bottom:8px;">ORDER NUMBER</div>
    <div style="font-size:20px;font-weight:700;color:#fff;margin-bottom:${isUK?'20px':'0'};">${orderNumber}</div>
    ${isUK?`
    <div style="font-size:10px;letter-spacing:4px;color:rgba(255,255,255,0.4);margin-bottom:8px;">ROYAL MAIL TRACKING</div>
    <div style="font-size:22px;font-weight:700;color:#fff;letter-spacing:0.1em;margin-bottom:20px;">${trackingNumber}</div>
    <a href="${trackingUrl}" style="display:inline-block;padding:12px 28px;background:#fff;color:#050508;text-decoration:none;border-radius:6px;font-size:10px;font-weight:700;letter-spacing:0.2em;">TRACK MY ORDER →</a>
    `:''}
  </div>

  <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:20px;margin-bottom:28px;">
    <div style="font-size:9px;letter-spacing:4px;color:rgba(255,255,255,0.4);margin-bottom:12px;">DELIVERY INFO</div>
    <div style="font-size:12px;color:rgba(255,255,255,0.5);line-height:2;">
      ${isUK?'Royal Mail delivery · Typically 1–3 working days':'Worldwide delivery · Approximately 2 weeks'}<br/>
      ${isUK?`Track using your tracking number above`:'Your order is on its way — please allow the estimated delivery time'}
    </div>
  </div>

  <div style="text-align:center;margin-bottom:28px;">
    <p style="font-size:13px;color:rgba(255,255,255,0.4);line-height:1.9;margin:0;">Thank you for your order. We hope you love your jersey! ⚽</p>
  </div>

  <div style="text-align:center;padding-top:24px;border-top:1px solid rgba(255,255,255,0.06);">
    <p style="font-size:12px;color:rgba(255,255,255,0.3);margin:0 0 8px;">Questions? Contact us at</p>
    <p style="font-size:13px;color:#fff;margin:0 0 20px;">support@vexer.org</p>
    <a href="https://discord.gg/6Xk2HmgT9N" style="display:inline-block;padding:10px 24px;background:#5865f2;color:#fff;text-decoration:none;border-radius:6px;font-size:10px;letter-spacing:0.15em;">JOIN DISCORD →</a>
    <p style="font-size:9px;color:rgba(255,255,255,0.2);margin:20px 0 0;letter-spacing:0.2em;">VEXER · FOOTBALL JERSEYS · WORLDWIDE</p>
  </div>
</div></body></html>`,
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Tracking email error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
}