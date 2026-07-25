'use client'
import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'

function stars(n) {
  return Array.from({ length: 5 }, (_, i) => (
    <span key={i} style={{ fontSize: 16, opacity: i < n ? 1 : 0.2 }}>⭐</span>
  ))
}

export default function ReviewsPageClient({ initialReviews }) {
  const [reviews] = useState(initialReviews)
  const [form, setForm] = useState({ name: '', rating: 5, comment: '' })
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [err, setErr] = useState('')
  const fileRef = useRef(null)

  function handleImage(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setImage(file)
    const reader = new FileReader()
    reader.onload = ev => setImagePreview(ev.target.result)
    reader.readAsDataURL(file)
  }

  async function submit() {
    if (!form.name || !form.comment) { setErr('Please fill in your name and review.'); return }
    setErr('')
    setSending(true)

    try {
      let imageUrl = null
      if (image) {
        const ext = image.name.split('.').pop()
        const path = `${crypto.randomUUID()}.${ext}`
        const { error: uploadError } = await supabase.storage.from('review-images').upload(path, image)
        if (uploadError) throw new Error(uploadError.message)
        const { data } = supabase.storage.from('review-images').getPublicUrl(path)
        imageUrl = data.publicUrl
      }

      const { error: insertError } = await supabase.from('reviews').insert({
        customer_name: form.name,
        rating: form.rating,
        body: form.comment,
        image_url: imageUrl,
        status: 'pending',
      })
      if (insertError) throw new Error(insertError.message)

      setSent(true)
    } catch (e) {
      setErr('Failed to submit. Please try again.')
    }
    setSending(false)
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <div style={{ padding: '60px 24px 40px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="font-orb" style={{ fontSize: 9, letterSpacing: '0.5em', color: 'rgba(255,255,255,0.4)', marginBottom: 12 }}>VEXER · REVIEWS</div>
        <h1 className="font-orb" style={{ fontSize: 'clamp(2rem,5vw,4rem)', fontWeight: 900, color: '#fff', marginBottom: 12 }}>CUSTOMER REVIEWS</h1>
        {reviews.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8 }}>
            <div style={{ fontSize: 20 }}>⭐⭐⭐⭐⭐</div>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '60px 24px' }}>

        {sent ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="vx-glass" style={{ padding: 40, textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>✅</div>
            <div className="font-orb" style={{ fontSize: 13, color: '#fff', marginBottom: 8 }}>REVIEW SUBMITTED</div>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Thank you! Your review will appear once approved.</p>
          </motion.div>
        ) : (
          <div className="vx-glass" style={{ padding: 32, marginBottom: 48 }}>
            <div className="font-orb" style={{ fontSize: 10, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.5)', marginBottom: 20 }}>LEAVE A REVIEW</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <input className="vx-input" placeholder="Your name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              <div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>Rating</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[1, 2, 3, 4, 5].map(n => (
                    <button key={n} onClick={() => setForm(f => ({ ...f, rating: n }))} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 24, opacity: n <= form.rating ? 1 : 0.3 }}>⭐</button>
                  ))}
                </div>
              </div>
              <textarea className="vx-input" placeholder="Share your experience with Vexer..." rows={4} value={form.comment} onChange={e => setForm(f => ({ ...f, comment: e.target.value }))} style={{ resize: 'vertical' }} />

              <div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>Photo <span style={{ color: 'rgba(255,255,255,0.2)' }}>(Optional)</span></div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.15)', borderRadius: 6, cursor: 'pointer' }}>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} style={{ display: 'none' }} />
                  {imagePreview ? (
                    <img src={imagePreview} alt="preview" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6 }} />
                  ) : (
                    <span style={{ fontSize: 24 }}>📷</span>
                  )}
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{image ? image.name : 'Click to upload a photo'}</span>
                </label>
              </div>

              {err && <p style={{ fontSize: 11, color: '#fca5a5' }}>{err}</p>}
              <button className="vx-btn vx-btn-white" style={{ padding: '12px 28px', fontSize: 9, alignSelf: 'flex-start', letterSpacing: '0.2em' }} onClick={submit} disabled={sending}>
                {sending ? 'SUBMITTING...' : 'SUBMIT REVIEW'}
              </button>
            </div>
          </div>
        )}

        {reviews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <div className="font-orb" style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>NO REVIEWS YET — BE THE FIRST!</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {reviews.map((r, i) => (
              <motion.div key={r.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.05 }} className="vx-glass" style={{ padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 4 }}>{r.customer_name}</div>
                    <div style={{ display: 'flex', gap: 2 }}>{stars(r.rating)}</div>
                  </div>
                  {r.created_at && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{new Date(r.created_at).toLocaleDateString('en-GB')}</div>}
                </div>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginBottom: r.image_url ? 12 : 0 }}>{r.body}</p>
                {r.image_url && <img src={r.image_url} alt="review" style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)' }} />}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
