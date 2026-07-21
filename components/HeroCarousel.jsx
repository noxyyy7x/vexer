'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const SLIDES = [
  { key: 'national', sub: 'Club Jerseys', label: 'NATIONAL', desc: "The world's greatest club kits. Premier League, La Liga, Serie A and more.", cta: 'SHOP NATIONAL', href: '/men?category=national', img: '/hero-national.jpg' },
  { key: 'international', sub: 'Country Kits', label: 'INTERNATIONAL', desc: 'Represent your nation. International kits from every corner of the globe.', cta: 'SHOP INTERNATIONAL', href: '/men?category=international', img: '/hero-international.jpg' },
  { key: 'retro', sub: 'Classic Kits', label: 'RETRO', desc: "Iconic jerseys from football's greatest eras. Own a piece of history.", cta: 'SHOP RETRO', href: '/men?category=retro', img: '/hero-retro.jpg' },
]

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setCurrent(c => (c + 1) % SLIDES.length), 5000)
    return () => clearInterval(t)
  }, [])

  const slide = SLIDES[current]

  return (
    <div style={{ height: '100vh', position: 'relative', overflow: 'hidden', paddingTop: 64 }}>
      <AnimatePresence mode="wait">
        <motion.div key={current} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }} style={{ position: 'absolute', inset: 0 }}>
          <img src={slide.img} alt={slide.label} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.35)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(5,5,8,0.3) 0%,rgba(5,5,8,0.6) 100%)' }} />
        </motion.div>
      </AnimatePresence>

      <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 24px' }}>
        <AnimatePresence mode="wait">
          <motion.div key={current} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.6 }}>
            <div className="font-orb" style={{ fontSize: 11, letterSpacing: '0.6em', color: 'rgba(255,255,255,0.4)', marginBottom: 16 }}>
              {slide.sub.toUpperCase()}
            </div>
            <h1 className="font-orb" style={{ fontSize: 'clamp(3rem,10vw,8rem)', fontWeight: 900, color: '#fff', lineHeight: 0.9, marginBottom: 24, letterSpacing: '-0.02em' }}>
              {slide.label}
            </h1>
            <p style={{ fontSize: 'clamp(13px,1.5vw,16px)', color: 'rgba(255,255,255,0.5)', marginBottom: 40, maxWidth: 480, margin: '0 auto 40px', lineHeight: 1.7 }}>
              {slide.desc}
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href={slide.href} className="vx-btn vx-btn-white" style={{ padding: '14px 36px', fontSize: 10, letterSpacing: '0.2em' }}>
                {slide.cta}
              </Link>
              <Link href="/men" className="vx-btn vx-btn-outline" style={{ padding: '14px 36px', fontSize: 10, letterSpacing: '0.2em' }}>
                ALL JERSEYS
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8, zIndex: 1 }}>
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            style={{ width: i === current ? 32 : 8, height: 3, background: i === current ? '#fff' : 'rgba(255,255,255,0.3)', border: 'none', cursor: 'pointer', borderRadius: 2, transition: 'all 0.4s' }}
          />
        ))}
      </div>
    </div>
  )
}
