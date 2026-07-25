'use client'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useCurrency } from '@/context/CurrencyContext'

export default function CartDrawer() {
  const { items, cartOpen, setCartOpen, removeFromCart, updateQty, cartTotal } = useCart()
  const { formatPrice: fmt, currency, shippingAllowed } = useCurrency()

  return (
    <AnimatePresence>
      {cartOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 700 }}>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)' }}
          />
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 'min(430px, 100%)', background: '#0a0a0f', borderLeft: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column' }}
          >
            <div style={{ padding: '22px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <ShoppingBag size={16} strokeWidth={2} />
                <span className="font-orb" style={{ fontSize: 12, letterSpacing: '0.2em' }}>YOUR CART {items.length > 0 && `(${items.length})`}</span>
              </div>
              <button onClick={() => setCartOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', padding: 6, display: 'flex' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
              {items.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 20px', color: 'rgba(255,255,255,0.3)' }}>
                  <ShoppingBag size={36} strokeWidth={1.5} style={{ marginBottom: 16, opacity: 0.5 }} />
                  <div style={{ fontSize: 13 }}>Your cart is empty.</div>
                </div>
              ) : (
                items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 14, marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    {item.image && <img src={item.image} alt={item.name} style={{ width: 68, height: 68, objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }} />}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{item.team ? `${item.team} — ` : ''}{item.name}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 10 }}>
                        {item.size && `Size ${item.size}`} {item.version && `· ${item.version === 'player' ? 'Player Version' : 'Fan Version'}`} {item.playerName && `· ${item.playerName} #${item.playerNumber}`}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '4px 10px' }}>
                          <button onClick={() => updateQty(i, item.qty - 1)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', padding: 2 }}><Minus size={12} /></button>
                          <span style={{ fontSize: 12, minWidth: 14, textAlign: 'center' }}>{item.qty}</span>
                          <button onClick={() => updateQty(i, item.qty + 1)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', padding: 2 }}><Plus size={12} /></button>
                        </div>
                        <span style={{ marginLeft: 'auto', fontSize: 13, fontWeight: 600 }}>{fmt(item.price * item.qty)}</span>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(i)} aria-label="Remove item" style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', display: 'flex', height: 'fit-content', padding: 4 }}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div style={{ padding: '20px 24px 24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>TOTAL</span>
                  <span className="font-orb" style={{ fontSize: 17, fontWeight: 700 }}>{fmt(cartTotal)}</span>
                </div>
                {currency !== 'GBP' && (
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginBottom: 16 }}>
                    Shown in {currency} for reference — you&apos;ll be charged in GBP at checkout.
                  </div>
                )}
                {!shippingAllowed && (
                  <div style={{ fontSize: 11, color: '#fbbf24', background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: 6, padding: '10px 12px', marginBottom: 16 }}>
                    We currently only ship to Europe, the UK and the USA. Your location may not be eligible for delivery.
                  </div>
                )}
                <Link href="/checkout" onClick={() => setCartOpen(false)} className="vx-btn vx-btn-white" style={{ display: 'block', textAlign: 'center', padding: 15, fontSize: 10, letterSpacing: '0.15em' }}>
                  CHECKOUT
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
