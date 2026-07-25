'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const defaultValue = { enabled: false, message: '', countdownEnabled: false, countdownTarget: '' }

export default function SettingsPage() {
  const [value, setValue] = useState(defaultValue)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [err, setErr] = useState('')

  useEffect(() => {
    supabase.from('site_settings').select('value').eq('key', 'notification_bar').maybeSingle()
      .then(({ data, error }) => {
        if (error) setErr(error.message)
        else setValue({ ...defaultValue, ...(data?.value || {}) })
        setLoading(false)
      })
  }, [])

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setErr('')
    const { error } = await supabase
      .from('site_settings')
      .upsert({ key: 'notification_bar', value, updated_at: new Date().toISOString() })
    setSaving(false)
    if (error) { setErr(error.message); return }
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (loading) return <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>Loading…</div>

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div className="font-orb" style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>SETTINGS</div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>Site-wide settings.</div>
      </div>

      <form onSubmit={handleSave} className="vx-card" style={{ padding: 24, maxWidth: 560 }}>
        <div className="font-orb" style={{ fontSize: 12, letterSpacing: '0.1em', marginBottom: 16 }}>ANNOUNCEMENT BANNER</div>

        <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginBottom: 18 }}>
          <input type="checkbox" checked={value.enabled} onChange={e => setValue(v => ({ ...v, enabled: e.target.checked }))} />
          <span style={{ fontSize: 13 }}>Show banner on site</span>
        </label>

        <label style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', display: 'block', marginBottom: 6 }}>MESSAGE</label>
        <input
          className="vx-input"
          value={value.message}
          onChange={e => setValue(v => ({ ...v, message: e.target.value }))}
          placeholder="e.g. Free worldwide shipping this week only"
          style={{ marginBottom: 20 }}
        />

        <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginBottom: 14 }}>
          <input type="checkbox" checked={value.countdownEnabled} onChange={e => setValue(v => ({ ...v, countdownEnabled: e.target.checked }))} />
          <span style={{ fontSize: 13 }}>Show live countdown timer</span>
        </label>

        {value.countdownEnabled && (
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', display: 'block', marginBottom: 6 }}>
              COUNTDOWN ENDS AT
            </label>
            <input
              className="vx-input"
              type="datetime-local"
              value={value.countdownTarget ? value.countdownTarget.slice(0, 16) : ''}
              onChange={e => setValue(v => ({ ...v, countdownTarget: e.target.value ? new Date(e.target.value).toISOString() : '' }))}
            />
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 6 }}>
              Countdown shows live down to the second. Banner automatically stops showing once it reaches zero.
            </div>
          </div>
        )}

        {err && <div style={{ fontSize: 12, color: '#fca5a5', marginBottom: 14 }}>{err}</div>}

        <button type="submit" disabled={saving} className="vx-btn vx-btn-white" style={{ padding: '10px 24px', fontSize: 10 }}>
          {saving ? 'SAVING…' : saved ? '✓ SAVED' : 'SAVE CHANGES'}
        </button>
      </form>
    </div>
  )
}
