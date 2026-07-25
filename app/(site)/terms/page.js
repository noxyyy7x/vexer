function Section({ title, children }) {
  return (
    <div className="vx-glass" style={{ padding: 28, marginBottom: 16 }}>
      <div className="font-orb" style={{ fontSize: 9, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.4)', marginBottom: 12 }}>{title}</div>
      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.9 }}>{children}</div>
    </div>
  )
}

export default function TermsPage() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <div style={{ padding: '60px 24px 40px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="font-orb" style={{ fontSize: 9, letterSpacing: '0.5em', color: 'rgba(255,255,255,0.4)', marginBottom: 12 }}>VEXER</div>
        <h1 className="font-orb" style={{ fontSize: 'clamp(2rem,5vw,4rem)', fontWeight: 900, color: '#fff', marginBottom: 12 }}>TERMS &amp; CONDITIONS</h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Last updated: July 2026</p>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '60px 24px 96px' }}>
        <Section title="ACCEPTANCE OF TERMS">
          By placing an order on vexer.org you agree to these terms and conditions in full. If you do not agree with any part of these terms please do not use our website.
        </Section>

        <Section title="ABOUT OUR PRODUCTS">
          Vexer sells football jerseys. All jerseys sold on vexer.org are unlicensed replica products and are not affiliated with, endorsed by or connected to any official football club, national team, league or governing body. By purchasing from us you acknowledge and accept this.
        </Section>

        <Section title="ORDERING">
          By placing an order you confirm that all information provided is accurate and complete. We reserve the right to cancel any order at our discretion. You have <strong style={{ color: '#fff' }}>15 minutes</strong> after placing an order to request a cancellation or change via Discord; after this window, production begins and the order cannot be modified or cancelled. All prices are displayed in your local currency for convenience but are charged in GBP.
        </Section>

        <Section title="PAYMENTS">
          All payments are processed securely by Revolut. We accept all major debit and credit cards, Apple Pay, Google Pay and Revolut. Payment is taken in full at the time of ordering.
        </Section>

        <Section title="DELIVERY">
          We currently ship to Europe, the United States and the United Kingdom. We aim to deliver all orders within approximately 2 weeks. Delivery times are estimates and not guaranteed. We are not responsible for delays caused by customs, postal services or circumstances beyond our control.
        </Section>

        <Section title="RETURNS & REFUNDS">
          Custom jerseys with player names or numbers cannot be returned. Standard jerseys may be returned within 3 days of receipt in unworn and original condition. Faulty or incorrect items will be replaced or refunded. Please see our <strong style={{ color: '#fff' }}>Returns Policy</strong> for full details.
        </Section>

        <Section title="INTELLECTUAL PROPERTY">
          All content on vexer.org including our logo, branding and website design is the property of Vexer and may not be reproduced without written permission.
        </Section>

        <Section title="LIMITATION OF LIABILITY">
          Vexer is not liable for any indirect or consequential loss arising from the use of our website or products. Our liability is limited to the value of the order placed.
        </Section>

        <Section title="CHANGES TO TERMS">
          We reserve the right to update these terms at any time. Continued use of vexer.org following any changes constitutes acceptance of the updated terms.
        </Section>

        <Section title="CONTACT">
          For any questions regarding these terms contact us at <strong style={{ color: '#fff' }}>support@vexer.org</strong> or via our <a href="https://discord.gg/6Xk2HmgT9N" target="_blank" rel="noopener noreferrer" style={{ color: '#fff' }}>Discord</a>.
        </Section>
      </div>
    </div>
  )
}
