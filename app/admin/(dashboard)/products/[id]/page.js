'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useAdminAuth } from '@/context/AdminAuthContext'

const GENDERS = ['men', 'women', 'kids', 'babies']

function imagesToText(images) {
  return (images || []).map(i => i?.url).filter(Boolean).join('\n')
}
function textToImages(text) {
  return text.split('\n').map(s => s.trim()).filter(Boolean).map(url => ({ url }))
}

export default function ProductEditPage({ params }) {
  const { can } = useAdminAuth()
  const productId = params.id

  const [collections, setCollections] = useState([])
  const [variants, setVariants] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [err, setErr] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [basics, setBasics] = useState(null)
  const [imagesText, setImagesText] = useState('')
  const [tagsText, setTagsText] = useState('')

  const [newVariant, setNewVariant] = useState({ size: '', sku: '', stock: '' })

  async function load() {
    setLoading(true)
    const [{ data: product, error }, { data: cols }] = await Promise.all([
      supabase.from('products').select('*, collections(id, title), product_variants(*)').eq('id', productId).maybeSingle(),
      supabase.from('collections').select('id, title').order('title', { ascending: true }),
    ])
    setCollections(cols || [])
    if (error) { setErr(error.message); setLoading(false); return }
    if (!product) { setNotFound(true); setLoading(false); return }
    setBasics({
      title: product.title || '',
      slug: product.slug || '',
      subtitle: product.subtitle || '',
      description: product.description || '',
      collection_id: product.collection_id || '',
      gender: product.gender || 'men',
      category: product.category || '',
      kit_type: product.kit_type || '',
      league: product.league || '',
      brand: product.brand || '',
      season: product.season || '',
      tag: product.tag || '',
      supplier_ref: product.supplier_ref || '',
      price: product.price ?? '',
      compare_at_price: product.compare_at_price ?? '',
      is_active: !!product.is_active,
      is_featured: !!product.is_featured,
      has_player_name: !!product.has_player_name,
      player_name_price: product.player_name_price ?? '',
      has_badge: !!product.has_badge,
      badge_price: product.badge_price ?? '',
      has_notes: !!product.has_notes,
    })
    setImagesText(imagesToText(product.images))
    setTagsText((product.tags || []).join(', '))
    setVariants((product.product_variants || []).slice().sort((a, b) => a.size.localeCompare(b.size)))
    setLoading(false)
  }

  useEffect(() => { if (can('products')) load() }, [])

  function set(field, value) {
    setBasics(b => ({ ...b, [field]: value }))
  }

  async function handleSave(e) {
    e.preventDefault()
    setErr('')
    setSaving(true)
    const payload = {
      title: basics.title,
      slug: basics.slug,
      subtitle: basics.subtitle || null,
      description: basics.description,
      collection_id: basics.collection_id || null,
      gender: basics.gender,
      category: basics.category,
      kit_type: basics.kit_type || null,
      league: basics.league || null,
      brand: basics.brand || null,
      season: basics.season || null,
      tag: basics.tag || null,
      supplier_ref: basics.supplier_ref || null,
      price: Number(basics.price) || 0,
      compare_at_price: basics.compare_at_price === '' ? null : Number(basics.compare_at_price),
      is_active: basics.is_active,
      is_featured: basics.is_featured,
      has_player_name: basics.has_player_name,
      player_name_price: basics.has_player_name && basics.player_name_price !== '' ? Number(basics.player_name_price) : null,
      has_badge: basics.has_badge,
      badge_price: basics.has_badge && basics.badge_price !== '' ? Number(basics.badge_price) : null,
      has_notes: basics.has_notes,
      images: textToImages(imagesText),
      tags: tagsText.split(',').map(s => s.trim()).filter(Boolean),
    }
    const { error } = await supabase.from('products').update(payload).eq('id', productId)
    setSaving(false)
    if (error) { setErr(error.message); return }
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function handleAddVariant(e) {
    e.preventDefault()
    setErr('')
    if (!newVariant.size) { setErr('Size is required for a variant.'); return }
    const { error } = await supabase.from('product_variants').insert({
      product_id: productId,
      size: newVariant.size,
      sku: newVariant.sku || null,
      stock: Number(newVariant.stock) || 0,
    })
    if (error) { setErr(error.message); return }
    setNewVariant({ size: '', sku: '', stock: '' })
    load()
  }

  async function handleVariantField(variant, field, value) {
    setVariants(vs => vs.map(v => v.id === variant.id ? { ...v, [field]: value } : v))
  }

  async function saveVariant(variant) {
    const { error } = await supabase.from('product_variants').update({
      sku: variant.sku || null,
      stock: Number(variant.stock) || 0,
    }).eq('id', variant.id)
    if (error) setErr(error.message)
  }

  async function handleDeleteVariant(variant) {
    if (!confirm(`Delete size "${variant.size}"?`)) return
    const { error } = await supabase.from('product_variants').delete().eq('id', variant.id)
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

  if (loading) return <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>Loading…</div>
  if (notFound) return <div className="vx-card" style={{ padding: 24, fontSize: 12 }}>Product not found. <Link href="/admin/products" style={{ color: '#fff' }}>Back to Products</Link></div>

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <Link href="/admin/products" style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)' }}>← Back to Products</Link>
        <div className="font-orb" style={{ fontSize: 18, fontWeight: 700, marginTop: 10 }}>{basics.title || 'EDIT PRODUCT'}</div>
      </div>

      {err && <div className="vx-card" style={{ padding: 14, marginBottom: 20, borderColor: '#fca5a5', fontSize: 12, color: '#fca5a5' }}>{err}</div>}

      <form onSubmit={handleSave}>
        <div className="vx-card" style={{ padding: 24, marginBottom: 20 }}>
          <div className="font-orb" style={{ fontSize: 12, letterSpacing: '0.1em', marginBottom: 16 }}>BASICS</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            <Field label="TITLE"><input className="vx-input" value={basics.title} onChange={e => set('title', e.target.value)} required /></Field>
            <Field label="SLUG"><input className="vx-input" value={basics.slug} onChange={e => set('slug', e.target.value)} required /></Field>
            <Field label="SUBTITLE"><input className="vx-input" value={basics.subtitle} onChange={e => set('subtitle', e.target.value)} /></Field>
            <Field label="COLLECTION">
              <select className="vx-input" value={basics.collection_id} onChange={e => set('collection_id', e.target.value)}>
                <option value="">— none —</option>
                {collections.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </Field>
            <Field label="GENDER">
              <select className="vx-input" value={basics.gender} onChange={e => set('gender', e.target.value)}>
                {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </Field>
            <Field label="CATEGORY"><input className="vx-input" value={basics.category} onChange={e => set('category', e.target.value)} /></Field>
            <Field label="KIT TYPE"><input className="vx-input" value={basics.kit_type} onChange={e => set('kit_type', e.target.value)} placeholder="e.g. home, away, third" /></Field>
            <Field label="LEAGUE"><input className="vx-input" value={basics.league} onChange={e => set('league', e.target.value)} /></Field>
            <Field label="BRAND"><input className="vx-input" value={basics.brand} onChange={e => set('brand', e.target.value)} /></Field>
            <Field label="SEASON"><input className="vx-input" value={basics.season} onChange={e => set('season', e.target.value)} placeholder="e.g. 2025/26" /></Field>
            <Field label="TAG"><input className="vx-input" value={basics.tag} onChange={e => set('tag', e.target.value)} placeholder="e.g. New" /></Field>
            <Field label="SUPPLIER REF"><input className="vx-input" value={basics.supplier_ref} onChange={e => set('supplier_ref', e.target.value)} /></Field>
            <Field label="PRICE"><input className="vx-input" type="number" step="0.01" value={basics.price} onChange={e => set('price', e.target.value)} required /></Field>
            <Field label="COMPARE-AT PRICE"><input className="vx-input" type="number" step="0.01" value={basics.compare_at_price} onChange={e => set('compare_at_price', e.target.value)} /></Field>
            <Field label="TAGS (comma-separated)"><input className="vx-input" value={tagsText} onChange={e => setTagsText(e.target.value)} placeholder="retro, limited, world-cup" /></Field>
          </div>
          <Field label="DESCRIPTION"><textarea className="vx-input" rows={4} value={basics.description} onChange={e => set('description', e.target.value)} /></Field>
          <div style={{ display: 'flex', gap: 20, marginTop: 14 }}>
            <Checkbox label="Active" checked={basics.is_active} onChange={v => set('is_active', v)} />
            <Checkbox label="Featured" checked={basics.is_featured} onChange={v => set('is_featured', v)} />
          </div>
        </div>

        <div className="vx-card" style={{ padding: 24, marginBottom: 20 }}>
          <div className="font-orb" style={{ fontSize: 12, letterSpacing: '0.1em', marginBottom: 16 }}>MERCHANDISING OPTIONS</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <Checkbox label="Allow player name" checked={basics.has_player_name} onChange={v => set('has_player_name', v)} />
              <div style={{ marginTop: 8 }}>
                <input className="vx-input" type="number" step="0.01" disabled={!basics.has_player_name} value={basics.player_name_price} onChange={e => set('player_name_price', e.target.value)} placeholder="Price add-on" />
              </div>
            </div>
            <div>
              <Checkbox label="Allow badge" checked={basics.has_badge} onChange={v => set('has_badge', v)} />
              <div style={{ marginTop: 8 }}>
                <input className="vx-input" type="number" step="0.01" disabled={!basics.has_badge} value={basics.badge_price} onChange={e => set('badge_price', e.target.value)} placeholder="Price add-on" />
              </div>
            </div>
            <div>
              <Checkbox label="Allow order notes" checked={basics.has_notes} onChange={v => set('has_notes', v)} />
            </div>
          </div>
        </div>

        <div className="vx-card" style={{ padding: 24, marginBottom: 20 }}>
          <div className="font-orb" style={{ fontSize: 12, letterSpacing: '0.1em', marginBottom: 10 }}>IMAGES</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 10 }}>One image URL per line. The first line is used as the primary image.</div>
          <textarea className="vx-input" rows={5} value={imagesText} onChange={e => setImagesText(e.target.value)} placeholder="https://…" />
        </div>

        <button type="submit" disabled={saving} className="vx-btn vx-btn-white" style={{ padding: '10px 24px', fontSize: 10, marginBottom: 28 }}>
          {saving ? 'SAVING…' : saved ? '✓ SAVED' : 'SAVE PRODUCT'}
        </button>
      </form>

      <div className="vx-card" style={{ padding: 24 }}>
        <div className="font-orb" style={{ fontSize: 12, letterSpacing: '0.1em', marginBottom: 16 }}>SIZES & STOCK</div>

        <div style={{ overflow: 'auto', marginBottom: 20 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {['Size', 'SKU', 'Stock', ''].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 12px', fontSize: 10, letterSpacing: '0.05em', color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {variants.map(v => (
                <tr key={v.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <td style={{ padding: '10px 12px', fontSize: 12 }}>{v.size}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <input className="vx-input" style={{ width: 140 }} value={v.sku || ''} onChange={e => handleVariantField(v, 'sku', e.target.value)} onBlur={() => saveVariant(v)} />
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <input className="vx-input" style={{ width: 90 }} type="number" value={v.stock} onChange={e => handleVariantField(v, 'stock', e.target.value)} onBlur={() => saveVariant(v)} />
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <button type="button" onClick={() => handleDeleteVariant(v)} className="vx-btn vx-btn-outline" style={{ padding: '5px 12px', fontSize: 9, borderColor: '#fca5a5', color: '#fca5a5' }}>DELETE</button>
                  </td>
                </tr>
              ))}
              {variants.length === 0 && (
                <tr><td colSpan={4} style={{ padding: '14px 12px', fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>No sizes yet — add one below.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <form onSubmit={handleAddVariant} style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
          <Field label="SIZE"><input className="vx-input" style={{ width: 100 }} value={newVariant.size} onChange={e => setNewVariant(s => ({ ...s, size: e.target.value }))} placeholder="e.g. M" /></Field>
          <Field label="SKU"><input className="vx-input" style={{ width: 160 }} value={newVariant.sku} onChange={e => setNewVariant(s => ({ ...s, sku: e.target.value }))} /></Field>
          <Field label="STOCK"><input className="vx-input" style={{ width: 90 }} type="number" value={newVariant.stock} onChange={e => setNewVariant(s => ({ ...s, stock: e.target.value }))} /></Field>
          <button type="submit" className="vx-btn vx-btn-white" style={{ padding: '10px 20px', fontSize: 10 }}>+ ADD SIZE</button>
        </form>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', display: 'block', marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  )
}

function Checkbox({ label, checked, onChange }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, cursor: 'pointer' }}>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
      {label}
    </label>
  )
}
