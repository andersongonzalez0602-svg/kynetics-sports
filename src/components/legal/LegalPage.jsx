import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const LegalPage = ({ title, lastUpdated, children }) => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="min-h-screen bg-white pt-[70px]">
      {/* Header */}
      <div className="bg-navy-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link to="/" className="inline-flex items-center gap-2 text-blue-300 hover:text-white text-sm font-medium mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
            <h1 className="text-3xl md:text-4xl font-black text-white">{title}</h1>
            {lastUpdated && (
              <p className="text-blue-300 text-sm mt-2">Last Updated: {lastUpdated}</p>
            )}
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-gray max-w-none
          [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mt-10 [&_h2]:mb-4
          [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-gray-800 [&_h3]:mt-6 [&_h3]:mb-3
          [&_p]:text-gray-600 [&_p]:leading-relaxed [&_p]:mb-4
          [&_ul]:text-gray-600 [&_ul]:mb-4 [&_ul]:ml-6 [&_ul]:list-disc
          [&_li]:mb-2 [&_li]:leading-relaxed
          [&_strong]:text-gray-800
          [&_a]:text-navy [&_a]:underline [&_a]:hover:text-navy-dark
          [&_.callout]:bg-blue-50 [&_.callout]:border [&_.callout]:border-blue-100 [&_.callout]:rounded-xl [&_.callout]:p-5 [&_.callout]:my-6
          [&_.callout-red]:bg-red-50 [&_.callout-red]:border [&_.callout-red]:border-red-100 [&_.callout-red]:rounded-xl [&_.callout-red]:p-5 [&_.callout-red]:my-6
          [&_.callout-green]:bg-green-50 [&_.callout-green]:border [&_.callout-green]:border-green-100 [&_.callout-green]:rounded-xl [&_.callout-green]:p-5 [&_.callout-green]:my-6
        ">
          {children}
        </div>
      </div>
    </div>
  )
}

export default LegalPage
