'use client'
import { motion } from 'framer-motion'

export function HowItWorks() {
  const steps = [
    { n: '01', t: 'Browse & Select', s: 'Find your perfect jersey from our collection of club, international and retro kits.' },
    { n: '02', t: 'Place Your Order', s: 'Choose size, add player name/number if desired and checkout securely worldwide.' },
    { n: '03', t: 'We Source & Deliver', s: 'We source your jersey and ship directly to your door. Worldwide delivery included.' },
  ]
  return (
    <section style={{ padding: '80px 24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="font-orb" style={{ fontSize: 9, letterSpacing: '0.5em', color: 'rgba(255,255,255,0.4)', marginBottom: 12 }}>SIMPLE PROCESS</div>
          <h2 className="font-orb" style={{ fontSize: 'clamp(1.5rem,3vw,2.5rem)', fontWeight: 800, color: '#fff' }}>HOW IT WORKS</h2>
        </div>
        <div className="mobile-grid-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 40 }}>
          {steps.map(({ n, t, s }, i) => (
            <motion.div key={n} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.15 }} style={{ textAlign: 'center', padding: '32px 24px' }}>
              <div className="font-orb" style={{ fontSize: 48, fontWeight: 900, color: 'rgba(255,255,255,0.06)', marginBottom: 16, lineHeight: 1 }}>{n}</div>
              <div className="font-orb" style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 10, letterSpacing: '0.05em' }}>{t}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7 }}>{s}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function TrustBadges() {
  const badges = [['🌍', 'Worldwide Delivery'], ['🔒', 'Secure Checkout'], ['⚡', 'Fast Processing'], ['💬', 'Discord Support'], ['✅', 'Premium Quality']]
  return (
    <div style={{ padding: 24, borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 40 }}>
        {badges.map(([icon, label]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 18 }}>{icon}</span>
            <span className="font-orb" style={{ fontSize: 9, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function DiscordCTA() {
  return (
    <section style={{ padding: '80px 24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>💬</div>
          <div className="font-orb" style={{ fontSize: 9, letterSpacing: '0.5em', color: 'rgba(255,255,255,0.4)', marginBottom: 12 }}>COMMUNITY</div>
          <h2 className="font-orb" style={{ fontSize: 'clamp(1.5rem,3vw,2.2rem)', fontWeight: 800, color: '#fff', marginBottom: 12 }}>
            CAN&apos;T FIND YOUR JERSEY?
          </h2>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.8, marginBottom: 32 }}>
            Join our Discord and open a ticket. We&apos;ll source any jersey you&apos;re looking for.
          </p>
          <a href="https://discord.gg/6Xk2HmgT9N" target="_blank" rel="noopener noreferrer" className="vx-btn vx-btn-white" style={{ padding: '14px 36px', fontSize: 10, letterSpacing: '0.2em', textDecoration: 'none', display: 'inline-flex' }}>
            JOIN DISCORD →
          </a>
        </motion.div>
      </div>
    </section>
  )
}
