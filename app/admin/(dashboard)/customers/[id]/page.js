'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const fmt = n => `£${Number(n || 0).toFixed(2)}`

const STATUS_COLORS = {
  pending_payment: '#fbbf24',
  processing: '#60a5fa',
  dispatched: '#4ade80',
  delivered: '#4ade80',
  cancelled: '#fca5a5',
  refunded: '#fca5a5',
}

export default function CustomerDetailPage() {
  const { id } = useParams()
  const [customer, setCustomer] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function load() {
    setLoading(true)
    const { data: c } = await supabase.from('customers').select('*').eq('id', id).maybeSingle()
    setCustomer(c)
    setNotes(c?.notes || '')
    if (c?.email) {
      const { data: o } = await supabase.from('orders').select('*').eq('customer_email', c.email).order('created_at', { ascending: false })
      setOrders(o || [])
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [id])

  async function saveNotes() {
    setSaving(true)
    const { error } = await supabase.from('customers').update({ notes }).eq('id', id)
    setSaving(false)
    if (!error) { setSaved(true); setTimeout(() => setSaved(false), 1500) }
  }

  if (loading) return <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>Loading…</div>
  if (!customer) return <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>Customer not found.</div>

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ marginBottom: 24 }}>
        <div className="font-orb" style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{customer.name || customer.email}</div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>{customer.email}</div>
      </div>

      <div className="mobile-grid-1" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24 }}>
        <div>
          <div className="vx-card" style={{ padding: 20, marginBottom: 20 }}>
            <div className="font-orb" style={{ fontSize: 11, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)', marginBottom: 16 }}>ORDER HISTORY</div>
            {orders.length === 0 ? (
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>No orders yet.</div>
            ) : (
              orders.map(o => (
                <Link
                  key={o.id}
                  href={`/admin/orders/${o.id}`}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <div>
                    <div className="font-orb" style={{ fontSize: 11, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{o.order_number}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{new Date(o.created_at).toLocaleDateString('en-GB')} · {(o.items || []).length} item{(o.items || []).length !== 1 ? 's' : ''}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span className="vx-badge" style={{ background: `${STATUS_COLORS[o.status]}1a`, color: STATUS_COLORS[o.status] || '#fff' }}>
                      {o.status?.replace('_', ' ')}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{fmt(o.total)}</span>
                  </div>
                </Link>
              ))
            )}
          </div>

          <div className="vx-card" style={{ padding: 20 }}>
            <div className="font-orb" style={{ fontSize: 11, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)', marginBottom: 12 }}>STAFF NOTES</div>
            <textarea
              className="vx-input"
              rows={4}
              placeholder="e.g. VIP customer, prefers Discord contact, had a delivery issue on order #..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              style={{ resize: 'vertical', marginBottom: 10 }}
            />
            <button onClick={saveNotes} disabled={saving} className="vx-btn vx-btn-white" style={{ padding: '8px 20px', fontSize: 9 }}>
              {saving ? 'SAVING…' : saved ? '✓ SAVED' : 'SAVE NOTES'}
            </button>
          </div>
        </div>

        <div>
          <div className="vx-card" style={{ padding: 20, marginBottom: 16 }}>
            <div className="font-orb" style={{ fontSize: 11, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)', marginBottom: 16 }}>STATS</div>
            <StatRow label="Total Orders" value={customer.total_orders} />
            <StatRow label="Total Spent" value={fmt(customer.total_spent)} />
            <StatRow label="First Order" value={customer.first_order_at ? new Date(customer.first_order_at).toLocaleDateString('en-GB') : '—'} />
            <StatRow label="Last Order" value={customer.last_order_at ? new Date(customer.last_order_at).toLocaleDateString('en-GB') : '—'} last />
          </div>

          <div className="vx-card" style={{ padding: 20 }}>
            <div className="font-orb" style={{ fontSize: 11, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)', marginBottom: 12 }}>CONTACT</div>
            {customer.phone && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>{customer.phone}</div>}
            {(customer.city || customer.country) && (
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{[customer.city, customer.country].filter(Boolean).join(', ')}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatRow({ label, value, last }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: last ? 'none' : '1px solid rgba(255,255,255,0.06)' }}>
      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{label}</span>
      <span style={{ fontSize: 12, fontWeight: 600 }}>{value ?? '—'}</span>
    </div>
  )
}
