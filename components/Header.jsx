'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Heart, ShoppingBag, Menu, X } from 'lucide-react'
import { useCart } from '@/context/CartContext'

const GENDERS = ['MEN', 'WOMEN', 'KIDS', 'BABIES']

function IconButton({ children, count, ...props }) {
  return (
    <button
      {...props}
      style={{
        background: 'none', border: 'none', cursor: 'pointer', padding: 9,
        color: 'rgba(255,255,255,0.75)', position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: 8, transition: 'background 0.15s, color 0.15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#fff' }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.75)' }}
    >
      {children}
      {count > 0 && (
        <span className="font-orb" style={{ position: 'absolute', top: 2, right: 2, background: '#fff', color: '#050508', fontSize: 9, fontWeight: 700, borderRadius: '50%', width: 15, height: 15, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {count}
        </span>
      )}
    </button>
  )
}

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

        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <img src="/logo.png" alt="" style={{ height: 26, width: 'auto' }} />
          <span className="font-orb" style={{ fontSize: 18, fontWeight: 700, letterSpacing: '0.15em' }}>VEXER</span>
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

        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Link href="/wishlist" style={{ display: 'flex' }}>
            <IconButton count={wishlist.length}>
              <Heart size={19} strokeWidth={1.8} />
            </IconButton>
          </Link>

          <IconButton onClick={() => setCartOpen(true)} count={cartCount}>
            <ShoppingBag size={19} strokeWidth={1.8} />
          </IconButton>

          <div className="mobile-menu-btn" style={{ display: 'none' }}>
            <IconButton onClick={() => setMenuOpen(true)}>
              <Menu size={20} strokeWidth={1.8} />
            </IconButton>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div style={{ position: 'fixed', inset: 0, background: '#050508', zIndex: 600, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
            <span className="font-orb" style={{ fontSize: 18, fontWeight: 700 }}>VEXER</span>
            <button onClick={() => setMenuOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 8 }}>
              <X size={24} />
            </button>
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
