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

  // Guards against concurrent fetchProfile calls and re-entrant handleSession
  const fetchingRef = useRef(false)
  const currentUserIdRef = useRef(null)
  const profileCacheRef = useRef(null)

  const checkAdmin = (s) => s?.user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()

  const fetchProfile = useCallback(async (userId) => {
    // If we already have a cached profile for this user, use it
    if (profileCacheRef.current && currentUserIdRef.current === userId) {
      setProfile(profileCacheRef.current)
      setNeedsUsername(false)
      return profileCacheRef.current
    }

    // Prevent concurrent fetches
    if (fetchingRef.current) return profileCacheRef.current
    fetchingRef.current = true

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('user_id', userId)
        .single()

      if (error || !data) {
        setProfile(null)
        setNeedsUsername(true)
        profileCacheRef.current = null
        return null
      }

      setProfile(data)
      setNeedsUsername(false)
      profileCacheRef.current = data
      currentUserIdRef.current = userId
      return data
    } catch {
      // Network error — don't wipe existing profile
      return profileCacheRef.current
    } finally {
      fetchingRef.current = false
    }
  }, [])

  useEffect(() => {
    let mounted = true

    const init = async () => {
      try {
        const { data: { session: s } } = await supabase.auth.getSession()
        if (!mounted) return

        if (s?.user) {
          setSession(s)
          setIsLoggedIn(true)
          setIsAdmin(checkAdmin(s))
          await fetchProfile(s.user.id)
        } else {
          setSession(null)
          setIsLoggedIn(false)
          setIsAdmin(false)
          setProfile(null)
          setNeedsUsername(false)
        }
      } catch {
        // Supabase init failed — leave as logged out
      } finally {
        if (mounted) setLoading(false)
      }
    }

    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, s) => {
      if (!mounted) return

      // TOKEN_REFRESHED: session is the same user, just new tokens
      // Don't re-fetch profile, just update session object
      if (event === 'TOKEN_REFRESHED') {
        setSession(s)
        return
      }

      // SIGNED_OUT: clear everything
      if (event === 'SIGNED_OUT' || !s) {
        setSession(null)
        setIsLoggedIn(false)
        setIsAdmin(false)
        setProfile(null)
        setNeedsUsername(false)
        profileCacheRef.current = null
        currentUserIdRef.current = null
        return
      }

      // SIGNED_IN or INITIAL_SESSION: full setup
      if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
        setSession(s)
        setIsLoggedIn(true)
        setIsAdmin(checkAdmin(s))

        if (s.user?.id) {
          // Only fetch if it's a different user than cached
          if (currentUserIdRef.current !== s.user.id) {
            profileCacheRef.current = null
          }
          await fetchProfile(s.user.id)
        }
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [fetchProfile])

  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + window.location.pathname },
    })
    if (error) return { success: false, message: error.message }
    return { success: true }
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

      setProfile(data)
      setNeedsUsername(false)
      profileCacheRef.current = data
      currentUserIdRef.current = session.user.id
      return { success: true }
    } catch (err) {
      return { success: false, message: err.message }
    }
  }

  const logout = async () => {
    // Clear state FIRST so UI updates immediately
    profileCacheRef.current = null
    currentUserIdRef.current = null
    setProfile(null)
    setNeedsUsername(false)
    setIsAdmin(false)
    setIsLoggedIn(false)
    setSession(null)

    // Then tell Supabase (this triggers onAuthStateChange SIGNED_OUT too, but state is already clean)
    try {
      await supabase.auth.signOut()
    } catch {
      // Even if signOut fails, local state is already cleared
    }
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
