function Section({ title, children }) {
  return (
    <div className="vx-glass" style={{ padding: 28, marginBottom: 16 }}>
      <div className="font-orb" style={{ fontSize: 9, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.4)', marginBottom: 12 }}>{title}</div>
      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.9 }}>{children}</div>
    </div>
  )
}

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <div style={{ padding: '60px 24px 40px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="font-orb" style={{ fontSize: 9, letterSpacing: '0.5em', color: 'rgba(255,255,255,0.4)', marginBottom: 12 }}>VEXER</div>
        <h1 className="font-orb" style={{ fontSize: 'clamp(2rem,5vw,4rem)', fontWeight: 900, color: '#fff', marginBottom: 12 }}>PRIVACY POLICY</h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Last updated: July 2026</p>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '60px 24px 96px' }}>
        <Section title="WHO WE ARE">
          Vexer is an online football jersey store operating at vexer.org. We are committed to protecting your personal information and being transparent about how we use it. For any privacy related questions contact us at <strong style={{ color: '#fff' }}>support@vexer.org</strong>.
        </Section>

        <Section title="INFORMATION WE COLLECT">
          When you place an order we collect your name, email address, phone number, delivery address and payment information. Payment information is processed securely by Revolut and we do not store your card details. We also collect cookies and browsing data to improve your experience on our site.
        </Section>

        <Section title="HOW WE USE YOUR INFORMATION">
          We use your information to process and fulfil your order, send you order confirmation and dispatch emails, respond to your enquiries and improve our website and services. We do not sell your personal information to third parties.
        </Section>

        <Section title="COOKIES">
          We use cookies to remember your preferences and improve your browsing experience. You can accept or reject cookies using the banner shown when you first visit our site. Rejecting cookies will not affect your ability to shop with us.
        </Section>

        <Section title="DATA SHARING">
          We share your delivery information with our shipping partners solely for the purpose of delivering your order. We use Revolut to process payments securely. We do not share your data with any other third parties for marketing purposes.
        </Section>

        <Section title="DATA RETENTION">
          We retain your order information for up to 7 years for legal and accounting purposes. You may request deletion of your personal data at any time by contacting us at support@vexer.org.
        </Section>

        <Section title="YOUR RIGHTS">
          You have the right to access the personal data we hold about you, request correction of inaccurate data, request deletion of your data, and opt out of any marketing communications. To exercise any of these rights contact us at <strong style={{ color: '#fff' }}>support@vexer.org</strong>.
        </Section>

        <Section title="CONTACT US">
          If you have any questions about this privacy policy or how we handle your data please contact us at <strong style={{ color: '#fff' }}>support@vexer.org</strong> or via our <a href="https://discord.gg/6Xk2HmgT9N" target="_blank" rel="noopener noreferrer" style={{ color: '#fff' }}>Discord</a>.
        </Section>
      </div>
    </div>
  )
}
