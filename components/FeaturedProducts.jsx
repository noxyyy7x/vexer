import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import ProductCard from './ProductCard'

export default async function FeaturedProducts() {
  const { data: products, error } = await supabase
    .from('products')
    .select('*, collections(title), product_variants(stock)')
    .eq('is_active', true)
    .eq('is_featured', true)
    .limit(8)

  if (error) {
    console.error('Failed to load featured products:', error.message)
    return null
  }

  if (!products || products.length === 0) {
    // No products yet is expected until the admin panel's Products section is
    // built and stock is added — quietly render nothing rather than an
    // empty-looking section on the live site.
    return null
  }

  return (
    <section style={{ padding: '80px 24px' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div className="font-orb" style={{ fontSize: 9, letterSpacing: '0.5em', color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>FEATURED</div>
            <h2 className="font-orb" style={{ fontSize: 'clamp(1.5rem,3vw,2.5rem)', fontWeight: 800, color: '#fff' }}>TOP PICKS</h2>
          </div>
          <Link href="/men" className="vx-btn vx-btn-outline" style={{ padding: '10px 24px', fontSize: 9, letterSpacing: '0.2em' }}>
            VIEW ALL →
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 16 }}>
          {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </div>
    </section>
  )
}
