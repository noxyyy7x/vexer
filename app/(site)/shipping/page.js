function InfoCard({ title, children }) {
  return (
    <div className="vx-glass" style={{ padding: 28 }}>
      <div className="font-orb" style={{ fontSize: 9, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.4)', marginBottom: 16 }}>{title}</div>
      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.9 }}>{children}</div>
    </div>
  )
}

export default function ShippingPage() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <div style={{ padding: '60px 24px 40px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="font-orb" style={{ fontSize: 9, letterSpacing: '0.5em', color: 'rgba(255,255,255,0.4)', marginBottom: 12 }}>VEXER</div>
        <h1 className="font-orb" style={{ fontSize: 'clamp(2rem,5vw,4rem)', fontWeight: 900, color: '#fff', marginBottom: 12 }}>SHIPPING</h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Delivering across Europe, the UK and USA</p>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '60px 24px 96px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <InfoCard title="DELIVERY TIMEFRAME">
          All orders are delivered in approximately <strong style={{ color: '#fff' }}>2 weeks</strong> from the date of purchase. This includes sourcing your jersey from our supplier and shipping it directly to your door.
        </InfoCard>

        <InfoCard title="SHIPPING COST">
          <strong style={{ color: '#4ade80' }}>Shipping is included in the price</strong> of every jersey. There are no hidden fees or surprise charges at checkout.
        </InfoCard>

        <InfoCard title="WHERE WE SHIP">
          We currently ship to <strong style={{ color: '#fff' }}>Europe, the United States and the United Kingdom</strong>. We&apos;re working on expanding to more regions in the future.
        </InfoCard>

        <InfoCard title="ORDER TRACKING">
          <strong style={{ color: '#fff' }}>UK customers</strong> receive a Royal Mail tracking number via email once their order is dispatched.<br /><br />
          <strong style={{ color: '#fff' }}>International customers</strong> — we are currently working on bringing full tracking to all worldwide orders. You will receive a dispatch confirmation email when your order is on its way.
        </InfoCard>

        <InfoCard title="INTERNATIONAL CUSTOMS">
          International orders may be subject to customs duties or import taxes depending on your country. These charges are the responsibility of the customer and are not included in the jersey price. Please check your local customs regulations before ordering.
        </InfoCard>

        <div style={{ padding: 24, background: 'rgba(88,101,242,0.06)', border: '1px solid rgba(88,101,242,0.2)', borderRadius: 8, textAlign: 'center' }}>
          <div className="font-orb" style={{ fontSize: 9, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>QUESTIONS ABOUT YOUR ORDER?</div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 16 }}>Get in touch with us on Discord and we&apos;ll help right away.</p>
          <a href="https://discord.gg/6Xk2HmgT9N" target="_blank" rel="noopener noreferrer" className="vx-btn vx-btn-white" style={{ padding: '12px 28px', fontSize: 9, letterSpacing: '0.2em', textDecoration: 'none', display: 'inline-flex' }}>
            JOIN DISCORD →
          </a>
        </div>
      </div>
    </div>
  )
}
