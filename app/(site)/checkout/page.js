'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { useCurrency } from '@/context/CurrencyContext'
import { isShippingAllowed } from '@/lib/currency'

export default function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCart()
  const { formatPrice, currency } = useCurrency()
  const router = useRouter()
  const widgetRef = useRef(null)
  const destroyRef = useRef(null)

  const [form, setForm] = useState({ email: '', name: '', phone: '', line1: '', line2: '', city: '', postcode: '', country: '' })
  const [widgetMounted, setWidgetMounted] = useState(false)
  const [err, setErr] = useState('')
  const [placing, setPlacing] = useState(false)

  useEffect(() => {
    if (items.length === 0) router.replace('/')
  }, [items])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  function validate() {
    if (!form.email || !form.name || !form.line1 || !form.city || !form.postcode || !form.country) {
      return 'Please fill in all required fields.'
    }
    if (!isShippingAllowed(form.country)) {
      return "Sorry, we currently only ship to Europe, the UK and the USA — we can't deliver to this address."
    }
    return ''
  }

  async function handleContinueToPayment(e) {
    e.preventDefault()
    const validationError = validate()
    if (validationError) { setErr(validationError); return }
    setErr('')
    setPlacing(true)

    try {
      const RevolutCheckout = (await import('@revolut/checkout')).default
      const { destroy } = await RevolutCheckout.embeddedCheckout({
        publicToken: process.env.NEXT_PUBLIC_REVOLUT_PUBLIC_KEY,
        mode: process.env.NEXT_PUBLIC_REVOLUT_MODE || 'prod',
        locale: 'auto',
        target: widgetRef.current,
        createOrder: async () => {
          const res = await fetch('/api/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              items,
              customer: { email: form.email, name: form.name, phone: form.phone },
              shipping: { line1: form.line1, line2: form.line2, city: form.city, postcode: form.postcode, country: form.country },
            }),
          })
          const order = await res.json()
          if (!res.ok) throw new Error(order.error || 'Failed to create order')
          window.__vexerOrderId = order.orderId
          window.__vexerOrderNumber = order.orderNumber
          return { publicId: order.token }
        },
        onSuccess: () => {
          clearCart()
          router.push(`/order-confirmation?order=${window.__vexerOrderNumber || ''}`)
        },
        onError: ({ error }) => {
          setErr(error?.message || 'Payment failed. Please try again.')
          setPlacing(false)
        },
        onCancel: () => {
          setPlacing(false)
        },
      })
      destroyRef.current = destroy
      setWidgetMounted(true)
    } catch (e) {
      setErr(e.message || 'Could not start payment. Please try again.')
      setPlacing(false)
    }
  }

  useEffect(() => () => destroyRef.current?.(), [])

  return (
    <div style={{ minHeight: '100vh' }}>
      <div style={{ padding: '48px 24px 24px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="font-orb" style={{ fontSize: 9, letterSpacing: '0.5em', color: 'rgba(255,255,255,0.4)', marginBottom: 12 }}>VEXER</div>
        <h1 className="font-orb" style={{ fontSize: 'clamp(1.6rem,4vw,2.6rem)', fontWeight: 900, color: '#fff' }}>CHECKOUT</h1>
      </div>

      <div className="mobile-grid-1" style={{ maxWidth: 1000, margin: '0 auto', padding: '48px 24px 96px', display: 'grid', gridTemplateColumns: '1fr 380px', gap: 48, alignItems: 'start' }}>

        <div>
          {!widgetMounted ? (
            <form onSubmit={handleContinueToPayment}>
              <div className="font-orb" style={{ fontSize: 11, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.5)', marginBottom: 16 }}>CONTACT</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
                <input className="vx-input" placeholder="Full name *" value={form.name} onChange={e => set('name', e.target.value)} />
                <input className="vx-input" placeholder="Email *" type="email" value={form.email} onChange={e => set('email', e.target.value)} />
                <input className="vx-input" placeholder="Phone" value={form.phone} onChange={e => set('phone', e.target.value)} style={{ gridColumn: '1 / -1' }} />
              </div>

              <div className="font-orb" style={{ fontSize: 11, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.5)', marginBottom: 16 }}>SHIPPING ADDRESS</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
                <input className="vx-input" placeholder="Address line 1 *" value={form.line1} onChange={e => set('line1', e.target.value)} style={{ gridColumn: '1 / -1' }} />
                <input className="vx-input" placeholder="Address line 2" value={form.line2} onChange={e => set('line2', e.target.value)} style={{ gridColumn: '1 / -1' }} />
                <input className="vx-input" placeholder="City *" value={form.city} onChange={e => set('city', e.target.value)} />
                <input className="vx-input" placeholder="Postcode *" value={form.postcode} onChange={e => set('postcode', e.target.value)} />
                <input
                  className="vx-input"
                  placeholder="Country code (e.g. GB, US, FR) *"
                  value={form.country}
                  onChange={e => set('country', e.target.value.toUpperCase())}
                  maxLength={2}
                  style={{ gridColumn: '1 / -1' }}
                />
              </div>

              {err && (
                <div style={{ fontSize: 12, color: '#fca5a5', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 6, padding: '10px 14px', marginBottom: 20 }}>
                  {err}
                </div>
              )}

              <button type="submit" disabled={placing} className="vx-btn vx-btn-white" style={{ width: '100%', padding: 15, fontSize: 10, letterSpacing: '0.2em' }}>
                {placing ? 'LOADING PAYMENT…' : 'CONTINUE TO PAYMENT'}
              </button>
            </form>
          ) : (
            <div>
              <div className="font-orb" style={{ fontSize: 11, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.5)', marginBottom: 16 }}>PAYMENT</div>
              {err && (
                <div style={{ fontSize: 12, color: '#fca5a5', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 6, padding: '10px 14px', marginBottom: 16 }}>
                  {err}
                </div>
              )}
              <div ref={widgetRef} />
            </div>
          )}
        </div>

        <div className="vx-card" style={{ padding: 24 }}>
          <div className="font-orb" style={{ fontSize: 10, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.5)', marginBottom: 16 }}>ORDER SUMMARY</div>
          {items.map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 10, color: 'rgba(255,255,255,0.6)' }}>
              <span>{item.name} x{item.qty}</span>
              <span>{formatPrice(item.price * item.qty)}</span>
            </div>
          ))}
          <div className="vx-divider" style={{ margin: '16px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>TOTAL</span>
            <span className="font-orb" style={{ fontSize: 16, fontWeight: 700 }}>{formatPrice(cartTotal)}</span>
          </div>
          {currency !== 'GBP' && (
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 8 }}>
              You&apos;ll be charged £{cartTotal.toFixed(2)} GBP.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
