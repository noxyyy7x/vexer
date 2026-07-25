'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const STATUS_COLORS = {
  pending_payment: '#fbbf24',
  processing: '#60a5fa',
  dispatched: '#4ade80',
  delivered: '#4ade80',
  cancelled: '#fca5a5',
  refunded: '#fca5a5',
}

const fmt = n => `£${Number(n).toFixed(2)}`

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [regionFilter, setRegionFilter] = useState('')

  async function load() {
    setLoading(true)
    let query = supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(200)
    if (statusFilter) query = query.eq('status', statusFilter)
    if (regionFilter) query = query.eq('region', regionFilter)
    const { data, error } = await query
    if (!error) setOrders(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [statusFilter, regionFilter])

  const filtered = orders.filter(o => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      o.order_number?.toLowerCase().includes(q) ||
      o.customer_name?.toLowerCase().includes(q) ||
      o.customer_email?.toLowerCase().includes(q)
    )
  })

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div className="font-orb" style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>ORDERS</div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>{orders.length} total</div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <input
          className="vx-input"
          placeholder="Search order #, name, or email…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: 280 }}
        />
        <select className="vx-input" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ maxWidth: 180, cursor: 'pointer' }}>
          <option value="">All statuses</option>
          <option value="pending_payment">Pending Payment</option>
          <option value="processing">Processing</option>
          <option value="dispatched">Dispatched</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
          <option value="refunded">Refunded</option>
        </select>
        <select className="vx-input" value={regionFilter} onChange={e => setRegionFilter(e.target.value)} style={{ maxWidth: 160, cursor: 'pointer' }}>
          <option value="">All regions</option>
          <option value="uk">UK</option>
          <option value="international">International</option>
        </select>
      </div>

      {loading ? (
        <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="vx-card" style={{ padding: 40, textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
          No orders match.
        </div>
      ) : (
        <div className="vx-card" style={{ overflow: 'auto' }}>
          <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {['Order', 'Customer', 'Items', 'Total', 'Status', 'Region', 'Date'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: 10, letterSpacing: '0.05em', color: 'rgba(255,255,255,0.35)', fontWeight: 500, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <Link href={`/admin/orders/${o.id}`} className="font-orb" style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>
                      {o.order_number}
                    </Link>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 12 }}>
                    <div>{o.customer_name}</div>
                    <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11 }}>{o.customer_email}</div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>{(o.items || []).length}</td>
                  <td style={{ padding: '12px 16px', fontSize: 12, fontWeight: 600 }}>
                    {fmt(o.total)}
                    {o.refunded_amount > 0 && <div style={{ fontSize: 10, color: '#fca5a5' }}>-{fmt(o.refunded_amount)} refunded</div>}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className="vx-badge" style={{ background: `${STATUS_COLORS[o.status]}1a`, color: STATUS_COLORS[o.status] || '#fff' }}>
                      {o.status?.replace('_', ' ')}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 11, color: 'rgba(255,255,255,0.55)' }}>{o.region?.toUpperCase()}</td>
                  <td style={{ padding: '12px 16px', fontSize: 11, color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap' }}>
                    {new Date(o.created_at).toLocaleDateString('en-GB')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
