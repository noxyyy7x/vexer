'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useCurrency } from '@/context/CurrencyContext'


export default function ProductPageClient({ product }) {
  const { addToCart, wishlist, toggleWishlist } = useCart()
  const { formatPrice: fmt } = useCurrency()
  const isWishlisted = wishlist.includes(product.id)

  const variants = product.product_variants || []
  const hasVariants = variants.length > 0
  const totalStock = variants.reduce((s, v) => s + v.stock, 0)
  const isOutOfStock = hasVariants && totalStock <= 0

  const [selectedSize, setSelectedSize] = useState('')
  const [version, setVersion] = useState('fan')
  const [playerName, setPlayerName] = useState('')
  const [playerNumber, setPlayerNumber] = useState('')
  const [addBadge, setAddBadge] = useState(false)
  const [notes, setNotes] = useState('')
  const [added, setAdded] = useState(false)
  const [err, setErr] = useState('')
  const [activeImg, setActiveImg] = useState(0)

  const images = (product.images || []).map(i => i.url).filter(Boolean)
  const basePrice = product.has_version_option && version === 'player' && product.player_version_price
    ? product.player_version_price
    : product.price
  // Compare-at pricing only makes sense against the fan/base price — skip
  // the "was" price display when the player version is selected, since
  // that's a genuinely different product tier, not a discount.
  const hasDiscount = version === 'fan' && product.compare_at_price && product.compare_at_price > product.price
  const finalPrice = basePrice
    + (playerName && product.player_name_price ? product.player_name_price : 0)
    + (addBadge && product.badge_price ? product.badge_price : 0)

  function handleAddToCart() {
    if (hasVariants && !selectedSize) { setErr('Please select a size.'); return }
    if (product.has_player_name && playerName && !playerNumber) { setErr('Please enter a player number.'); return }
    setErr('')
    addToCart({
      productId: product.id,
      name: product.title,
      team: product.collections?.title,
      image: images[0],
      size: selectedSize || undefined,
      qty: 1,
      price: finalPrice,
      version: product.has_version_option ? version : undefined,
      playerName: playerName || undefined,
      playerNumber: playerNumber || undefined,
      badge: addBadge || undefined,
      notes: notes || undefined,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '48px 24px 96px' }}>
        <Link
          href="/men"
          className="font-orb"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 9, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.4)', marginBottom: 40 }}
        >
          ← BACK
        </Link>

        <div className="mobile-grid-1" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>

          <div>
            <div style={{ position: 'relative', aspectRatio: '3/4', borderRadius: 12, overflow: 'hidden', background: 'linear-gradient(160deg,#111116,#0a0a0d)', border: '1px solid rgba(255,255,255,0.08)', marginBottom: 12 }}>
              {images[activeImg] && (
                <img src={images[activeImg]} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              )}
              {product.tag && (
                <div style={{ position: 'absolute', top: 16, left: 16, background: '#fff', color: '#050508', fontSize: 8, fontFamily: 'var(--font-orbitron)', letterSpacing: '0.2em', padding: '4px 12px', borderRadius: 2, fontWeight: 700 }}>
                  {product.tag}
                </div>
              )}
              <button
                onClick={() => toggleWishlist(product.id)}
                aria-label="Toggle wishlist"
                style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(10,10,15,0.75)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '50%', width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <Heart size={17} strokeWidth={2} fill={isWishlisted ? '#fff' : 'none'} color="#fff" />
              </button>

              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImg(i => (i - 1 + images.length) % images.length)}
                    aria-label="Previous image"
                    style={{ position: 'absolute', top: '50%', left: 14, transform: 'translateY(-50%)', background: 'rgba(10,10,15,0.65)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                  >
                    <ChevronLeft size={20} color="#fff" />
                  </button>
                  <button
                    onClick={() => setActiveImg(i => (i + 1) % images.length)}
                    aria-label="Next image"
                    style={{ position: 'absolute', top: '50%', right: 14, transform: 'translateY(-50%)', background: 'rgba(10,10,15,0.65)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                  >
                    <ChevronRight size={20} color="#fff" />
                  </button>
                  <div style={{ position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6 }}>
                    {images.map((_, i) => (
                      <div key={i} style={{ width: i === activeImg ? 18 : 6, height: 5, borderRadius: 3, background: i === activeImg ? '#fff' : 'rgba(255,255,255,0.35)', transition: 'all 0.3s' }} />
                    ))}
                  </div>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {images.map((img, i) => (
                  <div
                    key={i}
                    onClick={() => setActiveImg(i)}
                    style={{ width: 64, height: 64, borderRadius: 6, overflow: 'hidden', border: `1px solid ${activeImg === i ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.08)'}`, cursor: 'pointer' }}
                  >
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div style={{ fontSize: 11, fontFamily: 'var(--font-orbitron)', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.3em', marginBottom: 8 }}>
              {product.collections?.title?.toUpperCase()} {product.league ? `· ${product.league}` : ''}
            </div>
            <h1 style={{ fontSize: 'clamp(1.5rem,3vw,2.5rem)', fontWeight: 700, color: '#fff', lineHeight: 1.2, marginBottom: 8 }}>
              {product.title}
            </h1>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 20 }}>
              {product.brand}{product.season ? ` · ${product.season}` : ''}
            </div>

            <div style={{ marginBottom: 24 }}>
              {hasDiscount && (
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', textDecoration: 'line-through', marginBottom: 4 }}>
                  {fmt(product.compare_at_price)}
                </div>
              )}
              <div style={{ fontSize: 36, fontFamily: 'var(--font-orbitron)', fontWeight: 900, color: hasDiscount ? '#4ade80' : '#fff' }}>
                {fmt(finalPrice)}
              </div>
              {hasDiscount && (
                <div style={{ fontSize: 10, fontFamily: 'var(--font-orbitron)', color: '#4ade80', marginTop: 4 }}>
                  YOU SAVE {fmt(product.compare_at_price - product.price)}
                </div>
              )}
            </div>

            {product.has_version_option && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 10, fontFamily: 'var(--font-orbitron)', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.4)', marginBottom: 10 }}>VERSION</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => setVersion('fan')}
                    style={{ flex: 1, textAlign: 'left', padding: '12px 14px', borderRadius: 8, border: `1px solid ${version === 'fan' ? '#fff' : 'rgba(255,255,255,0.15)'}`, background: version === 'fan' ? 'rgba(255,255,255,0.06)' : 'transparent', cursor: 'pointer' }}
                  >
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#fff', marginBottom: 2 }}>Fan Version</div>
                    <div className="font-orb" style={{ fontSize: 13, fontWeight: 700, color: version === 'fan' ? '#fff' : 'rgba(255,255,255,0.5)' }}>{fmt(product.price)}</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setVersion('player')}
                    style={{ flex: 1, textAlign: 'left', padding: '12px 14px', borderRadius: 8, border: `1px solid ${version === 'player' ? '#fff' : 'rgba(255,255,255,0.15)'}`, background: version === 'player' ? 'rgba(255,255,255,0.06)' : 'transparent', cursor: 'pointer' }}
                  >
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#fff', marginBottom: 2 }}>Player Version</div>
                    <div className="font-orb" style={{ fontSize: 13, fontWeight: 700, color: version === 'player' ? '#fff' : 'rgba(255,255,255,0.5)' }}>{fmt(product.player_version_price)}</div>
                  </button>
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 8, lineHeight: 1.6 }}>
                  {version === 'fan'
                    ? 'Standard fit and finish — great everyday quality.'
                    : 'Authentic player-spec fit, fabric and badge detailing.'}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, marginBottom: 24 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 6px #4ade80', flexShrink: 0 }} />
              <span style={{ fontSize: 11, fontFamily: 'var(--font-orbitron)', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em' }}>
                EUROPE · UK · USA DELIVERY · ~2 WEEKS
              </span>
            </div>

            <div className="vx-divider" style={{ marginBottom: 24 }} />

            {hasVariants && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <div style={{ fontSize: 10, fontFamily: 'var(--font-orbitron)', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.4)' }}>SIZE</div>
                  <Link href="/size-guide" style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', textDecoration: 'underline', fontFamily: 'var(--font-orbitron)', letterSpacing: '0.1em' }}>
                    SIZE GUIDE
                  </Link>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {variants.map(v => {
                    const soldOut = v.stock <= 0
                    return (
                      <button
                        key={v.id}
                        disabled={soldOut}
                        onClick={() => setSelectedSize(v.size)}
                        style={{ padding: '9px 16px', fontSize: 11, fontWeight: 600, background: selectedSize === v.size ? '#fff' : 'transparent', color: soldOut ? 'rgba(255,255,255,0.2)' : selectedSize === v.size ? '#050508' : 'rgba(255,255,255,0.5)', border: '1px solid', borderColor: selectedSize === v.size ? '#fff' : 'rgba(255,255,255,0.15)', cursor: soldOut ? 'not-allowed' : 'pointer', borderRadius: 4, textDecoration: soldOut ? 'line-through' : 'none' }}
                      >
                        {v.size}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {product.has_player_name && (
              <div style={{ marginBottom: 20, padding: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ fontSize: 10, fontFamily: 'var(--font-orbitron)', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.5)' }}>
                    PLAYER NAME & NUMBER <span style={{ color: 'rgba(255,255,255,0.25)' }}>(OPTIONAL)</span>
                  </div>
                  {product.player_name_price && (
                    <div style={{ fontSize: 11, fontFamily: 'var(--font-orbitron)', color: '#4ade80', fontWeight: 600 }}>
                      +{fmt(product.player_name_price)}
                    </div>
                  )}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10 }}>
                  <input className="vx-input" placeholder="e.g. SALAH" value={playerName} onChange={e => setPlayerName(e.target.value.toUpperCase())} maxLength={20} />
                  <input className="vx-input" placeholder="#" value={playerNumber} onChange={e => setPlayerNumber(e.target.value.replace(/\D/g, ''))} maxLength={2} style={{ width: 60 }} />
                </div>
              </div>
            )}

            {product.has_badge && (
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', padding: '14px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6 }}>
                  <input type="checkbox" checked={addBadge} onChange={e => setAddBadge(e.target.checked)} style={{ accentColor: '#fff', width: 16, height: 16 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#fff' }}>Add Badge</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>Include official badge on jersey</div>
                  </div>
                  {product.badge_price && (
                    <div style={{ fontSize: 11, fontFamily: 'var(--font-orbitron)', color: '#4ade80', fontWeight: 600 }}>
                      +{fmt(product.badge_price)}
                    </div>
                  )}
                </label>
              </div>
            )}

            {product.has_notes && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 10, fontFamily: 'var(--font-orbitron)', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.4)', marginBottom: 10 }}>
                  ORDER NOTES <span style={{ color: 'rgba(255,255,255,0.2)' }}>(OPTIONAL)</span>
                </div>
                <textarea className="vx-input" placeholder="Any special requests..." rows={3} value={notes} onChange={e => setNotes(e.target.value)} style={{ resize: 'vertical' }} />
              </div>
            )}

            {err && (
              <div style={{ fontSize: 11, fontFamily: 'var(--font-orbitron)', color: '#fca5a5', marginBottom: 14, padding: '10px 14px', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 6, letterSpacing: '0.08em' }}>
                {err}
              </div>
            )}

            {isOutOfStock ? (
              <div style={{ padding: 16, textAlign: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, marginBottom: 12 }}>
                <span style={{ fontSize: 10, fontFamily: 'var(--font-orbitron)', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.2em' }}>OUT OF STOCK</span>
              </div>
            ) : (
              <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="vx-btn vx-btn-white" style={{ width: '100%', padding: 16, fontSize: 10, letterSpacing: '0.2em', marginBottom: 12, borderRadius: 4 }} onClick={handleAddToCart}>
                {added ? '✓ ADDED TO CART' : 'ADD TO CART — ' + fmt(finalPrice)}
              </motion.button>
            )}

            <p style={{ textAlign: 'center', fontSize: 9, fontFamily: 'var(--font-orbitron)', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.12em', marginBottom: 24 }}>
              SECURE CHECKOUT · EUROPE · UK · USA
            </p>

            {product.description && (
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.8, marginBottom: 20, padding: 16, background: 'rgba(255,255,255,0.02)', borderRadius: 6, border: '1px solid rgba(255,255,255,0.06)' }}>
                {product.description}
              </div>
            )}

            <div style={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: 6, overflow: 'hidden' }}>
              {[
                product.brand && ['Brand', product.brand],
                product.season && ['Season', product.season],
                product.kit_type && ['Kit', product.kit_type.toUpperCase()],
                ['Delivery', '~2 Weeks — Europe, UK, USA'],
                ['Returns', '3 Days (No Custom)'],
              ].filter(Boolean).map(([label, value], i) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)', background: i % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent' }}>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{label}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
