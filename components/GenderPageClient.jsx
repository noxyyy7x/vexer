'use client'
import { useState, useMemo } from 'react'
import ProductCard from './ProductCard'

function Select({ label, val, opts, onChange }) {
  if (opts.length === 0) return null
  return (
    <div style={{ position: 'relative' }}>
      <select
        value={val}
        onChange={e => onChange(e.target.value)}
        className="vx-input"
        style={{ padding: '8px 32px 8px 14px', fontSize: 10, fontFamily: 'var(--font-orbitron)', letterSpacing: '0.1em', cursor: 'pointer', minWidth: 130, appearance: 'none', color: val ? '#fff' : 'rgba(255,255,255,0.4)' }}
      >
        <option value="">{label}</option>
        {opts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', pointerEvents: 'none', fontSize: 9 }}>▼</span>
    </div>
  )
}

export default function GenderPageClient({ gender, genderLabel, products, initialCategory }) {
  const [filters, setFilters] = useState({ category: initialCategory || '', collectionId: '', kitType: '' })
  const setF = (k, v) => setFilters(f => ({ ...f, [k]: v }))
  const anyActive = Object.values(filters).some(v => v)
  const clearAll = () => setFilters({ category: '', collectionId: '', kitType: '' })

  const availableCollections = useMemo(() => {
    const map = new Map()
    products.forEach(p => { if (p.collections) map.set(p.collections.id, p.collections.title) })
    return [...map.entries()].map(([value, label]) => ({ value, label }))
  }, [products])

  const availableKitTypes = useMemo(() => {
    const set = new Set(products.map(p => p.kit_type).filter(Boolean))
    return [...set].map(v => ({ value: v, label: v.toUpperCase() }))
  }, [products])

  const displayed = products.filter(p => {
    if (filters.category && p.category !== filters.category) return false
    if (filters.collectionId && p.collections?.id !== filters.collectionId) return false
    if (filters.kitType && p.kit_type !== filters.kitType) return false
    return true
  })

  return (
    <div style={{ paddingTop: 64, minHeight: '100vh' }}>
      <div style={{ padding: '48px 24px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div className="font-orb" style={{ fontSize: 9, letterSpacing: '0.5em', color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>
            VEXER · {gender.toUpperCase()}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
            <h1 className="font-orb" style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 900, color: '#fff' }}>
              {genderLabel?.toUpperCase()} JERSEYS
            </h1>
            <div className="font-orb" style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{displayed.length} RESULTS</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 24px 80px' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {['', 'national', 'international', 'retro'].map(cat => (
            <button
              key={cat}
              onClick={() => setF('category', cat)}
              className="vx-btn"
              style={{ padding: '8px 20px', fontSize: 9, letterSpacing: '0.15em', background: filters.category === cat ? '#fff' : 'transparent', color: filters.category === cat ? '#050508' : 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 4 }}
            >
              {cat === '' ? 'ALL' : cat.toUpperCase()}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', marginBottom: 32, padding: '16px 20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8 }}>
          <span className="font-orb" style={{ fontSize: 8, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.3)' }}>FILTER</span>
          <Select label="TEAM" val={filters.collectionId} opts={availableCollections} onChange={v => setF('collectionId', v)} />
          <Select label="KIT TYPE" val={filters.kitType} opts={availableKitTypes} onChange={v => setF('kitType', v)} />
          {anyActive && (
            <button onClick={clearAll} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-orbitron)', fontSize: 8, cursor: 'pointer', textDecoration: 'underline', letterSpacing: '0.1em', marginLeft: 'auto' }}>
              CLEAR ALL
            </button>
          )}
        </div>

        {displayed.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div className="font-orb" style={{ fontSize: 32, color: 'rgba(255,255,255,0.06)', marginBottom: 16 }}>V</div>
            <p className="font-orb" style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>
              {anyActive ? 'NO JERSEYS MATCH YOUR FILTERS' : 'MORE JERSEYS COMING SOON'}
            </p>
            {anyActive && (
              <button className="vx-btn vx-btn-outline" style={{ marginTop: 16, padding: '10px 24px', fontSize: 9 }} onClick={clearAll}>
                CLEAR FILTERS
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 16 }}>
            {displayed.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        )}
      </div>
    </div>
  )
}
