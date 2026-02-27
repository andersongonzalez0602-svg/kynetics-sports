import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Loader2, AlertCircle, Check } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { validateUsername } from '@/lib/usernameValidation'
import { useTranslation } from 'react-i18next'

const UsernameModal = () => {
  const { needsUsername, isLoggedIn, createProfile, session } = useAuth()
  const { t } = useTranslation()
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isLoggedIn || !needsUsername) return null

  const avatarUrl = session?.user?.user_metadata?.avatar_url

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const validation = validateUsername(username)
    if (!validation.valid) {
      setError(t(`username.${validation.error}`))
      return
    }

    setLoading(true)
    const result = await createProfile(username)
    if (!result.success) {
      setError(result.message === 'Username already taken' ? t('username.taken') : result.message)
    }
    setLoading(false)
  }

  const validation = validateUsername(username)
  const isValid = username.length >= 3 && validation.valid

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-navy to-navy-dark px-8 pt-8 pb-6">
            <div className="flex items-center gap-2 mb-3">
              <img src="/logo.png" alt="Kynetics Sports" className="h-6 w-auto" />
              <span className="text-white font-display font-extrabold text-sm">KYNETICS SPORTS</span>
            </div>
            <h2 className="text-2xl font-bold text-white">{t('username.title')}</h2>
            <p className="text-blue-200 text-sm mt-1">{t('username.subtitle')}</p>
          </div>

          <div className="p-8">
            {/* Avatar preview */}
            {avatarUrl && (
              <div className="flex justify-center mb-5">
                <img src={avatarUrl} alt="" className="w-16 h-16 rounded-full border-4 border-navy/10" />
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
                  {t('username.label')}
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-sm font-bold">@</span>
                  <input
                    type="text"
                    placeholder="your_name"
                    value={username}
                    onChange={e => { setUsername(e.target.value.replace(/\s/g, '')); setError('') }}
                    maxLength={15}
                    className="w-full pl-9 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent focus:outline-none text-sm"
                    autoFocus
                  />
                  {username.length >= 3 && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2">
                      {isValid ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red" />
                      )}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-gray-400 mt-1.5">
                  {t('username.rules')}
                </p>
              </div>

              {error && (
                <p className="text-red text-sm bg-red-50 px-3 py-2 rounded-lg flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error}
                </p>
              )}

              <button
                type="submit"
                disabled={!isValid || loading}
                className="w-full bg-navy text-white py-3 rounded-lg font-bold hover:bg-navy-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <User className="w-4 h-4" />}
                {loading ? t('username.saving') : t('username.continue')}
              </button>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default UsernameModal
