import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie, X, Shield } from 'lucide-react'
import { Link } from 'react-router-dom'

const CookieBanner = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('kynetics_cookie_consent')
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const accept = () => {
    localStorage.setItem('kynetics_cookie_consent', 'accepted')
    setVisible(false)
  }

  const decline = () => {
    localStorage.setItem('kynetics_cookie_consent', 'declined')
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 z-[200] p-4 md:p-6"
        >
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl shadow-black/10 border border-gray-200 overflow-hidden">
            <div className="p-5 md:p-6">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="w-10 h-10 bg-cyan/10 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                  <Cookie className="w-5 h-5 text-cyan" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 text-base mb-1">We use cookies</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    We use essential cookies to keep you logged in and make the site work. Nothing fancy, no tracking. 
                    Read our <Link to="/cookies" className="text-navy font-semibold underline hover:text-navy-dark">Cookie Policy</Link> for details.
                  </p>
                </div>

                {/* Close */}
                <button onClick={decline} className="text-gray-300 hover:text-gray-500 transition-colors shrink-0">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-3 mt-4 ml-14">
                <button
                  onClick={accept}
                  className="bg-navy text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-navy-dark transition-colors"
                >
                  Accept
                </button>
                <button
                  onClick={decline}
                  className="text-gray-500 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  Decline
                </button>
                <div className="hidden md:flex items-center gap-1.5 ml-auto text-gray-300 text-xs">
                  <Shield className="w-3.5 h-3.5" />
                  Essential cookies only
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CookieBanner
