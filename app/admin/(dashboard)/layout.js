'use client'
import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard, ShoppingBag, Users, Shirt, Layers,
  Star, Tag, Settings, UserCog, LogOut, Menu, X,
} from 'lucide-react'
import { AdminAuthProvider, useAdminAuth } from '@/context/AdminAuthContext'

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', perm: null, exact: true, icon: LayoutDashboard },
  { href: '/admin/orders', label: 'Orders', perm: 'orders', icon: ShoppingBag },
  { href: '/admin/customers', label: 'Customers', perm: 'customers', icon: Users },
  { href: '/admin/products', label: 'Products', perm: 'products', icon: Shirt },
  { href: '/admin/collections', label: 'Collections', perm: 'collections', icon: Layers },
  { href: '/admin/reviews', label: 'Reviews', perm: 'reviews', icon: Star },
  { href: '/admin/discounts', label: 'Discounts', perm: 'discounts', icon: Tag },
  { href: '/admin/settings', label: 'Settings', perm: 'settings', icon: Settings },
]

function NavLink({ item, active, onClick }) {
  const Icon = item.icon
  return (
    <Link
      href={item.href}
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 11,
        padding: '10px 12px', borderRadius: 8, fontSize: 13, fontWeight: 500,
        color: active ? '#fff' : 'rgba(255,255,255,0.5)',
        background: active ? 'rgba(255,255,255,0.07)' : 'transparent',
        borderLeft: active ? '2px solid #fff' : '2px solid transparent',
        transition: 'color 0.15s, background 0.15s',
      }}
    >
      <Icon size={16} strokeWidth={2} style={{ flexShrink: 0, opacity: active ? 1 : 0.6 }} />
      {item.label}
    </Link>
  )
}

function SidebarContent({ visibleItems, isOwner, pathname, staff, signOut, onNavigate }) {
  return (
    <>
      <div style={{ padding: '4px 8px 8px', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 9 }}>
        <img src="/logo.png" alt="" style={{ height: 22, width: 'auto' }} />
        <div>
          <div className="font-orb" style={{ fontSize: 17, fontWeight: 700, letterSpacing: '0.1em' }}>VEXER</div>
          <div className="font-orb" style={{ fontSize: 9, letterSpacing: '0.35em', color: 'rgba(255,255,255,0.3)', marginTop: 3 }}>ADMIN</div>
        </div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        {visibleItems.map(item => (
          <NavLink
            key={item.href}
            item={item}
            active={item.exact ? pathname === item.href : pathname.startsWith(item.href)}
            onClick={onNavigate}
          />
        ))}

        {isOwner && (
          <div style={{ marginTop: 12, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <NavLink
              item={{ href: '/admin/staff', label: 'Staff', icon: UserCog }}
              active={pathname.startsWith('/admin/staff')}
              onClick={onNavigate}
            />
          </div>
        )}
      </nav>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 16, marginTop: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, padding: '0 4px' }}>
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
            {(staff?.name || staff?.email || '?')[0]?.toUpperCase()}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{staff?.name || staff?.email}</div>
            <div className="font-orb" style={{ fontSize: 9, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.35)' }}>
              {isOwner ? 'OWNER' : 'STAFF'}
            </div>
          </div>
        </div>
        <button onClick={signOut} className="vx-btn vx-btn-outline" style={{ width: '100%', padding: 9, fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <LogOut size={12} /> SIGN OUT
        </button>
      </div>
    </>
  )
}

function Shell({ children }) {
  const { loading, isAuthenticated, isRecognisedStaff, staff, isOwner, can, signOut } = useAdminAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

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
  const activeItem = [...visibleItems, { href: '/admin/staff', label: 'Staff' }].find(i =>
    i.exact ? pathname === i.href : pathname.startsWith(i.href)
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Desktop sidebar */}
      <aside className="hide-mobile-admin" style={{ width: 232, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', padding: '24px 16px' }}>
        <SidebarContent visibleItems={visibleItems} isOwner={isOwner} pathname={pathname} staff={staff} signOut={signOut} />
      </aside>

      {/* Mobile top bar */}
      <div className="show-mobile-admin" style={{ display: 'none', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 300, height: 56, alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', background: 'rgba(5,5,8,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <img src="/logo.png" alt="" style={{ height: 18, width: 'auto' }} />
          <div className="font-orb" style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.1em' }}>VEXER ADMIN</div>
        </div>
        <button onClick={() => setMobileOpen(true)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 4 }}>
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="show-mobile-admin" style={{ position: 'fixed', inset: 0, zIndex: 400 }}>
          <div onClick={() => setMobileOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }} />
          <aside style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 260, background: '#0a0a0f', borderRight: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', padding: '20px 16px' }}>
            <button onClick={() => setMobileOpen(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
              <X size={20} />
            </button>
            <SidebarContent visibleItems={visibleItems} isOwner={isOwner} pathname={pathname} staff={staff} signOut={signOut} onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <main className="admin-main" style={{ flex: 1, padding: '32px 40px', overflowY: 'auto' }}>
        {children}
      </main>

      <style>{`
        @media (max-width: 860px) {
          .hide-mobile-admin { display: none !important; }
          .show-mobile-admin { display: flex !important; }
          .admin-main { padding: 80px 20px 32px !important; }
        }
      `}</style>
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
