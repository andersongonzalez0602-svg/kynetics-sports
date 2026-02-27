import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

const ADMIN_EMAIL = 'andersongonzalez0602@gmail.com'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null) // { username, avatar_url }
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [needsUsername, setNeedsUsername] = useState(false)
  const [loading, setLoading] = useState(true)

  const checkAdmin = (s) => {
    if (!s) return false
    return s.user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()
  }

  const fetchProfile = async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('username, avatar_url')
      .eq('user_id', userId)
      .single()

    if (error || !data) {
      setProfile(null)
      setNeedsUsername(true)
      return null
    }

    setProfile(data)
    setNeedsUsername(false)
    return data
  }

  const handleSession = async (s) => {
    setSession(s)
    setIsLoggedIn(!!s)
    setIsAdmin(checkAdmin(s))

    if (s?.user?.id) {
      await fetchProfile(s.user.id)
    } else {
      setProfile(null)
      setNeedsUsername(false)
    }
  }

  useEffect(() => {
    const init = async () => {
      const { data: { session: s } } = await supabase.auth.getSession()
      await handleSession(s)
      setLoading(false)
    }
    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, s) => {
      await handleSession(s)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Google sign-in
  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + window.location.pathname,
      },
    })
    if (error) return { success: false, message: error.message }
    return { success: true }
  }

  // Email/password login (keep for admin)
  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { success: false, message: error.message }
    return { success: true }
  }

  const signup = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) return { success: false, message: error.message }
    return { success: true, message: 'Check your email to confirm your account.' }
  }

  // Create username profile
  const createProfile = async (username) => {
    if (!session?.user?.id) return { success: false, message: 'Not logged in' }

    const { data, error } = await supabase
      .from('profiles')
      .insert({
        user_id: session.user.id,
        username: username.trim(),
        avatar_url: session.user.user_metadata?.avatar_url || null,
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') return { success: false, message: 'Username already taken' }
      return { success: false, message: error.message }
    }

    setProfile(data)
    setNeedsUsername(false)
    return { success: true }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setSession(null)
    setIsLoggedIn(false)
    setIsAdmin(false)
    setProfile(null)
    setNeedsUsername(false)
  }

  return (
    <AuthContext.Provider value={{
      session, profile, isAdmin, isLoggedIn, loading,
      needsUsername, loginWithGoogle, login, signup,
      createProfile, logout,
    }}>
      {children}
    </AuthContext.Provider>
  )
}
