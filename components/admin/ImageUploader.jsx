'use client'
import { useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'

// Uploads a single image to the given Supabase Storage bucket and reports
// the public URL back via onChange. Used for collection logos (one image
// per team/league).
export default function ImageUploader({ bucket, value, onChange, label = 'IMAGE' }) {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [err, setErr] = useState('')
  const [dragOver, setDragOver] = useState(false)

  async function handleFile(file) {
    if (!file) return
    if (!file.type.startsWith('image/')) { setErr('Please choose an image file.'); return }
    setErr('')
    setUploading(true)

    const ext = file.name.split('.').pop()
    const path = `${crypto.randomUUID()}.${ext}`

    const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    })

    if (uploadError) {
      setErr(uploadError.message)
      setUploading(false)
      return
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    onChange(data.publicUrl)
    setUploading(false)
  }

  async function handleRemove() {
    onChange('')
  }

  return (
    <div>
      <label style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', display: 'block', marginBottom: 6 }}>{label}</label>

      {value ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 12, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, background: 'rgba(255,255,255,0.02)' }}>
          <img src={value} alt="" style={{ width: 56, height: 56, objectFit: 'contain', borderRadius: 4, background: 'rgba(255,255,255,0.04)' }} />
          <div style={{ flex: 1, fontSize: 11, color: 'rgba(255,255,255,0.4)', wordBreak: 'break-all' }}>{value}</div>
          <button type="button" onClick={handleRemove} className="vx-btn vx-btn-outline" style={{ padding: '6px 12px', fontSize: 9, borderColor: '#fca5a5', color: '#fca5a5' }}>
            REMOVE
          </button>
          <button type="button" onClick={() => inputRef.current?.click()} className="vx-btn vx-btn-outline" style={{ padding: '6px 12px', fontSize: 9 }}>
            REPLACE
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files?.[0]) }}
          style={{
            padding: '28px 16px', textAlign: 'center', border: `1px dashed ${dragOver ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.15)'}`,
            borderRadius: 6, cursor: 'pointer', background: dragOver ? 'rgba(255,255,255,0.03)' : 'transparent',
          }}
        >
          {uploading ? (
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }} className="font-orb">UPLOADING…</div>
          ) : (
            <>
              <div style={{ fontSize: 20, marginBottom: 6 }}>📁</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>Click or drag an image here</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>PNG, JPG, SVG, WebP</div>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={e => handleFile(e.target.files?.[0])}
        style={{ display: 'none' }}
      />

      {err && <div style={{ fontSize: 11, color: '#fca5a5', marginTop: 8 }}>{err}</div>}
    </div>
  )
}
