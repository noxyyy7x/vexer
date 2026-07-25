'use client'
import { motion } from 'framer-motion'
import { Search, CreditCard, Truck, Globe2, Lock, Zap, MessageCircle, ShieldCheck } from 'lucide-react'

export function HowItWorks() {
  const steps = [
    { n: '01', icon: Search, t: 'Browse & Select', s: 'Find your perfect jersey from our collection of club, international and retro kits.' },
    { n: '02', icon: CreditCard, t: 'Place Your Order', s: 'Choose your size, add a player name/number if desired, and check out securely.' },
    { n: '03', icon: Truck, t: 'We Source & Deliver', s: 'We source your jersey and ship it directly to your door across Europe, the UK and USA.' },
  ]
  return (
    <section style={{ padding: '80px 24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <div className="font-orb" style={{ fontSize: 10, letterSpacing: '0.5em', color: 'rgba(255,255,255,0.4)', marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
            <span style={{ width: 28, height: 1, background: 'rgba(255,255,255,0.3)' }} />
            SIMPLE PROCESS
            <span style={{ width: 28, height: 1, background: 'rgba(255,255,255,0.3)' }} />
          </div>
          <h2 className="font-orb" style={{ fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 900, color: '#fff' }}>HOW IT WORKS</h2>
        </div>
        <div className="mobile-grid-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 32 }}>
          {steps.map(({ n, icon: Icon, t, s }, i) => (
            <motion.div key={n} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.15 }} style={{ position: 'relative', textAlign: 'center', padding: '36px 24px', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, background: 'rgba(255,255,255,0.015)' }}>
              <div className="font-orb" style={{ position: 'absolute', top: 8, right: 20, fontSize: 52, fontWeight: 900, color: 'rgba(255,255,255,0.04)', lineHeight: 1 }}>{n}</div>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <Icon size={22} strokeWidth={1.8} color="#fff" />
              </div>
              <div className="font-orb" style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 10, letterSpacing: '0.03em' }}>{t}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7 }}>{s}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function TrustBadges() {
  const badges = [
    { icon: Globe2, label: 'Europe · UK · USA Delivery' },
    { icon: Lock, label: 'Secure Checkout' },
    { icon: Zap, label: 'Fast Processing' },
    { icon: MessageCircle, label: 'Discord Support' },
    { icon: ShieldCheck, label: 'Premium Quality' },
  ]
  return (
    <div style={{ padding: '36px 24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '20px 44px' }}>
        {badges.map(({ icon: Icon, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Icon size={16} strokeWidth={1.8} color="rgba(255,255,255,0.5)" />
            <span className="font-orb" style={{ fontSize: 9.5, letterSpacing: '0.13em', color: 'rgba(255,255,255,0.45)' }}>{label}</span>
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
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(88,101,242,0.12)', border: '1px solid rgba(88,101,242,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <MessageCircle size={26} strokeWidth={1.8} color="#8a97f4" />
          </div>
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
