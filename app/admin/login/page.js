'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminAuthProvider, useAdminAuth } from '@/context/AdminAuthContext'

function LoginForm() {
  const { signIn, isAuthenticated, loading } = useAdminAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!loading && isAuthenticated) {
    router.replace('/admin')
    return null
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErr('')
    setSubmitting(true)
    const { error } = await signIn(email, password)
    setSubmitting(false)
    if (error) { setErr('Incorrect email or password.'); return }
    router.replace('/admin')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.04), transparent 60%)' }}>
      <form onSubmit={handleSubmit} className="vx-card" style={{ width: 360, padding: 36 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div className="font-orb" style={{ fontSize: 20, fontWeight: 700, letterSpacing: '0.15em', marginBottom: 6 }}>VEXER</div>
          <div className="font-orb" style={{ fontSize: 10, letterSpacing: '0.4em', color: 'rgba(255,255,255,0.35)' }}>STAFF ADMIN</div>
        </div>

        <label style={{ fontSize: 10, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.55)', display: 'block', marginBottom: 8 }}>EMAIL</label>
        <input className="vx-input" type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="username" required style={{ marginBottom: 18 }} />

        <label style={{ fontSize: 10, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.55)', display: 'block', marginBottom: 8 }}>PASSWORD</label>
        <input className="vx-input" type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" required style={{ marginBottom: 18 }} />

        {err && <div style={{ fontSize: 12, color: '#fca5a5', marginBottom: 16 }}>{err}</div>}

        <button type="submit" disabled={submitting} className="vx-btn vx-btn-white" style={{ width: '100%', padding: 14, fontSize: 10 }}>
          {submitting ? 'SIGNING IN…' : 'SIGN IN'}
        </button>

        <a href="https://vexer.org" style={{ display: 'block', textAlign: 'center', marginTop: 20, fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
          ← Back to vexer.org
        </a>
      </form>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <AdminAuthProvider>
      <LoginForm />
    </AdminAuthProvider>
  )
}
