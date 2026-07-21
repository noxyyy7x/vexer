'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'

const GENDERS = ['MEN', 'WOMEN', 'KIDS', 'BABIES']

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { cartCount, setCartOpen, wishlist } = useCart()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`vx-nav${scrolled ? ' scrolled' : ''}`}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        <Link href="/" className="font-orb" style={{ fontSize: 18, fontWeight: 700, letterSpacing: '0.15em' }}>
          VEXER
        </Link>

        <div className="hide-mobile" style={{ display: 'flex', gap: 28 }}>
          {GENDERS.map(g => (
            <Link
              key={g}
              href={`/${g.toLowerCase()}`}
              className="font-orb"
              style={{ fontSize: 11, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.7)' }}
            >
              {g}
            </Link>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link href="/wishlist" style={{ padding: 8, fontSize: 18, color: 'rgba(255,255,255,0.7)', position: 'relative' }}>
            ♡
            {wishlist.length > 0 && (
              <span style={{ position: 'absolute', top: 2, right: 2, background: '#fff', color: '#050508', fontSize: 9, borderRadius: '50%', width: 14, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-orbitron)' }}>
                {wishlist.length}
              </span>
            )}
          </Link>

          <button
            onClick={() => setCartOpen(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, fontSize: 18, color: 'rgba(255,255,255,0.7)', position: 'relative' }}
          >
            🛒
            {cartCount > 0 && (
              <span style={{ position: 'absolute', top: 2, right: 2, background: '#fff', color: '#050508', fontSize: 9, borderRadius: '50%', width: 14, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-orbitron)' }}>
                {cartCount}
              </span>
            )}
          </button>

          <button
            className="mobile-menu-btn"
            onClick={() => setMenuOpen(true)}
            style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 8, fontSize: 20, color: '#fff' }}
          >
            ☰
          </button>
        </div>
      </div>

      {menuOpen && (
        <div style={{ position: 'fixed', inset: 0, background: '#050508', zIndex: 600, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
            <span className="font-orb" style={{ fontSize: 18, fontWeight: 700 }}>VEXER</span>
            <button onClick={() => setMenuOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 24, cursor: 'pointer' }}>×</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {GENDERS.map(g => (
              <Link
                key={g}
                href={`/${g.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
                className="font-orb"
                style={{ fontSize: 22, letterSpacing: '0.1em' }}
              >
                {g}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
