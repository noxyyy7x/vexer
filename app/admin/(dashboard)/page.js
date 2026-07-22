'use client'
import { useEffect, useState } from 'react'
import { useAdminAuth } from '@/context/AdminAuthContext'
import { supabase } from '@/lib/supabase'

export default function DashboardPage() {
  const { staff, can } = useAdminAuth()
  const [stats, setStats] = useState(null)

  useEffect(() => {
    async function load() {
      const results = {}
      if (can('orders')) {
        const { count } = await supabase.from('orders').select('*', { count: 'exact', head: true })
        const { count: processing } = await supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'processing')
        results.orders = count
        results.processing = processing
      }
      if (can('customers')) {
        const { count } = await supabase.from('customers').select('*', { count: 'exact', head: true })
        results.customers = count
      }
      if (can('reviews')) {
        const { count } = await supabase.from('reviews').select('*', { count: 'exact', head: true }).eq('status', 'pending')
        results.pendingReviews = count
      }
      setStats(results)
    }
    load()
  }, [])

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div className="font-orb" style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
          WELCOME, {(staff?.name || staff?.email || '').split(' ')[0]?.toUpperCase()}
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>Here&apos;s what&apos;s happening.</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
        {can('orders') && <StatCard label="Orders awaiting dispatch" value={stats?.processing} accent="#fbbf24" />}
        {can('orders') && <StatCard label="Total orders" value={stats?.orders} />}
        {can('customers') && <StatCard label="Total customers" value={stats?.customers} />}
        {can('reviews') && <StatCard label="Reviews pending approval" value={stats?.pendingReviews} accent={stats?.pendingReviews > 0 ? '#fbbf24' : undefined} />}
      </div>

      {!can('orders') && !can('customers') && !can('reviews') && (
        <div className="vx-card" style={{ padding: 24, fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>
          You don&apos;t have access to any dashboard sections yet — ask the owner to grant permissions.
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, accent }) {
  return (
    <div className="vx-card" style={{ padding: 20 }}>
      <div style={{ fontSize: 10, letterSpacing: '0.05em', color: 'rgba(255,255,255,0.35)', marginBottom: 10 }}>{label.toUpperCase()}</div>
      <div className="font-orb" style={{ fontSize: 28, fontWeight: 700, color: accent || '#fff' }}>
        {value === undefined ? '—' : value}
      </div>
    </div>
  )
}
