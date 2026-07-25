'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
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

  // Cards fall into two kinds: things that need action (only worth showing
  // when there's actually something to do) and steady background info
  // (worth always showing so the dashboard doesn't feel empty). Total
  // Customers is the latter; everything else is gated on having a nonzero
  // count so the dashboard reads as a to-do list, not a wall of zeroes.
  const showDispatch = can('orders') && stats?.processing > 0
  const showOrders = can('orders') && stats?.orders > 0
  const showCustomers = can('customers')
  const showReviews = can('reviews') && stats?.pendingReviews > 0

  const hasAnyCard = showDispatch || showOrders || showCustomers || showReviews
  const hasAnyAction = showDispatch || showReviews

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div className="font-orb" style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
          WELCOME, {(staff?.name || staff?.email || '').split(' ')[0]?.toUpperCase()}
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>
          {stats === null ? 'Loading…' : hasAnyAction ? 'Here\u2019s what needs attention.' : 'All caught up.'}
        </div>
      </div>

      {stats !== null && !hasAnyCard && (
        <div className="vx-card" style={{ padding: 24, fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>
          {can('orders') || can('customers') || can('reviews')
            ? 'Nothing needs your attention right now.'
            : 'You don\u2019t have access to any dashboard sections yet — ask the owner to grant permissions.'}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
        {showDispatch && (
          <Link href="/admin/orders" style={{ display: 'block' }}>
            <StatCard label="Orders awaiting dispatch" value={stats.processing} accent="#fbbf24" />
          </Link>
        )}
        {showOrders && (
          <Link href="/admin/orders" style={{ display: 'block' }}>
            <StatCard label="Total orders" value={stats.orders} />
          </Link>
        )}
        {showCustomers && <StatCard label="Total customers" value={stats?.customers} />}
        {showReviews && (
          <Link href="/admin/reviews" style={{ display: 'block' }}>
            <StatCard label="Reviews pending approval" value={stats.pendingReviews} accent="#fbbf24" />
          </Link>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value, accent }) {
  return (
    <div className="vx-card" style={{ padding: 20, cursor: 'pointer', transition: 'border-color 0.15s' }}>
      <div style={{ fontSize: 10, letterSpacing: '0.05em', color: 'rgba(255,255,255,0.35)', marginBottom: 10 }}>{label.toUpperCase()}</div>
      <div className="font-orb" style={{ fontSize: 28, fontWeight: 700, color: accent || '#fff' }}>
        {value === undefined ? '—' : value}
      </div>
    </div>
  )
}
