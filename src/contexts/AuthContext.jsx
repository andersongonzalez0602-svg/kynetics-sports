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
    if (!userId) { console.log('[AUTH] fetchProfile: no userId'); return null }

    // Return cache if same user
    if (cachedUserIdRef.current === userId && profileCacheRef.current) {
      console.log('[AUTH] fetchProfile: returning cache for', userId, profileCacheRef.current.username)
      if (mountedRef.current) {
        setProfile(profileCacheRef.current)
        setNeedsUsername(false)
      }
      return profileCacheRef.current
    }

    if (fetchLockRef.current) {
      console.log('[AUTH] fetchProfile: locked, returning cache')
      return profileCacheRef.current
    }
    fetchLockRef.current = true
    console.log('[AUTH] fetchProfile: fetching for userId', userId)

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('user_id', userId)
        .single()

      if (!mountedRef.current) return null

      if (error) {
        console.log('[AUTH] fetchProfile: ERROR', error.code, error.message)
        profileCacheRef.current = null
        cachedUserIdRef.current = userId
        setProfile(null)
        setNeedsUsername(true)
        return null
      }

      if (!data) {
        console.log('[AUTH] fetchProfile: no data returned')
        profileCacheRef.current = null
        cachedUserIdRef.current = userId
        setProfile(null)
        setNeedsUsername(true)
        return null
      }

      console.log('[AUTH] fetchProfile: SUCCESS', data.username)
      profileCacheRef.current = data
      cachedUserIdRef.current = userId
      setProfile(data)
      setNeedsUsername(false)
      return data
    } catch (err) {
      console.log('[AUTH] fetchProfile: CATCH error', err.message)
      return profileCacheRef.current
    } finally {
      fetchLockRef.current = false
    }
  }, [])

  const clearAuth = useCallback(() => {
    console.log('[AUTH] clearAuth called')
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
      console.log('[AUTH] applySession: no user in session')
      clearAuth()
      return
    }
    console.log('[AUTH] applySession: user', s.user.email, 'id', s.user.id)
    setSession(s)
    setIsLoggedIn(true)
    setIsAdmin(checkAdmin(s))
    await fetchProfile(s.user.id)
  }, [fetchProfile, clearAuth])

  useEffect(() => {
    mountedRef.current = true
    console.log('[AUTH] init starting...')

    const initAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        console.log('[AUTH] getSession result:', error ? 'ERROR: ' + error.message : data?.session ? 'has session' : 'no session')

        if (!mountedRef.current) return

        if (data?.session) {
          await applySession(data.session)
        } else {
          clearAuth()
        }
      } catch (err) {
        console.log('[AUTH] getSession CATCH:', err.message)
        if (mountedRef.current) clearAuth()
      } finally {
        if (mountedRef.current) {
          console.log('[AUTH] init complete, setting loading=false')
          setLoading(false)
        }
      }
    }

    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, s) => {
      if (!mountedRef.current) return
      console.log('[AUTH] onAuthStateChange:', event, s?.user?.email || 'no user')

      if (event === 'TOKEN_REFRESHED') {
        if (s) setSession(s)
        return
      }

      if (event === 'SIGNED_OUT' || !s) {
        clearAuth()
        setLoading(false)
        return
      }

      // SIGNED_IN, INITIAL_SESSION
      await applySession(s)
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
      console.log('[AUTH] createProfile: SUCCESS', data.username)
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
    console.log('[AUTH] logout called')
    clearAuth()
    setLoading(false)
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
