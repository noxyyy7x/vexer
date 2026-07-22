'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAdminAuth } from '@/context/AdminAuthContext'

const PERMISSIONS = [
  { key: 'orders', label: 'Orders' },
  { key: 'customers', label: 'Customers' },
  { key: 'products', label: 'Products' },
  { key: 'collections', label: 'Collections' },
  { key: 'reviews', label: 'Reviews' },
  { key: 'discounts', label: 'Discounts' },
  { key: 'settings', label: 'Settings' },
]

const emptyForm = { email: '', name: '', authUserId: '', permissions: Object.fromEntries(PERMISSIONS.map(p => [p.key, false])) }

export default function StaffPage() {
  const { isOwner, loading: authLoading } = useAdminAuth()
  const router = useRouter()

  const [staffList, setStaffList] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  useEffect(() => {
    if (!authLoading && !isOwner) router.replace('/admin')
  }, [authLoading, isOwner])

  async function load() {
    setLoading(true)
    const { data, error } = await supabase.from('staff').select('*').order('created_at', { ascending: true })
    if (error) setErr(error.message)
    else setStaffList(data)
    setLoading(false)
  }

  useEffect(() => { if (isOwner) load() }, [isOwner])

  async function toggleActive(row) {
    const { error } = await supabase.from('staff').update({ is_active: !row.is_active }).eq('id', row.id)
    if (error) { setErr(error.message); return }
    load()
  }

  async function updatePermission(row, key, value) {
    const newPerms = { ...row.permissions, [key]: value }
    const { error } = await supabase.from('staff').update({ permissions: newPerms }).eq('id', row.id)
    if (error) { setErr(error.message); return }
    load()
  }

  async function handleCreate(e) {
    e.preventDefault()
    setErr('')
    if (!form.authUserId) { setErr('Paste the Supabase Auth User UID for this person (create them in Authentication → Users first).'); return }
    setSaving(true)
    const { error } = await supabase.from('staff').insert({
      auth_user_id: form.authUserId,
      email: form.email,
      name: form.name,
      role: 'staff',
      permissions: form.permissions,
    })
    setSaving(false)
    if (error) { setErr(error.message); return }
    setForm(emptyForm)
    setShowForm(false)
    load()
  }

  if (authLoading || !isOwner) return null

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <div className="font-orb" style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>STAFF</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>Manage who has access, and to what.</div>
        </div>
        <button onClick={() => setShowForm(s => !s)} className="vx-btn vx-btn-white" style={{ padding: '10px 20px', fontSize: 10 }}>
          {showForm ? 'CANCEL' : '+ ADD STAFF'}
        </button>
      </div>

      {err && <div className="vx-card" style={{ padding: 14, marginBottom: 20, borderColor: '#fca5a5', fontSize: 12, color: '#fca5a5' }}>{err}</div>}

      {showForm && (
        <form onSubmit={handleCreate} className="vx-card" style={{ padding: 24, marginBottom: 28 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            <div>
              <label style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', display: 'block', marginBottom: 6 }}>NAME</label>
              <input className="vx-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <div>
              <label style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', display: 'block', marginBottom: 6 }}>EMAIL</label>
              <input className="vx-input" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', display: 'block', marginBottom: 6 }}>
              SUPABASE AUTH USER UID <span style={{ color: 'rgba(255,255,255,0.35)' }}>(create the login in Authentication → Users first, then paste their UID)</span>
            </label>
            <input className="vx-input" value={form.authUserId} onChange={e => setForm(f => ({ ...f, authUserId: e.target.value }))} placeholder="e.g. 8f14e45f-ceea-4c7a-b1c8-..." />
          </div>

          <label style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', display: 'block', marginBottom: 10 }}>PERMISSIONS</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
            {PERMISSIONS.map(p => (
              <label key={p.key} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, cursor: 'pointer' }}>
                <input type="checkbox" checked={form.permissions[p.key]} onChange={e => setForm(f => ({ ...f, permissions: { ...f.permissions, [p.key]: e.target.checked } }))} />
                {p.label}
              </label>
            ))}
          </div>

          <button type="submit" disabled={saving} className="vx-btn vx-btn-white" style={{ padding: '10px 24px', fontSize: 10 }}>
            {saving ? 'SAVING…' : 'CREATE STAFF ACCOUNT'}
          </button>
        </form>
      )}

      {loading ? (
        <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>Loading…</div>
      ) : (
        <div className="vx-card" style={{ overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {['Name', 'Email', 'Role', ...PERMISSIONS.map(p => p.label), 'Active'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: 10, letterSpacing: '0.05em', color: 'rgba(255,255,255,0.35)', fontWeight: 500, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {staffList.map(row => (
                <tr key={row.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <td style={{ padding: '12px 16px', fontSize: 12 }}>{row.name}</td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>{row.email}</td>
                  <td style={{ padding: '12px 16px', fontSize: 11 }}>
                    <span className="vx-badge" style={{ background: row.role === 'owner' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)', color: row.role === 'owner' ? '#fff' : 'rgba(255,255,255,0.55)' }}>
                      {row.role}
                    </span>
                  </td>
                  {PERMISSIONS.map(p => (
                    <td key={p.key} style={{ padding: '12px 16px' }}>
                      {row.role === 'owner' ? (
                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>—</span>
                      ) : (
                        <input type="checkbox" checked={!!row.permissions?.[p.key]} onChange={e => updatePermission(row, p.key, e.target.checked)} />
                      )}
                    </td>
                  ))}
                  <td style={{ padding: '12px 16px' }}>
                    {row.role === 'owner' ? (
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>—</span>
                    ) : (
                      <button onClick={() => toggleActive(row)} className="vx-btn vx-btn-outline" style={{ padding: '5px 12px', fontSize: 9, borderColor: row.is_active ? '#4ade80' : 'rgba(255,255,255,0.15)', color: row.is_active ? '#4ade80' : 'rgba(255,255,255,0.55)' }}>
                        {row.is_active ? 'ACTIVE' : 'DISABLED'}
                      </button>
                    )}
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
