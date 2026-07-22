'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAdminAuth } from '@/context/AdminAuthContext'

const emptyForm = { id: null, title: '', type: '', country: '', logo_url: '', display_order: 0, is_featured: false, is_active: true }

export default function CollectionsPage() {
  const { can } = useAdminAuth()

  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  async function load() {
    setLoading(true)
    const { data, error } = await supabase.from('collections').select('*').order('display_order', { ascending: true })
    if (error) setErr(error.message)
    else setRows(data)
    setLoading(false)
  }

  useEffect(() => { if (can('collections')) load() }, [])

  function startCreate() {
    setForm({ ...emptyForm, display_order: rows.length })
    setShowForm(true)
  }

  function startEdit(row) {
    setForm({
      id: row.id,
      title: row.title || '',
      type: row.type || '',
      country: row.country || '',
      logo_url: row.logo_url || '',
      display_order: row.display_order ?? 0,
      is_featured: !!row.is_featured,
      is_active: !!row.is_active,
    })
    setShowForm(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErr('')
    setSaving(true)
    const payload = {
      title: form.title,
      type: form.type,
      country: form.country,
      logo_url: form.logo_url,
      display_order: Number(form.display_order) || 0,
      is_featured: form.is_featured,
      is_active: form.is_active,
    }
    const { error } = form.id
      ? await supabase.from('collections').update(payload).eq('id', form.id)
      : await supabase.from('collections').insert(payload)
    setSaving(false)
    if (error) { setErr(error.message); return }
    setForm(emptyForm)
    setShowForm(false)
    load()
  }

  async function toggle(row, field) {
    const { error } = await supabase.from('collections').update({ [field]: !row[field] }).eq('id', row.id)
    if (error) { setErr(error.message); return }
    load()
  }

  async function handleDelete(row) {
    if (!confirm(`Delete collection "${row.title}"? This can't be undone.`)) return
    const { error } = await supabase.from('collections').delete().eq('id', row.id)
    if (error) { setErr(error.message); return }
    load()
  }

  if (!can('collections')) {
    return (
      <div className="vx-card" style={{ padding: 24, fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>
        You don&apos;t have access to Collections — ask the owner to grant permissions.
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <div className="font-orb" style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>COLLECTIONS</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>Upload team &amp; league logos for the landing page.</div>
        </div>
        <button onClick={() => { showForm ? setShowForm(false) : startCreate() }} className="vx-btn vx-btn-white" style={{ padding: '10px 20px', fontSize: 10 }}>
          {showForm ? 'CANCEL' : '+ ADD COLLECTION'}
        </button>
      </div>

      {err && <div className="vx-card" style={{ padding: 14, marginBottom: 20, borderColor: '#fca5a5', fontSize: 12, color: '#fca5a5' }}>{err}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="vx-card" style={{ padding: 24, marginBottom: 28 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            <div>
              <label style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', display: 'block', marginBottom: 6 }}>TITLE</label>
              <input className="vx-input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
            </div>
            <div>
              <label style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', display: 'block', marginBottom: 6 }}>TYPE</label>
              <input className="vx-input" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} placeholder="e.g. club, league, national" />
            </div>
            <div>
              <label style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', display: 'block', marginBottom: 6 }}>COUNTRY</label>
              <input className="vx-input" value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', display: 'block', marginBottom: 6 }}>DISPLAY ORDER</label>
              <input className="vx-input" type="number" value={form.display_order} onChange={e => setForm(f => ({ ...f, display_order: e.target.value }))} />
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', display: 'block', marginBottom: 6 }}>LOGO URL</label>
            <input className="vx-input" value={form.logo_url} onChange={e => setForm(f => ({ ...f, logo_url: e.target.value }))} placeholder="https://…" />
          </div>

          <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, cursor: 'pointer' }}>
              <input type="checkbox" checked={form.is_featured} onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))} />
              Featured
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, cursor: 'pointer' }}>
              <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} />
              Active
            </label>
          </div>

          <button type="submit" disabled={saving} className="vx-btn vx-btn-white" style={{ padding: '10px 24px', fontSize: 10 }}>
            {saving ? 'SAVING…' : form.id ? 'SAVE CHANGES' : 'CREATE COLLECTION'}
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
                {['Logo', 'Title', 'Type', 'Country', 'Order', 'Featured', 'Active', ''].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: 10, letterSpacing: '0.05em', color: 'rgba(255,255,255,0.35)', fontWeight: 500, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(row => (
                <tr key={row.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <td style={{ padding: '12px 16px' }}>
                    {row.logo_url ? (
                      <img src={row.logo_url} alt={row.title} style={{ width: 28, height: 28, objectFit: 'contain', borderRadius: 4 }} />
                    ) : (
                      <div style={{ width: 28, height: 28, borderRadius: 4, background: 'rgba(255,255,255,0.06)' }} />
                    )}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 12 }}>{row.title}</td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>{row.type}</td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>{row.country}</td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>{row.display_order}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <input type="checkbox" checked={!!row.is_featured} onChange={() => toggle(row, 'is_featured')} />
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <input type="checkbox" checked={!!row.is_active} onChange={() => toggle(row, 'is_active')} />
                  </td>
                  <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                    <button onClick={() => startEdit(row)} className="vx-btn vx-btn-outline" style={{ padding: '5px 12px', fontSize: 9, marginRight: 8 }}>EDIT</button>
                    <button onClick={() => handleDelete(row)} className="vx-btn vx-btn-outline" style={{ padding: '5px 12px', fontSize: 9, borderColor: '#fca5a5', color: '#fca5a5' }}>DELETE</button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={8} style={{ padding: '20px 16px', fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>No collections yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
