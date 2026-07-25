'use client'
import { useState } from 'react'
import { MessageCircle } from 'lucide-react'

const DISCORD_URL = 'https://discord.gg/6Xk2HmgT9N'

export default function LiveChatButton() {
  const [hov, setHov] = useState(false)

  return (
    <a
      href={DISCORD_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on Discord"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: 'fixed', bottom: 24, right: 24, zIndex: 400,
        display: 'flex', alignItems: 'center', gap: hov ? 10 : 0,
        height: 52, padding: hov ? '0 20px 0 18px' : '0 15px',
        borderRadius: 26,
        background: 'rgba(10,10,15,0.85)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.15)',
        boxShadow: hov ? '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)' : '0 4px 20px rgba(0,0,0,0.4)',
        transition: 'all 0.25s cubic-bezier(0.22,1,0.36,1)',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
      }}
    >
      <MessageCircle size={20} strokeWidth={2} color="#fff" style={{ flexShrink: 0 }} />
      <span
        className="font-orb"
        style={{
          fontSize: 10, letterSpacing: '0.1em', color: '#fff', fontWeight: 600,
          maxWidth: hov ? 100 : 0, opacity: hov ? 1 : 0,
          transition: 'max-width 0.25s cubic-bezier(0.22,1,0.36,1), opacity 0.2s',
        }}
      >
        CHAT WITH US
      </span>
    </a>
  )
}
