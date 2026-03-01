import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'

const ADMIN_EMAIL = 'andersongonzalez0602@gmail.com'
const AuthContext = createContext()
export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [needsUsername, setNeedsUsername] = useState(false)
  const [loading, setLoading] = useState(true)

  const profileCacheRef = useRef(null)
  const cachedUserIdRef = useRef(null)
  const fetchLockRef = useRef(false)
  const mountedRef = useRef(true)

  const checkAdmin = (s) => s?.user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()

  const fetchProfile = useCallback(async (userId) => {
    if (!userId) return null

    // Return cache if same user
    if (cachedUserIdRef.current === userId && profileCacheRef.current) {
      if (mountedRef.current) {
        setProfile(profileCacheRef.current)
        setNeedsUsername(false)
      }
      return profileCacheRef.current
    }

    // Lock to prevent concurrent fetches
    if (fetchLockRef.current) return profileCacheRef.current
    fetchLockRef.current = true

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('user_id', userId)
        .single()

      if (!mountedRef.current) return null

      if (error || !data) {
        profileCacheRef.current = null
        cachedUserIdRef.current = userId
        setProfile(null)
        setNeedsUsername(true)
        return null
      }

      profileCacheRef.current = data
      cachedUserIdRef.current = userId
      setProfile(data)
      setNeedsUsername(false)
      return data
    } catch {
      // Network failure — keep whatever we had
      return profileCacheRef.current
    } finally {
      fetchLockRef.current = false
    }
  }, [])

  const clearAuth = useCallback(() => {
    profileCacheRef.current = null
    cachedUserIdRef.current = null
    setSession(null)
    setProfile(null)
    setIsLoggedIn(false)
    setIsAdmin(false)
    setNeedsUsername(false)
  }, [])

  const applySession = useCallback(async (s) => {
    if (!s?.user) {
      clearAuth()
      return
    }
    setSession(s)
    setIsLoggedIn(true)
    setIsAdmin(checkAdmin(s))
    await fetchProfile(s.user.id)
  }, [fetchProfile, clearAuth])

  useEffect(() => {
    mountedRef.current = true

    // Init with timeout — if Supabase hangs, still render the app
    const initAuth = async () => {
      try {
        const result = await Promise.race([
          supabase.auth.getSession(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000))
        ])
        if (mountedRef.current && result?.data?.session) {
          await applySession(result.data.session)
        }
      } catch {
        // Timeout or error — app loads as logged-out, auth will recover via onAuthStateChange
      } finally {
        if (mountedRef.current) setLoading(false)
      }
    }

    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, s) => {
      if (!mountedRef.current) return

      if (event === 'TOKEN_REFRESHED') {
        // Just update session reference, don't touch profile
        if (s) setSession(s)
        return
      }

      if (event === 'SIGNED_OUT' || !s) {
        clearAuth()
        return
      }

      // SIGNED_IN, INITIAL_SESSION
      await applySession(s)
      // In case init timed out but auth recovered
      if (mountedRef.current) setLoading(false)
    })

    return () => {
      mountedRef.current = false
      subscription.unsubscribe()
    }
  }, [applySession, clearAuth])

  const loginWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin + window.location.pathname },
      })
      if (error) return { success: false, message: error.message }
      return { success: true }
    } catch (err) {
      return { success: false, message: err.message }
    }
  }

  const login = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { success: false, message: error.message }
    return { success: true }
  }

  const createProfile = async (username) => {
    if (!session?.user?.id) return { success: false, message: 'Not logged in' }
    try {
      const { data, error } = await supabase.from('profiles').insert({
        user_id: session.user.id,
        username: username.trim(),
        avatar_url: session.user.user_metadata?.avatar_url || null,
      }).select().single()
      if (error) {
        if (error.code === '23505') return { success: false, message: 'Username already taken' }
        return { success: false, message: error.message }
      }
      profileCacheRef.current = data
      cachedUserIdRef.current = session.user.id
      setProfile(data)
      setNeedsUsername(false)
      return { success: true }
    } catch (err) {
      return { success: false, message: err.message }
    }
  }

  const logout = async () => {
    clearAuth()
    try { await supabase.auth.signOut() } catch { /* state already cleared */ }
  }

  return (
    <AuthContext.Provider value={{
      session, profile, isAdmin, isLoggedIn, loading, needsUsername,
      loginWithGoogle, login, createProfile, logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}
