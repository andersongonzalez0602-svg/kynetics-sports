import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

const ADMIN_EMAIL = 'andersongonzalez0602@gmail.com'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  const checkAdmin = (s) => {
    if (!s) return false
    return s.user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()
  }

  useEffect(() => {
    const init = async () => {
      const { data: { session: s } } = await supabase.auth.getSession()
      setSession(s)
      setIsLoggedIn(!!s)
      setIsAdmin(checkAdmin(s))
      setLoading(false)
    }
    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
      setIsLoggedIn(!!s)
      setIsAdmin(checkAdmin(s))
    })

    return () => subscription.unsubscribe()
  }, [])

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

  const logout = async () => {
    await supabase.auth.signOut()
    setSession(null)
    setIsLoggedIn(false)
    setIsAdmin(false)
  }

  return (
    <AuthContext.Provider value={{ session, isAdmin, isLoggedIn, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
