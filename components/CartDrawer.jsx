'use client'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'

const fmt = p => `£${Number(p).toFixed(2)}`

export default function CartDrawer() {
  const { items, cartOpen, setCartOpen, removeFromCart, updateQty, cartTotal } = useCart()

  if (!cartOpen) return null

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 700 }}>
      <div
        onClick={() => setCartOpen(false)}
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }}
      />
      <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 'min(420px, 100%)', background: '#0a0a0f', borderLeft: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: 24, borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="font-orb" style={{ fontSize: 12, letterSpacing: '0.2em' }}>YOUR CART</span>
          <button onClick={() => setCartOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 22, cursor: 'pointer' }}>×</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>
              Your cart is empty.
            </div>
          ) : (
            items.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {item.image && <img src={item.image} alt={item.name} style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 6 }} />}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{item.team} — {item.name}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>
                    {item.size && `Size: ${item.size}`} {item.playerName && `· ${item.playerName} #${item.playerNumber}`}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <button onClick={() => updateQty(i, item.qty - 1)} className="vx-btn vx-btn-outline" style={{ width: 22, height: 22, padding: 0, fontSize: 12 }}>−</button>
                    <span style={{ fontSize: 12 }}>{item.qty}</span>
                    <button onClick={() => updateQty(i, item.qty + 1)} className="vx-btn vx-btn-outline" style={{ width: 22, height: 22, padding: 0, fontSize: 12 }}>+</button>
                    <span style={{ marginLeft: 'auto', fontSize: 13, fontWeight: 600 }}>{fmt(item.price * item.qty)}</span>
                  </div>
                </div>
                <button onClick={() => removeFromCart(i)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: 14 }}>×</button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div style={{ padding: 24, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>TOTAL</span>
              <span className="font-orb" style={{ fontSize: 16, fontWeight: 700 }}>{fmt(cartTotal)}</span>
            </div>
            <Link href="/checkout" onClick={() => setCartOpen(false)} className="vx-btn vx-btn-white" style={{ display: 'block', textAlign: 'center', padding: 14, fontSize: 10 }}>
              CHECKOUT
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
