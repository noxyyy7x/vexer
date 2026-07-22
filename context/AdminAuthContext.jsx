'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const AdminAuthContext = createContext(null)

export function AdminAuthProvider({ children }) {
  const [session, setSession] = useState(undefined)
  const [staff, setStaff] = useState(undefined)
  const [loading, setLoading] = useState(true)

  async function loadStaffRow(userId) {
    if (!userId) { setStaff(null); return }
    const { data, error } = await supabase.from('staff').select('*').eq('auth_user_id', userId).maybeSingle()
    if (error) { console.error('Failed to load staff row:', error.message); setStaff(null); return }
    setStaff(data)
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      loadStaffRow(session?.user?.id).finally(() => setLoading(false))
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setLoading(true)
      loadStaffRow(session?.user?.id).finally(() => setLoading(false))
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  async function signIn(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  function can(permission) {
    if (!staff || !staff.is_active) return false
    if (staff.role === 'owner') return true
    return !!staff.permissions?.[permission]
  }

  const value = {
    session, staff, loading,
    isAuthenticated: !!session,
    isRecognisedStaff: staff !== null && staff !== undefined,
    isOwner: staff?.role === 'owner',
    can, signIn, signOut,
  }

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used inside AdminAuthProvider')
  return ctx
}
