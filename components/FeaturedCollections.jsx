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
    <section style={{ padding: '70px 24px 40px' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <div className="font-orb" style={{ fontSize: 10, letterSpacing: '0.5em', color: 'rgba(255,255,255,0.4)', marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
            <span style={{ width: 28, height: 1, background: 'rgba(255,255,255,0.3)' }} />
            SHOP BY CLUB
            <span style={{ width: 28, height: 1, background: 'rgba(255,255,255,0.3)' }} />
          </div>
          <h2 className="font-orb" style={{ fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 900, color: '#fff' }}>TEAMS &amp; LEAGUES</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(128px,1fr))', gap: 18 }}>
          {collections.map(c => (
            <Link key={c.id} href={`/men?collection=${c.id}`} className="collection-tile" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, padding: '28px 12px 22px', textAlign: 'center' }}>
              <div className="collection-tile-ring" style={{ width: 76, height: 76, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', transition: 'all 0.3s cubic-bezier(0.22,1,0.36,1)' }}>
                {c.logo_url ? (
                  <img src={c.logo_url} alt={c.title} style={{ width: 42, height: 42, objectFit: 'contain' }} />
                ) : (
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
                )}
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.75)' }}>{c.title}</span>
            </Link>
          ))}
        </div>

        <style>{`
          .collection-tile-ring:hover, .collection-tile:hover .collection-tile-ring {
            border-color: rgba(255,255,255,0.35);
            background: rgba(255,255,255,0.06);
            transform: translateY(-4px) scale(1.04);
            box-shadow: 0 8px 24px rgba(0,0,0,0.4);
          }
        `}</style>
      </div>
    </section>
  )
}
