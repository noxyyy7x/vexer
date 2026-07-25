'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Heart, Plus, Check } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useCurrency } from '@/context/CurrencyContext'

export default function ProductCard({ product, index = 0 }) {
  const [hov, setHov] = useState(false)
  const [added, setAdded] = useState(false)
  const { addToCart, wishlist, toggleWishlist } = useCart()
  const { formatPrice } = useCurrency()

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
    addToCart({ productId: product.id, name: product.title, team: teamName, image, size: null, qty: 1, price })
    setAdded(true)
    setTimeout(() => setAdded(false), 1600)
  }

  return (
    <Link
      href={`/product/${product.slug}`}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'block',
        borderRadius: 14,
        overflow: 'hidden',
        background: 'rgba(255,255,255,0.025)',
        border: `1px solid ${hov ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.07)'}`,
        opacity: isOutOfStock ? 0.55 : 1,
        transform: hov ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hov ? '0 16px 40px rgba(0,0,0,0.5)' : '0 0 0 rgba(0,0,0,0)',
        transition: 'all 0.35s cubic-bezier(0.22,1,0.36,1)',
      }}
    >
      <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', background: 'linear-gradient(160deg,#111116,#0a0a0d)' }}>
        {image && (
          <img
            src={image}
            alt={product.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s cubic-bezier(0.22,1,0.36,1)', transform: hov ? 'scale(1.08)' : 'scale(1)' }}
          />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,transparent 45%,rgba(5,5,8,0.85) 100%)', pointerEvents: 'none' }} />

        <button
          onClick={e => { e.preventDefault(); toggleWishlist(product.id) }}
          aria-label="Toggle wishlist"
          style={{
            position: 'absolute', top: 12, right: 12, width: 34, height: 34, borderRadius: '50%',
            background: 'rgba(10,10,15,0.75)', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            transition: 'transform 0.2s, border-color 0.2s',
            transform: hov ? 'scale(1)' : 'scale(0.94)',
          }}
        >
          <Heart size={15} strokeWidth={2} fill={isWishlisted ? '#fff' : 'none'} color="#fff" />
        </button>

        {isOutOfStock && (
          <Badge tone="muted">SOLD OUT</Badge>
        )}
        {product.kit_type && !isOutOfStock && (
          <Badge>{product.kit_type.toUpperCase()}</Badge>
        )}
        {hasDiscount && !isOutOfStock && (
          <div style={{ position: 'absolute', bottom: 12, right: 12, background: '#4ade80', color: '#052e12', fontSize: 8, fontFamily: 'var(--font-orbitron)', letterSpacing: '0.1em', padding: '4px 9px', borderRadius: 20, fontWeight: 700 }}>
            SAVE {Math.round((1 - product.price / product.compare_at_price) * 100)}%
          </div>
        )}
      </div>

      <div style={{ padding: '16px 16px 14px' }}>
        {teamName && (
          <div style={{ fontSize: 9.5, fontFamily: 'var(--font-orbitron)', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.18em', marginBottom: 6 }}>
            {teamName.toUpperCase()}
          </div>
        )}
        <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 12, lineHeight: 1.35, minHeight: 38 }}>
          {product.title}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            {hasDiscount && (
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', textDecoration: 'line-through', marginBottom: 2 }}>
                {formatPrice(product.compare_at_price)}
              </div>
            )}
            <div className="font-orb" style={{ fontSize: 17, fontWeight: 700, color: hasDiscount ? '#4ade80' : '#fff' }}>
              {formatPrice(price)}
            </div>
          </div>
          <button
            onClick={handleAdd}
            aria-label="Add to cart"
            disabled={isOutOfStock}
            style={{
              width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
              background: isOutOfStock ? 'rgba(255,255,255,0.06)' : added ? '#4ade80' : '#fff',
              color: isOutOfStock ? 'rgba(255,255,255,0.3)' : added ? '#052e12' : '#050508',
              border: 'none', cursor: isOutOfStock ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.25s cubic-bezier(0.22,1,0.36,1)',
              transform: hov && !isOutOfStock ? 'scale(1.08)' : 'scale(1)',
            }}
          >
            {added ? <Check size={17} strokeWidth={2.5} /> : <Plus size={17} strokeWidth={2.5} />}
          </button>
        </div>
      </div>
    </Link>
  )
}

function Badge({ children, tone }) {
  return (
    <div style={{
      position: 'absolute', bottom: 12, left: 12,
      background: tone === 'muted' ? 'rgba(120,120,120,0.85)' : 'rgba(10,10,15,0.75)',
      backdropFilter: 'blur(6px)',
      border: tone === 'muted' ? 'none' : '1px solid rgba(255,255,255,0.15)',
      color: '#fff', fontSize: 8, fontFamily: 'var(--font-orbitron)', letterSpacing: '0.15em',
      padding: '4px 9px', borderRadius: 20, fontWeight: 600,
    }}>
      {children}
    </div>
  )
}
