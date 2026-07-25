'use client'
import { useEffect, useState } from 'react'
import { Star, Check, X, MessageSquareOff } from 'lucide-react'
import { supabase } from '@/lib/supabase'

function Stars({ n }) {
  return (
    <div style={{ display: 'flex', gap: 1 }}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} size={13} strokeWidth={0} fill={i < n ? '#fbbf24' : 'rgba(255,255,255,0.15)'} />
      ))}
    </div>
  )
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending')
  const [err, setErr] = useState('')

  async function load() {
    setLoading(true)
    let query = supabase.from('reviews').select('*').order('created_at', { ascending: false })
    if (filter !== 'all') query = query.eq('status', filter)
    const { data, error } = await query
    if (error) setErr(error.message)
    else setReviews(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [filter])

  async function updateStatus(id, status) {
    const { error } = await supabase.from('reviews').update({ status, reviewed_at: new Date().toISOString() }).eq('id', id)
    if (error) { setErr(error.message); return }
    load()
  }

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div className="font-orb" style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>REVIEWS</div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>Approve or reject customer reviews.</div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {['pending', 'approved', 'rejected', 'all'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="vx-btn"
            style={{ padding: '8px 18px', fontSize: 9, letterSpacing: '0.1em', background: filter === f ? '#fff' : 'transparent', color: filter === f ? '#050508' : 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 4 }}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      {err && <div className="vx-card" style={{ padding: 14, marginBottom: 20, borderColor: '#fca5a5', fontSize: 12, color: '#fca5a5' }}>{err}</div>}

      {loading ? (
        <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>Loading…</div>
      ) : reviews.length === 0 ? (
        <div className="vx-card" style={{ padding: 48, textAlign: 'center' }}>
          <MessageSquareOff size={28} strokeWidth={1.5} color="rgba(255,255,255,0.2)" style={{ marginBottom: 12 }} />
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>No {filter !== 'all' ? filter : ''} reviews.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {reviews.map(r => (
            <div key={r.id} className="vx-card" style={{ padding: 20, display: 'flex', gap: 16 }}>
              {r.image_url && <img src={r.image_url} alt="" style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }} />}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{r.customer_name}</div>
                    <Stars n={r.rating} />
                  </div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{new Date(r.created_at).toLocaleDateString('en-GB')}</div>
                </div>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, marginBottom: 14 }}>{r.body}</p>
                {r.status === 'pending' ? (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => updateStatus(r.id, 'approved')} className="vx-btn vx-btn-outline" style={{ padding: '6px 16px', fontSize: 9, borderColor: '#4ade80', color: '#4ade80', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Check size={12} /> APPROVE
                    </button>
                    <button onClick={() => updateStatus(r.id, 'rejected')} className="vx-btn vx-btn-outline" style={{ padding: '6px 16px', fontSize: 9, borderColor: '#fca5a5', color: '#fca5a5', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <X size={12} /> REJECT
                    </button>
                  </div>
                ) : (
                  <span className="vx-badge" style={{ background: r.status === 'approved' ? 'rgba(74,222,128,0.1)' : 'rgba(252,165,165,0.1)', color: r.status === 'approved' ? '#4ade80' : '#fca5a5' }}>
                    {r.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
