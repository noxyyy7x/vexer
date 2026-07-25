'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

const GENDERS = [
  { key: 'men', label: "MEN'S", letter: 'M', sub: "All Men's Jerseys" },
  { key: 'women', label: "WOMEN'S", letter: 'W', sub: "All Women's Jerseys" },
  { key: 'kids', label: "KIDS'", letter: 'K', sub: "All Kids' Jerseys" },
  { key: 'babies', label: "BABIES'", letter: 'B', sub: 'All Baby Jerseys' },
]

export default function GenderStrip() {
  return (
    <section style={{ padding: '90px 24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <div className="font-orb" style={{ fontSize: 10, letterSpacing: '0.5em', color: 'rgba(255,255,255,0.4)', marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
            <span style={{ width: 28, height: 1, background: 'rgba(255,255,255,0.3)' }} />
            SHOP BY
            <span style={{ width: 28, height: 1, background: 'rgba(255,255,255,0.3)' }} />
          </div>
          <h2 className="font-orb" style={{ fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 900, color: '#fff' }}>FIND YOUR FIT</h2>
        </div>

        <div className="mobile-grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
          {GENDERS.map(({ key, label, letter, sub }, i) => (
            <motion.div key={key} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }}>
              <GenderTile href={`/${key}`} label={label} letter={letter} sub={sub} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function GenderTile({ href, label, letter, sub }) {
  return (
    <Link
      href={href}
      style={{
        position: 'relative', display: 'block', padding: '40px 24px', minHeight: 190,
        borderRadius: 14, overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.08)',
        background: 'linear-gradient(160deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
      }}
      className="gender-tile"
    >
      <div
        className="font-orb"
        style={{
          position: 'absolute', top: -20, right: -6, fontSize: 130, fontWeight: 900,
          color: 'rgba(255,255,255,0.035)', lineHeight: 1, userSelect: 'none', pointerEvents: 'none',
        }}
      >
        {letter}
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div className="font-orb" style={{ fontSize: 'clamp(1.3rem,2.6vw,1.9rem)', fontWeight: 800, color: '#fff', marginBottom: 8 }}>{label}</div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 22 }}>{sub}</div>
        <div className="font-orb" style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.15em', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          SHOP NOW
          <ArrowUpRight size={13} className="gender-tile-arrow" style={{ transition: 'transform 0.25s cubic-bezier(0.22,1,0.36,1)' }} />
        </div>
      </div>

      <style>{`
        .gender-tile { transition: border-color 0.25s, background 0.25s, transform 0.25s cubic-bezier(0.22,1,0.36,1); }
        .gender-tile:hover { border-color: rgba(255,255,255,0.22); background: linear-gradient(160deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02)); transform: translateY(-3px); }
        .gender-tile:hover .gender-tile-arrow { transform: translate(3px,-3px); }
      `}</style>
    </Link>
  )
}
