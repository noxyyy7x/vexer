'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const emptyForm = { code: '', type: 'percentage', value: '', expiresAt: '', usageLimit: '', minOrderValue: '' }

function useCountdown(targetIso) {
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    if (!targetIso) return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [targetIso])
  if (!targetIso) return null
  const diff = new Date(targetIso).getTime() - now
  if (diff <= 0) return { expired: true }
  const d = Math.floor(diff / 86400000)
  const h = Math.floor((diff % 86400000) / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  const s = Math.floor((diff % 60000) / 1000)
  return { expired: false, d, h, m, s }
}

function CountdownBadge({ expiresAt }) {
  const c = useCountdown(expiresAt)
  if (!expiresAt) return <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>No expiry</span>
  if (c?.expired) return <span style={{ fontSize: 11, color: '#fca5a5' }}>Expired</span>
  return (
    <span className="font-orb" style={{ fontSize: 11, color: '#fbbf24', fontWeight: 700 }}>
      {c.d > 0 && `${c.d}d `}{String(c.h).padStart(2, '0')}:{String(c.m).padStart(2, '0')}:{String(c.s).padStart(2, '0')}
    </span>
  )
}

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  async function load() {
    setLoading(true)
    const { data, error } = await supabase.from('discounts').select('*').order('created_at', { ascending: false })
    if (!error) setDiscounts(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleCreate(e) {
    e.preventDefault()
    setErr('')
    if (!form.code.trim() || !form.value) { setErr('Code and value are required.'); return }
    setSaving(true)
    const { error } = await supabase.from('discounts').insert({
      code: form.code.trim().toUpperCase(),
      type: form.type,
      value: Number(form.value),
      expires_at: form.expiresAt ? new Date(form.expiresAt).toISOString() : null,
      usage_limit: form.usageLimit ? Number(form.usageLimit) : null,
      min_order_value: form.minOrderValue ? Number(form.minOrderValue) : null,
    })
    setSaving(false)
    if (error) { setErr(error.message.includes('duplicate') ? 'That code already exists.' : error.message); return }
    setForm(emptyForm)
    setShowForm(false)
    load()
  }

  async function toggleActive(d) {
    await supabase.from('discounts').update({ is_active: !d.is_active }).eq('id', d.id)
    load()
  }

  async function deleteDiscount(d) {
    if (!confirm(`Delete code "${d.code}"? This can't be undone.`)) return
    await supabase.from('discounts').delete().eq('id', d.id)
    load()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <div className="font-orb" style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>DISCOUNTS</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>Create and manage discount codes.</div>
        </div>
        <button onClick={() => setShowForm(s => !s)} className="vx-btn vx-btn-white" style={{ padding: '10px 20px', fontSize: 10 }}>
          {showForm ? 'CANCEL' : '+ NEW CODE'}
        </button>
      </div>

      {err && <div className="vx-card" style={{ padding: 14, marginBottom: 20, borderColor: '#fca5a5', fontSize: 12, color: '#fca5a5' }}>{err}</div>}

      {showForm && (
        <form onSubmit={handleCreate} className="vx-card" style={{ padding: 24, marginBottom: 28 }}>
          <div className="admin-grid-3" style={{ marginBottom: 14 }}>
            <div>
              <label style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', display: 'block', marginBottom: 6 }}>CODE</label>
              <input className="vx-input" value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} placeholder="SUMMER10" required />
            </div>
            <div>
              <label style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', display: 'block', marginBottom: 6 }}>TYPE</label>
              <select className="vx-input" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} style={{ cursor: 'pointer' }}>
                <option value="percentage">Percentage off</option>
                <option value="fixed">Fixed amount off</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', display: 'block', marginBottom: 6 }}>
                VALUE {form.type === 'percentage' ? '(%)' : '(£)'}
              </label>
              <input className="vx-input" type="number" step="0.01" min="0" value={form.value} onChange={e => setForm(f => ({ ...f, value: e.target.value }))} placeholder={form.type === 'percentage' ? '10' : '5.00'} required />
            </div>
          </div>

          <div className="admin-grid-3" style={{ marginBottom: 20 }}>
            <div>
              <label style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', display: 'block', marginBottom: 6 }}>
                EXPIRES <span style={{ color: 'rgba(255,255,255,0.3)' }}>(optional)</span>
              </label>
              <input className="vx-input" type="datetime-local" value={form.expiresAt} onChange={e => setForm(f => ({ ...f, expiresAt: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', display: 'block', marginBottom: 6 }}>
                USAGE LIMIT <span style={{ color: 'rgba(255,255,255,0.3)' }}>(optional)</span>
              </label>
              <input className="vx-input" type="number" min="1" value={form.usageLimit} onChange={e => setForm(f => ({ ...f, usageLimit: e.target.value }))} placeholder="Unlimited" />
            </div>
            <div>
              <label style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', display: 'block', marginBottom: 6 }}>
                MIN ORDER (£) <span style={{ color: 'rgba(255,255,255,0.3)' }}>(optional)</span>
              </label>
              <input className="vx-input" type="number" step="0.01" min="0" value={form.minOrderValue} onChange={e => setForm(f => ({ ...f, minOrderValue: e.target.value }))} placeholder="None" />
            </div>
          </div>

          <button type="submit" disabled={saving} className="vx-btn vx-btn-white" style={{ padding: '10px 24px', fontSize: 10 }}>
            {saving ? 'CREATING…' : 'CREATE CODE'}
          </button>
        </form>
      )}

      {loading ? (
        <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>Loading…</div>
      ) : discounts.length === 0 ? (
        <div className="vx-card" style={{ padding: 40, textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
          No discount codes yet.
        </div>
      ) : (
        <div className="vx-card" style={{ overflow: 'auto' }}>
          <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {['Code', 'Discount', 'Uses', 'Min Order', 'Expires In', 'Active'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: 10, letterSpacing: '0.05em', color: 'rgba(255,255,255,0.35)', fontWeight: 500, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
                <th />
              </tr>
            </thead>
            <tbody>
              {discounts.map(d => (
                <tr key={d.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <span className="font-orb" style={{ fontSize: 12, fontWeight: 700 }}>{d.code}</span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 12 }}>
                    {d.type === 'percentage' ? `${d.value}% off` : `£${Number(d.value).toFixed(2)} off`}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>
                    {d.usage_count}{d.usage_limit ? ` / ${d.usage_limit}` : ''}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>
                    {d.min_order_value ? `£${Number(d.min_order_value).toFixed(2)}` : '—'}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <CountdownBadge expiresAt={d.expires_at} />
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <button
                      onClick={() => toggleActive(d)}
                      className="vx-btn vx-btn-outline"
                      style={{ padding: '5px 12px', fontSize: 9, borderColor: d.is_active ? '#4ade80' : 'rgba(255,255,255,0.15)', color: d.is_active ? '#4ade80' : 'rgba(255,255,255,0.55)' }}
                    >
                      {d.is_active ? 'ACTIVE' : 'DISABLED'}
                    </button>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <button onClick={() => deleteDiscount(d)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: 14 }}>×</button>
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
