import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, LogOut, User } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useTranslation } from 'react-i18next'

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)

const Navigation = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const location = useLocation()
  const { isLoggedIn, isAdmin, profile, loginWithGoogle, login, logout } = useAuth()
  const { t, i18n } = useTranslation()

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang)
    if (typeof window !== 'undefined') window.localStorage.setItem('lang', lang)
  }

  const handleGoogleLogin = async () => {
    setAuthError('')
    const result = await loginWithGoogle()
    if (!result.success) setAuthError(result.message)
    // Google redirects away, so modal closes automatically
  }

  const handleAdminLogin = async (e) => {
    e.preventDefault()
    setAuthError('')
    const result = await login(email, password)
    if (result.success) {
      setShowAuth(false)
      setShowAdminLogin(false)
      setEmail('')
      setPassword('')
    } else {
      setAuthError(result.message)
    }
  }

  const closeAuth = () => {
    setShowAuth(false)
    setShowAdminLogin(false)
    setAuthError('')
  }

  const displayName = profile?.username || 'User'
  const avatarUrl = profile?.avatar_url

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[70px]">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="Kynetics Sports logo" className="h-8 w-auto" />
              <span className="font-display text-xl font-extrabold tracking-tight">
                <span className="text-navy">KYNETICS</span>{' '}
                <span className="text-gray-800">SPORTS</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className={`text-sm font-semibold transition-colors ${location.pathname === '/' ? 'text-navy' : 'text-gray-500 hover:text-gray-800'}`}>
                {t('nav.home')}
              </Link>
              <Link to="/nba" className={`text-sm font-semibold transition-colors ${location.pathname === '/nba' ? 'text-navy' : 'text-gray-500 hover:text-gray-800'}`}>
                {t('nav.nba')}
              </Link>

              <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
                <button onClick={() => changeLanguage('en')} className={i18n.language === 'en' ? 'text-navy' : 'hover:text-gray-700'}>EN</button>
                <span className="text-gray-300">|</span>
                <button onClick={() => changeLanguage('es')} className={i18n.language === 'es' ? 'text-navy' : 'hover:text-gray-700'}>ES</button>
              </div>

              {isLoggedIn ? (
                <div className="flex items-center gap-3">
                  {isAdmin && (
                    <span className="text-xs bg-red/10 text-red px-2 py-1 rounded-full font-bold">
                      {t('nav.admin')}
                    </span>
                  )}
                  <div className="flex items-center gap-2">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="" className="w-8 h-8 rounded-full" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-navy/10 flex items-center justify-center">
                        <User className="w-4 h-4 text-navy" />
                      </div>
                    )}
                    <span className="text-sm font-bold text-gray-700">{displayName}</span>
                  </div>
                  <button onClick={logout} className="flex items-center gap-1.5 text-sm font-semibold text-gray-400 hover:text-red transition-colors">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button onClick={() => setShowAuth(true)} className="flex items-center gap-2 bg-navy text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-navy-dark transition-colors">
                  {t('nav.login')}
                </button>
              )}
            </div>

            <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden bg-white border-t overflow-hidden">
              <div className="px-4 py-4 flex flex-col gap-3">
                <Link to="/" className="text-sm font-semibold text-gray-700 py-2" onClick={() => setMobileOpen(false)}>{t('nav.home')}</Link>
                <Link to="/nba" className="text-sm font-semibold text-gray-700 py-2" onClick={() => setMobileOpen(false)}>{t('nav.nba')}</Link>

                <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 py-2">
                  <button onClick={() => changeLanguage('en')} className={i18n.language === 'en' ? 'text-navy' : ''}>EN</button>
                  <span className="text-gray-300">|</span>
                  <button onClick={() => changeLanguage('es')} className={i18n.language === 'es' ? 'text-navy' : ''}>ES</button>
                </div>

                {isLoggedIn ? (
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="" className="w-7 h-7 rounded-full" />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-navy/10 flex items-center justify-center">
                          <User className="w-3.5 h-3.5 text-navy" />
                        </div>
                      )}
                      <span className="text-sm font-bold text-gray-700">{displayName}</span>
                      {isAdmin && <span className="text-[10px] bg-red/10 text-red px-1.5 py-0.5 rounded-full font-bold">ADMIN</span>}
                    </div>
                    <button onClick={() => { logout(); setMobileOpen(false) }} className="text-sm font-semibold text-red flex items-center gap-1">
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button onClick={() => { setShowAuth(true); setMobileOpen(false) }} className="w-full bg-navy text-white py-3 rounded-lg text-sm font-bold">
                    {t('nav.login')}
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4" onClick={closeAuth}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>

              <div className="bg-gradient-to-r from-navy to-navy-dark px-8 pt-8 pb-6">
                <div className="flex items-center gap-2 mb-3">
                  <img src="/logo.png" alt="Kynetics Sports" className="h-6 w-auto" />
                  <span className="text-white font-display font-extrabold text-sm">KYNETICS SPORTS</span>
                </div>
                <h2 className="text-2xl font-bold text-white">{t('auth.welcomeBack')}</h2>
                <p className="text-blue-200 text-sm mt-1">{t('auth.loginSubtitle')}</p>
              </div>

              <div className="p-8">
                {/* Google Sign-In button */}
                <button onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-50 hover:border-gray-300 transition-all text-sm">
                  <GoogleIcon />
                  {t('auth.signInGoogle')}
                </button>

                {authError && (
                  <p className="text-red text-sm bg-red-50 px-3 py-2 rounded-lg mt-4">{authError}</p>
                )}

                {/* Admin email login (hidden by default) */}
                {!showAdminLogin ? (
                  <button onClick={() => setShowAdminLogin(true)} className="w-full text-center text-xs text-gray-300 hover:text-gray-500 mt-6 transition-colors">
                    {t('auth.adminLogin')}
                  </button>
                ) : (
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-400 font-semibold mb-3 uppercase tracking-wider">Admin Login</p>
                    <form onSubmit={handleAdminLogin} className="flex flex-col gap-3">
                      <input type="email" placeholder="admin@email.com" value={email} onChange={e => setEmail(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-navy focus:outline-none" required />
                      <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-navy focus:outline-none" required />
                      <button type="submit" className="w-full bg-gray-800 text-white py-2.5 rounded-lg text-sm font-bold hover:bg-gray-900 transition-colors">
                        {t('auth.signIn')}
                      </button>
                    </form>
                  </div>
                )}

                <p className="text-[11px] text-gray-300 text-center mt-6 leading-relaxed">
                  {t('auth.termsNotice')} <Link to="/terms" className="underline" onClick={closeAuth}>{t('auth.terms')}</Link> {t('auth.and')} <Link to="/privacy" className="underline" onClick={closeAuth}>{t('auth.privacy')}</Link>
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navigation
