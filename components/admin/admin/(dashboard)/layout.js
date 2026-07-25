'use client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AdminAuthProvider, useAdminAuth } from '@/context/AdminAuthContext'

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', perm: null, exact: true },
  { href: '/admin/orders', label: 'Orders', perm: 'orders' },
  { href: '/admin/customers', label: 'Customers', perm: 'customers' },
  { href: '/admin/products', label: 'Products', perm: 'products' },
  { href: '/admin/collections', label: 'Collections', perm: 'collections' },
  { href: '/admin/reviews', label: 'Reviews', perm: 'reviews' },
  { href: '/admin/discounts', label: 'Discounts', perm: 'discounts' },
  { href: '/admin/settings', label: 'Settings', perm: 'settings' },
]

function Shell({ children }) {
  const { loading, isAuthenticated, isRecognisedStaff, staff, isOwner, can, signOut } = useAdminAuth()
  const router = useRouter()
  const pathname = usePathname()

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.35)' }}>
        <div className="font-orb" style={{ fontSize: 10, letterSpacing: '0.3em' }}>LOADING…</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    router.replace('/admin/login')
    return null
  }

  if (!isRecognisedStaff || !staff?.is_active) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
        <div className="font-orb" style={{ fontSize: 13 }}>NOT AUTHORISED</div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', maxWidth: 320, textAlign: 'center' }}>
          This account isn&apos;t set up as active staff. Contact the owner to get access.
        </div>
      </div>
    )
  }

  const visibleItems = NAV_ITEMS.filter(item => !item.perm || can(item.perm))

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{ width: 220, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', padding: '28px 16px' }}>
        <div style={{ padding: '0 8px', marginBottom: 36 }}>
          <div className="font-orb" style={{ fontSize: 16, fontWeight: 700, letterSpacing: '0.1em' }}>VEXER</div>
          <div className="font-orb" style={{ fontSize: 9, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>ADMIN</div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
          {visibleItems.map(item => {
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{ padding: '10px 12px', borderRadius: 6, fontSize: 12, fontWeight: 500, color: isActive ? '#fff' : 'rgba(255,255,255,0.55)', background: isActive ? 'rgba(255,255,255,0.06)' : 'transparent' }}
              >
                {item.label}
              </Link>
            )
          })}

          {isOwner && (
            <Link
              href="/admin/staff"
              style={{ padding: '10px 12px', borderRadius: 6, fontSize: 12, fontWeight: 500, color: pathname.startsWith('/admin/staff') ? '#fff' : 'rgba(255,255,255,0.55)', background: pathname.startsWith('/admin/staff') ? 'rgba(255,255,255,0.06)' : 'transparent', marginTop: 12, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 20 }}
            >
              Staff
            </Link>
          )}
        </nav>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 16, marginTop: 16 }}>
          <div style={{ fontSize: 12, color: '#fff', marginBottom: 2 }}>{staff?.name || staff?.email}</div>
          <div className="font-orb" style={{ fontSize: 9, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.35)', marginBottom: 12 }}>
            {isOwner ? 'OWNER' : 'STAFF'}
          </div>
          <button onClick={signOut} className="vx-btn vx-btn-outline" style={{ width: '100%', padding: 8, fontSize: 9 }}>
            SIGN OUT
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, padding: '32px 40px', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  )
}

export default function DashboardLayout({ children }) {
  return (
    <AdminAuthProvider>
      <Shell>{children}</Shell>
    </AdminAuthProvider>
  )
}
