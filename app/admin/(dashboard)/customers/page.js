'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const fmt = n => `£${Number(n || 0).toFixed(2)}`

const SORTS = [
  { key: 'last_order_at', label: 'Most Recent Order' },
  { key: 'total_spent', label: 'Highest Spend' },
  { key: 'total_orders', label: 'Most Orders' },
  { key: 'created_at', label: 'Newest Customer' },
]

export default function CustomersPage() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState('last_order_at')

  async function load() {
    setLoading(true)
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order(sortKey, { ascending: false, nullsFirst: false })
      .limit(300)
    if (!error) setCustomers(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [sortKey])

  const filtered = customers.filter(c => {
    if (!search) return true
    const q = search.toLowerCase()
    return c.email?.toLowerCase().includes(q) || c.name?.toLowerCase().includes(q)
  })

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div className="font-orb" style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>CUSTOMERS</div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>{customers.length} total</div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <input
          className="vx-input"
          placeholder="Search name or email…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: 280 }}
        />
        <select className="vx-input" value={sortKey} onChange={e => setSortKey(e.target.value)} style={{ maxWidth: 220, cursor: 'pointer' }}>
          {SORTS.map(s => <option key={s.key} value={s.key}>Sort: {s.label}</option>)}
        </select>
      </div>

      {loading ? (
        <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="vx-card" style={{ padding: 40, textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
          No customers match.
        </div>
      ) : (
        <div className="vx-card" style={{ overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {['Customer', 'Location', 'Orders', 'Total Spent', 'Last Order'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: 10, letterSpacing: '0.05em', color: 'rgba(255,255,255,0.35)', fontWeight: 500, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <Link href={`/admin/customers/${c.id}`} style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>{c.name || '—'}</Link>
                    <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11 }}>{c.email}</div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>
                    {[c.city, c.country].filter(Boolean).join(', ') || '—'}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 12 }}>{c.total_orders}</td>
                  <td style={{ padding: '12px 16px', fontSize: 12, fontWeight: 600 }}>{fmt(c.total_spent)}</td>
                  <td style={{ padding: '12px 16px', fontSize: 11, color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap' }}>
                    {c.last_order_at ? new Date(c.last_order_at).toLocaleDateString('en-GB') : '—'}
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
