'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

function useCountdown(targetIso) {
  const [remaining, setRemaining] = useState(null)

  useEffect(() => {
    if (!targetIso) { setRemaining(null); return }
    function tick() {
      const diff = new Date(targetIso).getTime() - Date.now()
      if (diff <= 0) { setRemaining({ d: 0, h: 0, m: 0, s: 0, done: true }); return }
      const d = Math.floor(diff / 86400000)
      const h = Math.floor((diff % 86400000) / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setRemaining({ d, h, m, s, done: false })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [targetIso])

  return remaining
}

export default function AnnouncementBanner() {
  const [settings, setSettings] = useState(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    supabase.from('site_settings').select('value').eq('key', 'notification_bar').maybeSingle()
      .then(({ data }) => setSettings(data?.value || null))
  }, [])

  const countdown = useCountdown(settings?.countdownEnabled ? settings?.countdownTarget : null)

  if (!settings?.enabled || dismissed) return null
  if (countdown?.done) return null // offer/timer expired, don't show a dead countdown

  return (
    <div style={{ background: '#fff', color: '#050508', padding: '10px 20px', textAlign: 'center', position: 'relative', fontSize: 12 }}>
      <span style={{ fontWeight: 600 }}>{settings.message}</span>

      {settings.countdownEnabled && countdown && (
        <span className="font-orb" style={{ marginLeft: 12, fontWeight: 700, letterSpacing: '0.05em' }}>
          {countdown.d > 0 && `${countdown.d}D `}
          {String(countdown.h).padStart(2, '0')}:{String(countdown.m).padStart(2, '0')}:{String(countdown.s).padStart(2, '0')}
        </span>
      )}

      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss"
        style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: 'rgba(5,5,8,0.5)' }}
      >
        ×
      </button>
    </div>
  )
}
