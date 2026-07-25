'use client'
import { useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'

// images: array of { url } objects, in display order (first = primary/card image)
export default function MultiImageUploader({ bucket, images, onChange }) {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [err, setErr] = useState('')
  const [dragOver, setDragOver] = useState(false)

  async function handleFiles(fileList) {
    const files = Array.from(fileList || []).filter(f => f.type.startsWith('image/'))
    if (files.length === 0) return
    setErr('')
    setUploading(true)

    const uploaded = []
    for (const file of files) {
      const ext = file.name.split('.').pop()
      const path = `${crypto.randomUUID()}.${ext}`
      const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, { cacheControl: '3600', upsert: false })
      if (uploadError) { setErr(uploadError.message); continue }
      const { data } = supabase.storage.from(bucket).getPublicUrl(path)
      uploaded.push({ url: data.publicUrl })
    }

    onChange([...(images || []), ...uploaded])
    setUploading(false)
  }

  function removeAt(index) {
    onChange(images.filter((_, i) => i !== index))
  }

  function moveTo(index, direction) {
    const next = [...images]
    const target = index + direction
    if (target < 0 || target >= next.length) return
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next)
  }

  return (
    <div>
      {images && images.length > 0 && (
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
          {images.map((img, i) => (
            <div key={img.url + i} style={{ position: 'relative', width: 96 }}>
              <div style={{ position: 'relative', width: 96, height: 96, borderRadius: 6, overflow: 'hidden', border: `1px solid ${i === 0 ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.08)'}` }}>
                <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                {i === 0 && (
                  <div style={{ position: 'absolute', top: 4, left: 4, background: '#fff', color: '#050508', fontSize: 7, fontFamily: 'var(--font-orbitron)', letterSpacing: '0.1em', padding: '2px 6px', borderRadius: 2, fontWeight: 700 }}>
                    PRIMARY
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removeAt(i)}
                  style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(5,5,8,0.8)', border: 'none', borderRadius: '50%', width: 20, height: 20, color: '#fca5a5', cursor: 'pointer', fontSize: 12, lineHeight: 1 }}
                >
                  ×
                </button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginTop: 4 }}>
                <button type="button" disabled={i === 0} onClick={() => moveTo(i, -1)} className="vx-btn vx-btn-outline" style={{ padding: '2px 8px', fontSize: 9 }}>←</button>
                <button type="button" disabled={i === images.length - 1} onClick={() => moveTo(i, 1)} className="vx-btn vx-btn-outline" style={{ padding: '2px 8px', fontSize: 9 }}>→</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files) }}
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
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>Click or drag images here — first image is the primary card image</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>Multiple files supported</div>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={e => handleFiles(e.target.files)}
        style={{ display: 'none' }}
      />

      {err && <div style={{ fontSize: 11, color: '#fca5a5', marginTop: 8 }}>{err}</div>}
    </div>
  )
}
