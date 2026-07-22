export default function ComingSoon({ title, description }) {
  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div className="font-orb" style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{title.toUpperCase()}</div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>{description}</div>
      </div>
      <div className="vx-card" style={{ padding: 40, textAlign: 'center' }}>
        <div className="font-orb" style={{ fontSize: 11, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.35)', marginBottom: 8 }}>
          COMING NEXT
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>
          The database table for this already exists and is ready — the panel UI for it is next.
        </div>
      </div>
    </div>
  )
}
