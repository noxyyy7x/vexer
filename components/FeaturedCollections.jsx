import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default async function FeaturedCollections() {
  const { data: collections, error } = await supabase
    .from('collections')
    .select('*')
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('display_order', { ascending: true })
    .limit(12)

  if (error) {
    console.error('Failed to load featured collections:', error.message)
    return null
  }

  if (!collections || collections.length === 0) return null

  return (
    <section style={{ padding: '60px 24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div className="font-orb" style={{ fontSize: 9, letterSpacing: '0.5em', color: 'rgba(255,255,255,0.4)', marginBottom: 12 }}>SHOP BY CLUB</div>
          <h2 className="font-orb" style={{ fontSize: 'clamp(1.5rem,3vw,2.5rem)', fontWeight: 800, color: '#fff' }}>TEAMS & LEAGUES</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(120px,1fr))', gap: 16 }}>
          {collections.map(c => (
            <Link
              key={c.id}
              href={`/men?collection=${c.id}`}
              className="vx-card"
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 12px', textAlign: 'center', gap: 12 }}
            >
              {c.logo_url ? (
                <img src={c.logo_url} alt={c.title} style={{ width: 48, height: 48, objectFit: 'contain' }} />
              ) : (
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
              )}
              <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>{c.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}