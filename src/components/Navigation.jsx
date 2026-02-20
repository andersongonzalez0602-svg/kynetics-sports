import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Flame, LogIn, LogOut } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

const Navigation = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const location = useLocation()
  const { isAdmin, login, logout } = useAuth()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginError('')
    const result = await login(email, password)
    if (result.success) {
      setShowLogin(false)
      setEmail('')
      setPassword('')
    } else {
      setLoginError(result.message)
    }
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[70px]">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M8 6L24 16L8 26V6Z" fill="#00d4ff" opacity="0.8"/>
                <path d="M4 10L20 20L4 28V10Z" fill="#1D428A"/>
              </svg>
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

              {isAdmin ? (
                <button 
                  onClick={logout}
                  className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-red-500 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              ) : (
                <button 
                  onClick={() => setShowLogin(true)}
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
                {isAdmin ? (
                  <button onClick={() => { logout(); setMobileOpen(false); }} className="text-sm font-semibold text-red-500 py-2 text-left">Logout</button>
                ) : (
                  <button onClick={() => { setShowLogin(true); setMobileOpen(false); }} className="text-sm font-semibold text-navy py-2 text-left">Login</button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Login Modal */}
      <AnimatePresence>
        {showLogin && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4"
            onClick={() => setShowLogin(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Admin Login</h2>
              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-navy focus:outline-none text-sm"
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-navy focus:outline-none text-sm"
                  required
                />
                {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
                <button type="submit" className="w-full bg-navy text-white py-3 rounded-lg font-bold hover:bg-navy-dark transition-colors">
                  Sign In
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navigation
