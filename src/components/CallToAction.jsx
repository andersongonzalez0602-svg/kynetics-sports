import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const CallToAction = () => {
  return (
    <section className="relative overflow-hidden py-16 md:py-20">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-navy via-[#1a3a7a] to-navy-dark" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(0,212,255,0.15),transparent_70%)]" />

      <div className="relative max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-black text-white italic mb-4">
            Real-Time Data Analysis
          </h2>
          <p className="text-blue-200 text-lg mb-8">
            Get instant insights into every NBA matchup
          </p>
          <Link 
            to="/nba"
            className="inline-block bg-red text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-red/90 transition-colors shadow-lg shadow-red/30"
          >
            Watch Games
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default CallToAction
