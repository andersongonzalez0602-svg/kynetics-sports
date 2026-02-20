import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const CallToAction = () => {
  return (
    <section className="bg-gradient-to-r from-navy to-cyan py-16 md:py-20">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-black text-white italic mb-4">
            Real-Time Data Analysis
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Get instant insights into every NBA matchup
          </p>
          <Link 
            to="/nba"
            className="inline-block bg-red text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-red-700 transition-colors shadow-lg"
          >
            Watch Games
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default CallToAction
