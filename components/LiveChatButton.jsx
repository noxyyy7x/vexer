'use client'

const DISCORD_URL = 'https://discord.gg/6Xk2HmgT9N'

export default function LiveChatButton() {
  return (
    <a
      href={DISCORD_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on Discord"
      style={{
        position: 'fixed', bottom: 24, right: 24, zIndex: 400,
        width: 56, height: 56, borderRadius: '50%',
        background: '#5865F2', display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 20px rgba(88,101,242,0.4)', fontSize: 24,
      }}
    >
      💬
    </a>
  )
}
