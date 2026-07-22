'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAdminAuth } from '@/context/AdminAuthContext'

const GENDERS = ['men', 'women', 'kids', 'babies']

const emptyForm = {
  title: '', slug: '', collection_id: '', gender: 'men', category: '',
  price: '', compare_at_price: '', description: '', is_active: true, is_featured: false,
}

function slugify(s) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

const fmt = p => (p || p === 0 ? `£${Number(p).toFixed(2)}` : '—')

export default function ProductsPage() {
  const { can } = useAdminAuth()
  const router = useRouter()

  const [rows, setRows] = useState([])
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [slugTouched, setSlugTouched] = useState(false)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  async function load() {
    setLoading(true)
    const [{ data: products, error }, { data: cols }] = await Promise.all([
      supabase.from('products').select('*, collections(title), product_variants(stock)').order('created_at', { ascending: false }),
      supabase.from('collections').select('id, title').order('title', { ascending: true }),
    ])
    if (error) setErr(error.message)
    else setRows(products)
    setCollections(cols || [])
    setLoading(false)
  }

  useEffect(() => { if (can('products')) load() }, [])

  function startCreate() {
    setForm(emptyForm)
    setSlugTouched(false)
    setShowForm(true)
  }

  function handleTitleChange(value) {
    setForm(f => ({ ...f, title: value, slug: slugTouched ? f.slug : slugify(value) }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErr('')
    setSaving(true)
    const payload = {
      title: form.title,
      slug: form.slug,
      collection_id: form.collection_id || null,
      gender: form.gender,
      category: form.category,
      price: Number(form.price) || 0,
      compare_at_price: form.compare_at_price === '' ? null : Number(form.compare_at_price),
      description: form.description,
      is_active: form.is_active,
      is_featured: form.is_featured,
    }
    const { data, error } = await supabase.from('products').insert(payload).select('id').single()
    setSaving(false)
    if (error) { setErr(error.message); return }
    setShowForm(false)
    router.push(`/admin/products/${data.id}`)
  }

  async function toggle(row, field) {
    const { error } = await supabase.from('products').update({ [field]: !row[field] }).eq('id', row.id)
    if (error) { setErr(error.message); return }
    load()
  }

  async function handleDelete(row) {
    if (!confirm(`Delete product "${row.title}"? This can't be undone.`)) return
    const { error } = await supabase.from('products').delete().eq('id', row.id)
    if (error) { setErr(error.message); return }
    load()
  }

  if (!can('products')) {
    return (
      <div className="vx-card" style={{ padding: 24, fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>
        You don&apos;t have access to Products — ask the owner to grant permissions.
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <div className="font-orb" style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>PRODUCTS</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>Add and manage jerseys.</div>
        </div>
        <button onClick={() => { showForm ? setShowForm(false) : startCreate() }} className="vx-btn vx-btn-white" style={{ padding: '10px 20px', fontSize: 10 }}>
          {showForm ? 'CANCEL' : '+ ADD PRODUCT'}
        </button>
      </div>

      {err && <div className="vx-card" style={{ padding: 14, marginBottom: 20, borderColor: '#fca5a5', fontSize: 12, color: '#fca5a5' }}>{err}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="vx-card" style={{ padding: 24, marginBottom: 28 }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 18 }}>
            Core details only — images, tags, merchandising options and size/stock variants are added on the next screen.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            <div>
              <label style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', display: 'block', marginBottom: 6 }}>TITLE</label>
              <input className="vx-input" value={form.title} onChange={e => handleTitleChange(e.target.value)} required />
            </div>
            <div>
              <label style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', display: 'block', marginBottom: 6 }}>SLUG</label>
              <input className="vx-input" value={form.slug} onChange={e => { setSlugTouched(true); setForm(f => ({ ...f, slug: e.target.value })) }} required />
            </div>
            <div>
              <label style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', display: 'block', marginBottom: 6 }}>COLLECTION</label>
              <select className="vx-input" value={form.collection_id} onChange={e => setForm(f => ({ ...f, collection_id: e.target.value }))}>
                <option value="">— none —</option>
                {collections.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', display: 'block', marginBottom: 6 }}>GENDER</label>
              <select className="vx-input" value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}>
                {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', display: 'block', marginBottom: 6 }}>CATEGORY</label>
              <input className="vx-input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder="e.g. home, away, third" />
            </div>
            <div>
              <label style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', display: 'block', marginBottom: 6 }}>PRICE</label>
              <input className="vx-input" type="number" step="0.01" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} required />
            </div>
            <div>
              <label style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', display: 'block', marginBottom: 6 }}>COMPARE-AT PRICE</label>
              <input className="vx-input" type="number" step="0.01" value={form.compare_at_price} onChange={e => setForm(f => ({ ...f, compare_at_price: e.target.value }))} />
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', display: 'block', marginBottom: 6 }}>DESCRIPTION</label>
            <textarea className="vx-input" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>

          <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, cursor: 'pointer' }}>
              <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} />
              Active
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, cursor: 'pointer' }}>
              <input type="checkbox" checked={form.is_featured} onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))} />
              Featured
            </label>
          </div>

          <button type="submit" disabled={saving} className="vx-btn vx-btn-white" style={{ padding: '10px 24px', fontSize: 10 }}>
            {saving ? 'CREATING…' : 'CREATE & CONTINUE →'}
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
                {['Title', 'Collection', 'Gender', 'Category', 'Price', 'Stock', 'Active', 'Featured', ''].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: 10, letterSpacing: '0.05em', color: 'rgba(255,255,255,0.35)', fontWeight: 500, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(row => {
                const stock = (row.product_variants || []).reduce((s, v) => s + (v.stock || 0), 0)
                return (
                  <tr key={row.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <td style={{ padding: '12px 16px', fontSize: 12 }}>{row.title}</td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>{row.collections?.title || '—'}</td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>{row.gender}</td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>{row.category}</td>
                    <td style={{ padding: '12px 16px', fontSize: 12 }}>{fmt(row.price)}</td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: stock <= 0 ? '#fca5a5' : 'rgba(255,255,255,0.55)' }}>{stock}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <input type="checkbox" checked={!!row.is_active} onChange={() => toggle(row, 'is_active')} />
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <input type="checkbox" checked={!!row.is_featured} onChange={() => toggle(row, 'is_featured')} />
                    </td>
                    <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                      <Link href={`/admin/products/${row.id}`} className="vx-btn vx-btn-outline" style={{ padding: '5px 12px', fontSize: 9, marginRight: 8 }}>EDIT</Link>
                      <button onClick={() => handleDelete(row)} className="vx-btn vx-btn-outline" style={{ padding: '5px 12px', fontSize: 9, borderColor: '#fca5a5', color: '#fca5a5' }}>DELETE</button>
                    </td>
                  </tr>
                )
              })}
              {rows.length === 0 && (
                <tr><td colSpan={9} style={{ padding: '20px 16px', fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>No products yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
