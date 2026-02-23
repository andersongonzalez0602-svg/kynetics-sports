import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Flame, LogIn, LogOut, User } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

const Navigation = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState('login') // 'login' or 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [authSuccess, setAuthSuccess] = useState('')
  const location = useLocation()
  const { isLoggedIn, isAdmin, login, signup, logout, session } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setAuthError('')
    setAuthSuccess('')

    if (authMode === 'login') {
      const result = await login(email, password)
      if (result.success) {
        setShowAuth(false)
        setEmail('')
        setPassword('')
      } else {
        setAuthError(result.message)
      }
    } else {
      const result = await signup(email, password)
      if (result.success) {
        setAuthSuccess(result.message)
        setEmail('')
        setPassword('')
      } else {
        setAuthError(result.message)
      }
    }
  }

  const closeAuth = () => {
    setShowAuth(false)
    setAuthError('')
    setAuthSuccess('')
    setAuthMode('login')
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[70px]">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="Kynetics" className="h-8" />
              <span className="font-display text-xl font-extrabold tracking-tight">
                <span className="text-navy">KYNETICS</span>{' '}
                <span className="text-gray-800">SPORTS</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <Link 
                to="/" 
                className={`text-sm font-semibold transition-colors ${
                  location.pathname === '/' ? 'text-navy' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                Home
              </Link>
              <Link 
                to="/nba" 
                className={`text-sm font-semibold transition-colors ${
                  location.pathname === '/nba' ? 'text-navy' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                NBA
              </Link>
              
              <button className="flex items-center gap-2 bg-navy text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-navy-dark transition-colors">
                <Flame className="w-4 h-4 text-orange-400" />
                MY STREAK
              </button>

              {isLoggedIn ? (
                <div className="flex items-center gap-3">
                  {isAdmin && (
                    <span className="text-xs bg-red/10 text-red px-2 py-1 rounded-full font-bold">
                      ADMIN
                    </span>
                  )}
                  <div className="w-8 h-8 rounded-full bg-navy/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-navy" />
                  </div>
                  <button 
                    onClick={logout}
                    className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-red transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setShowAuth(true)}
                  className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-navy transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </button>
              )}
            </div>

            {/* Mobile hamburger */}
            <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-white border-t overflow-hidden"
            >
              <div className="px-4 py-4 flex flex-col gap-3">
                <Link to="/" className="text-sm font-semibold text-gray-700 py-2" onClick={() => setMobileOpen(false)}>Home</Link>
                <Link to="/nba" className="text-sm font-semibold text-gray-700 py-2" onClick={() => setMobileOpen(false)}>NBA</Link>
                {isLoggedIn ? (
                  <button onClick={() => { logout(); setMobileOpen(false); }} className="text-sm font-semibold text-red py-2 text-left flex items-center gap-2">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                ) : (
                  <button onClick={() => { setShowAuth(true); setMobileOpen(false); }} className="text-sm font-semibold text-navy py-2 text-left flex items-center gap-2">
                    <LogIn className="w-4 h-4" /> Login
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuth && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4"
            onClick={closeAuth}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-navy to-navy-dark px-8 pt-8 pb-6">
                <div className="flex items-center gap-2 mb-3">
                  <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
                    <path d="M8 6L24 16L8 26V6Z" fill="#00d4ff" opacity="0.8"/>
                    <path d="M4 10L20 20L4 28V10Z" fill="white"/>
                  </svg>
                  <span className="text-white font-display font-extrabold text-sm">KYNETICS SPORTS</span>
                </div>
                <h2 className="text-2xl font-bold text-white">
                  {authMode === 'login' ? 'Welcome back' : 'Create account'}
                </h2>
                <p className="text-blue-200 text-sm mt-1">
                  {authMode === 'login' ? 'Sign in to access your account' : 'Join the Kynetics community'}
                </p>
              </div>

              {/* Form */}
              <div className="p-8">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Email</label>
                    <input
                      type="email"
                      placeholder="you@email.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent focus:outline-none text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent focus:outline-none text-sm"
                      required
                    />
                  </div>

                  {authError && (
                    <p className="text-red text-sm bg-red-50 px-3 py-2 rounded-lg">{authError}</p>
                  )}
                  {authSuccess && (
                    <p className="text-green-600 text-sm bg-green-50 px-3 py-2 rounded-lg">{authSuccess}</p>
                  )}

                  <button 
                    type="submit" 
                    className="w-full bg-navy text-white py-3 rounded-lg font-bold hover:bg-navy-dark transition-colors mt-2"
                  >
                    {authMode === 'login' ? 'Sign In' : 'Create Account'}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-gray-400 text-sm">
                    {authMode === 'login' ? "Don't have an account?" : "Already have an account?"}
                    <button 
                      onClick={() => {
                        setAuthMode(authMode === 'login' ? 'signup' : 'login')
                        setAuthError('')
                        setAuthSuccess('')
                      }}
                      className="text-navy font-semibold ml-1 hover:underline"
                    >
                      {authMode === 'login' ? 'Sign up' : 'Sign in'}
                    </button>
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navigation
