'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'

const GENDERS = [
  { key: 'men', label: "MEN'S", sub: "All Men's Jerseys" },
  { key: 'women', label: "WOMEN'S", sub: "All Women's Jerseys" },
  { key: 'kids', label: "KIDS'", sub: "All Kids' Jerseys" },
  { key: 'babies', label: "BABIES'", sub: 'All Baby Jerseys' },
]

export default function GenderStrip() {
  return (
    <section style={{ padding: '80px 24px', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="font-orb" style={{ fontSize: 9, letterSpacing: '0.5em', color: 'rgba(255,255,255,0.4)', marginBottom: 12 }}>SHOP BY</div>
          <h2 className="font-orb" style={{ fontSize: 'clamp(1.5rem,3vw,2.5rem)', fontWeight: 800, color: '#fff' }}>FIND YOUR FIT</h2>
        </div>
        <div className="mobile-grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
          {GENDERS.map(({ key, label, sub }, i) => (
            <motion.div key={key} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
              <Link
                href={`/${key}`}
                style={{ display: 'block', padding: '32px 24px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, textAlign: 'center', background: 'rgba(255,255,255,0.02)' }}
              >
                <div className="font-orb" style={{ fontSize: 'clamp(1.2rem,2.5vw,2rem)', fontWeight: 800, color: '#fff', marginBottom: 8 }}>{label}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{sub}</div>
                <div className="font-orb" style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', marginTop: 12, letterSpacing: '0.2em' }}>SHOP →</div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
