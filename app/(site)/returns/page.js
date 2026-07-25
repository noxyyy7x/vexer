function InfoCard({ title, children }) {
  return (
    <div className="vx-glass" style={{ padding: 28 }}>
      <div className="font-orb" style={{ fontSize: 9, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.4)', marginBottom: 16 }}>{title}</div>
      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.9 }}>{children}</div>
    </div>
  )
}

export default function ReturnsPage() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <div style={{ padding: '60px 24px 40px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="font-orb" style={{ fontSize: 9, letterSpacing: '0.5em', color: 'rgba(255,255,255,0.4)', marginBottom: 12 }}>VEXER</div>
        <h1 className="font-orb" style={{ fontSize: 'clamp(2rem,5vw,4rem)', fontWeight: 900, color: '#fff', marginBottom: 12 }}>RETURNS</h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Our returns policy explained</p>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '60px 24px 96px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ padding: '20px 24px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8 }}>
          <div className="font-orb" style={{ fontSize: 9, letterSpacing: '0.3em', color: 'rgba(239,68,68,0.7)', marginBottom: 8 }}>CUSTOM JERSEYS — NO RETURNS</div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, margin: 0 }}>
            Jerseys with a custom player name and/or number are made specifically for you and <strong style={{ color: '#fff' }}>cannot be returned or exchanged</strong> unless the item arrives faulty or not as described.
          </p>
        </div>

        <InfoCard title="STANDARD JERSEYS">
          Returns are accepted on standard jerseys (without custom name/number) within <strong style={{ color: '#fff' }}>3 days of receiving your order</strong>. The jersey must be unworn, unwashed and in its original condition.
        </InfoCard>

        <InfoCard title="FAULTY OR INCORRECT ITEMS">
          If your jersey arrives faulty, damaged or not as described please contact us immediately on Discord with photos of the issue and your order number. We will resolve this as quickly as possible.
        </InfoCard>

        <InfoCard title="HOW TO REQUEST A RETURN">
          To request a return open a ticket on our Discord server within 3 days of receiving your order. Include your order number and reason for return. Our team will guide you through the process.
        </InfoCard>

        <InfoCard title="RETURN SHIPPING">
          Return shipping costs are the responsibility of the customer unless the item is faulty or incorrect.
        </InfoCard>

        <div style={{ padding: 24, background: 'rgba(88,101,242,0.06)', border: '1px solid rgba(88,101,242,0.2)', borderRadius: 8, textAlign: 'center' }}>
          <div className="font-orb" style={{ fontSize: 9, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>NEED TO RETURN SOMETHING?</div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 16 }}>Open a support ticket on Discord and we&apos;ll sort it out.</p>
          <a href="https://discord.gg/6Xk2HmgT9N" target="_blank" rel="noopener noreferrer" className="vx-btn vx-btn-white" style={{ padding: '12px 28px', fontSize: 9, letterSpacing: '0.2em', textDecoration: 'none', display: 'inline-flex' }}>
            JOIN DISCORD →
          </a>
        </div>
      </div>
    </div>
  )
}
