'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const fmt = n => `£${Number(n || 0).toFixed(2)}`
const FIFTEEN_MIN = 15 * 60 * 1000

function useElapsed(createdAt) {
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])
  const elapsed = now - new Date(createdAt).getTime()
  const remaining = Math.max(0, FIFTEEN_MIN - elapsed)
  return { withinWindow: remaining > 0, remaining }
}

export default function OrderDetailPage() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')
  const [refundingIndex, setRefundingIndex] = useState(null)
  const [tracking, setTracking] = useState('')
  const [dispatching, setDispatching] = useState(false)

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('orders').select('*').eq('id', id).maybeSingle()
    setOrder(data)
    setTracking(data?.tracking_number || '')
    setLoading(false)
  }

  useEffect(() => { load() }, [id])

  const { withinWindow, remaining } = useElapsed(order?.created_at || Date.now())
  const minutesLeft = Math.floor(remaining / 60000)
  const secondsLeft = Math.floor((remaining % 60000) / 1000)

  async function handleRefund(index) {
    if (!confirm('Refund this item? This immediately returns money to the customer via Revolut and cannot be undone.')) return
    setRefundingIndex(index)
    setErr('')
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch('/api/admin/refund-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token}` },
        body: JSON.stringify({ orderId: order.id, itemIndex: index }),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'Refund failed.')
      await load()
    } catch (e) {
      setErr(e.message)
    }
    setRefundingIndex(null)
  }

  async function handleDispatch() {
    if (!tracking.trim()) { setErr('Enter a tracking number first.'); return }
    setDispatching(true)
    setErr('')
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch('/api/admin/dispatch-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token}` },
        body: JSON.stringify({ orderId: order.id, trackingNumber: tracking.trim() }),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'Dispatch failed.')
      await load()
    } catch (e) {
      setErr(e.message)
    }
    setDispatching(false)
  }

  if (loading) return <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>Loading…</div>
  if (!order) return <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>Order not found.</div>

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div className="font-orb" style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{order.order_number}</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>{new Date(order.created_at).toLocaleString('en-GB')}</div>
        </div>
        {withinWindow && order.status !== 'cancelled' && order.status !== 'refunded' && (
          <div className="vx-card" style={{ padding: '8px 14px', borderColor: '#fbbf24', fontSize: 11, color: '#fbbf24' }}>
            ⏱ Free cancellation window: {minutesLeft}:{String(secondsLeft).padStart(2, '0')} remaining
          </div>
        )}
      </div>

      {err && <div className="vx-card" style={{ padding: 14, marginBottom: 20, borderColor: '#fca5a5', fontSize: 12, color: '#fca5a5' }}>{err}</div>}

      <div className="mobile-grid-1" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
        <div>
          <div className="vx-card" style={{ padding: 20, marginBottom: 20 }}>
            <div className="font-orb" style={{ fontSize: 11, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)', marginBottom: 16 }}>ITEMS</div>
            {(order.items || []).map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < order.items.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none', opacity: item.refunded ? 0.4 : 1 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{item.team ? `${item.team} — ` : ''}{item.name}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
                    {item.size && `Size ${item.size}`} {item.qty > 1 && `· Qty ${item.qty}`} {item.playerName && `· ${item.playerName} #${item.playerNumber}`}
                  </div>
                  {item.refunded && <div style={{ fontSize: 10, color: '#fca5a5', marginTop: 2 }}>REFUNDED</div>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{fmt(item.price * item.qty)}</span>
                  {!item.refunded && order.status !== 'cancelled' && (
                    <button
                      onClick={() => handleRefund(i)}
                      disabled={refundingIndex === i}
                      className="vx-btn vx-btn-outline"
                      style={{ padding: '6px 12px', fontSize: 9, borderColor: '#fca5a5', color: '#fca5a5' }}
                    >
                      {refundingIndex === i ? 'REFUNDING…' : 'REFUND'}
                    </button>
                  )}
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 14, marginTop: 4, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>TOTAL</span>
              <div style={{ textAlign: 'right' }}>
                <div className="font-orb" style={{ fontSize: 15, fontWeight: 700 }}>{fmt(order.total)}</div>
                {order.refunded_amount > 0 && <div style={{ fontSize: 11, color: '#fca5a5' }}>-{fmt(order.refunded_amount)} refunded</div>}
              </div>
            </div>
          </div>

          <div className="vx-card" style={{ padding: 20 }}>
            <div className="font-orb" style={{ fontSize: 11, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)', marginBottom: 16 }}>DISPATCH</div>
            {order.status === 'dispatched' || order.status === 'delivered' ? (
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
                Dispatched {order.dispatched_at && new Date(order.dispatched_at).toLocaleDateString('en-GB')} — tracking: <strong>{order.tracking_number}</strong>
              </div>
            ) : order.status === 'pending_payment' ? (
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Awaiting payment confirmation.</div>
            ) : order.status === 'cancelled' || order.status === 'refunded' ? (
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>This order was cancelled/refunded.</div>
            ) : (
              <div style={{ display: 'flex', gap: 10 }}>
                <input className="vx-input" placeholder="Tracking number" value={tracking} onChange={e => setTracking(e.target.value)} />
                <button onClick={handleDispatch} disabled={dispatching} className="vx-btn vx-btn-white" style={{ padding: '0 20px', fontSize: 10, whiteSpace: 'nowrap' }}>
                  {dispatching ? '…' : 'DISPATCH'}
                </button>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="vx-card" style={{ padding: 20, marginBottom: 16 }}>
            <div className="font-orb" style={{ fontSize: 11, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)', marginBottom: 12 }}>CUSTOMER</div>
            <div style={{ fontSize: 13, marginBottom: 4 }}>{order.customer_name}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>{order.customer_email}</div>
            {order.customer_phone && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{order.customer_phone}</div>}
          </div>

          <div className="vx-card" style={{ padding: 20 }}>
            <div className="font-orb" style={{ fontSize: 11, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)', marginBottom: 12 }}>SHIPPING</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.8 }}>
              {order.shipping_line1}<br />
              {order.shipping_line2 && <>{order.shipping_line2}<br /></>}
              {order.shipping_city}, {order.shipping_postcode}<br />
              {order.shipping_country}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
