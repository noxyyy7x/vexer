'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'

const fmt = p => `£${Number(p).toFixed(2)}`

export default function ProductCard({ product, index = 0 }) {
  const [hov, setHov] = useState(false)
  const [added, setAdded] = useState(false)
  const { addToCart, wishlist, toggleWishlist } = useCart()

  const price = product.price
  const hasDiscount = product.compare_at_price && product.compare_at_price > product.price
  const totalStock = (product.product_variants || []).reduce((s, v) => s + v.stock, 0)
  const isOutOfStock = (product.product_variants || []).length > 0 && totalStock <= 0
  const image = product.images?.[0]?.url
  const isWishlisted = wishlist.includes(product.id)
  const teamName = product.collections?.title

  function handleAdd(e) {
    e.preventDefault()
    if (isOutOfStock) return
    addToCart({
      productId: product.id,
      name: product.title,
      team: teamName,
      image,
      size: null,
      qty: 1,
      price,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1600)
  }

  return (
    <Link
      href={`/product/${product.slug}`}
      className="vx-card"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ display: 'block', opacity: isOutOfStock ? 0.5 : 1 }}
    >
      <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', background: '#0d0d12' }}>
        {image && (
          <img
            src={image}
            alt={product.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease', transform: hov ? 'scale(1.06)' : 'scale(1)' }}
          />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,transparent 50%,rgba(5,5,8,0.9) 100%)' }} />

        <button
          onClick={e => { e.preventDefault(); toggleWishlist(product.id) }}
          style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(5,5,8,0.6)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 14 }}
        >
          {isWishlisted ? '❤️' : '🤍'}
        </button>

        {isOutOfStock && (
          <div style={{ position: 'absolute', bottom: 12, left: 12, background: 'rgba(100,100,100,0.9)', color: '#fff', fontSize: 8, fontFamily: 'var(--font-orbitron)', letterSpacing: '0.15em', padding: '3px 8px', borderRadius: 2 }}>
            SOLD OUT
          </div>
        )}
        {product.kit_type && !isOutOfStock && (
          <div style={{ position: 'absolute', bottom: 12, left: 12, background: 'rgba(5,5,8,0.7)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)', fontSize: 7, fontFamily: 'var(--font-orbitron)', letterSpacing: '0.15em', padding: '3px 8px', borderRadius: 2 }}>
            {product.kit_type.toUpperCase()}
          </div>
        )}
      </div>

      <div style={{ padding: 16 }}>
        {teamName && (
          <div style={{ fontSize: 10, fontFamily: 'var(--font-orbitron)', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.2em', marginBottom: 4 }}>
            {teamName.toUpperCase()}
          </div>
        )}
        <div style={{ fontSize: 14, fontWeight: 600, color: hov ? 'rgba(255,255,255,0.8)' : '#fff', marginBottom: 4, lineHeight: 1.3 }}>
          {product.title}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
          <div>
            {hasDiscount && (
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', textDecoration: 'line-through', marginBottom: 2 }}>
                {fmt(product.compare_at_price)}
              </div>
            )}
            <div style={{ fontSize: 16, fontFamily: 'var(--font-orbitron)', fontWeight: 700, color: hasDiscount ? '#4ade80' : '#fff' }}>
              {fmt(price)}
            </div>
          </div>
          <button
            className="vx-btn"
            onClick={handleAdd}
            style={{ padding: '8px 16px', fontSize: 8, letterSpacing: '0.15em', background: isOutOfStock ? 'rgba(255,255,255,0.08)' : added ? '#16a34a' : '#fff', color: isOutOfStock || added ? '#fff' : '#050508', borderRadius: 4, fontWeight: 700 }}
          >
            {isOutOfStock ? 'SOLD OUT' : added ? '✓ ADDED' : 'ADD'}
          </button>
        </div>
      </div>
    </Link>
  )
}
