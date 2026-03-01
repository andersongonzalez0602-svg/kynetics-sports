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
  const mountedRef = useRef(true)

  const checkAdmin = (s) => s?.user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()

  const fetchProfile = useCallback(async (userId) => {
    if (!userId) return null

    // Return cache if same user
    if (cachedUserIdRef.current === userId && profileCacheRef.current) {
      console.log('[AUTH] profile from cache:', profileCacheRef.current.username)
      if (mountedRef.current) {
        setProfile(profileCacheRef.current)
        setNeedsUsername(false)
      }
      return profileCacheRef.current
    }

    console.log('[AUTH] fetching profile for', userId)

    try {
      // Timeout the profile query at 5 seconds
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 5000)

      const { data, error } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('user_id', userId)
        .single()
        .abortSignal(controller.signal)

      clearTimeout(timeout)

      if (!mountedRef.current) return null

      if (error || !data) {
        console.log('[AUTH] profile fetch result: no profile found', error?.message)
        profileCacheRef.current = null
        cachedUserIdRef.current = userId
        setProfile(null)
        setNeedsUsername(true)
        return null
      }

      console.log('[AUTH] profile fetch result: SUCCESS', data.username)
      profileCacheRef.current = data
      cachedUserIdRef.current = userId
      setProfile(data)
      setNeedsUsername(false)
      return data
    } catch (err) {
      console.log('[AUTH] profile fetch error/timeout:', err.message)
      // On timeout, don't set needsUsername — just leave profile as-is
      if (!mountedRef.current) return null
      if (!profileCacheRef.current) {
        setProfile(null)
        // Don't show username modal on network error — retry will happen
      }
      return profileCacheRef.current
    }
  }, [])

  const clearAuth = useCallback(() => {
    console.log('[AUTH] clearing auth state')
    profileCacheRef.current = null
    cachedUserIdRef.current = null
    setSession(null)
    setProfile(null)
    setIsLoggedIn(false)
    setIsAdmin(false)
    setNeedsUsername(false)
  }, [])

  useEffect(() => {
    mountedRef.current = true
    let initDone = false

    const initAuth = async () => {
      console.log('[AUTH] init starting...')
      try {
        const { data, error } = await supabase.auth.getSession()

        if (!mountedRef.current) return

        if (error || !data?.session) {
          console.log('[AUTH] getSession: no session')
          clearAuth()
        } else {
          const s = data.session
          console.log('[AUTH] getSession: has session for', s.user.email)
          setSession(s)
          setIsLoggedIn(true)
          setIsAdmin(checkAdmin(s))
          await fetchProfile(s.user.id)
        }
      } catch (err) {
        console.log('[AUTH] getSession error:', err.message)
        if (mountedRef.current) clearAuth()
      } finally {
        initDone = true
        if (mountedRef.current) {
          console.log('[AUTH] init complete')
          setLoading(false)
        }
      }
    }

    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, s) => {
      if (!mountedRef.current) return
      console.log('[AUTH] event:', event)

      // TOKEN_REFRESHED — just update session, nothing else
      if (event === 'TOKEN_REFRESHED') {
        if (s) setSession(s)
        return
      }

      // SIGNED_OUT — clear everything
      if (event === 'SIGNED_OUT' || !s) {
        clearAuth()
        setLoading(false)
        return
      }

      // SIGNED_IN — set session and admin, but DON'T fetch profile here
      // The profile fetch will happen from getSession above (which is more reliable)
      // OR if this fires after a fresh Google redirect, getSession hasn't run yet
      if (event === 'SIGNED_IN') {
        setSession(s)
        setIsLoggedIn(true)
        setIsAdmin(checkAdmin(s))

        // Only fetch profile if init already completed (meaning getSession already ran and didn't find session)
        // This handles the Google OAuth redirect case
        if (initDone) {
          console.log('[AUTH] SIGNED_IN after init — fetching profile')
          await fetchProfile(s.user.id)
          if (mountedRef.current) setLoading(false)
        }
        // If init hasn't completed, getSession will handle the profile fetch
        return
      }

      // INITIAL_SESSION — same as getSession, let init handle it
      if (event === 'INITIAL_SESSION') {
        // init will handle this — don't double-fetch
        return
      }
    })

    return () => {
      mountedRef.current = false
      subscription.unsubscribe()
    }
  }, [fetchProfile, clearAuth])

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
    console.log('[AUTH] logout')
    clearAuth()
    setLoading(false)
    try { await supabase.auth.signOut() } catch { /* already cleared */ }
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
