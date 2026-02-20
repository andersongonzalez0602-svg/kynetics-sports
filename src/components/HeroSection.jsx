import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Flame, CheckCircle, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const HeroSection = () => {
  return (
    <section className="pt-[70px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left side */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Pick of the day badge */}
            <div className="inline-flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 px-4 py-2 rounded-full text-sm font-bold mb-8">
              <TrendingUp className="w-4 h-4" />
              <Flame className="w-4 h-4 text-orange-500" />
              PICK OF THE DAY
            </div>

            {/* Main heading */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-[0.9] mb-6">
              <span className="bg-gradient-to-r from-navy to-red bg-clip-text text-transparent">
                CLEVELAND
              </span>
              <br />
              <span className="text-navy">89%</span>
            </h1>

            {/* Description */}
            <p className="text-gray-500 text-lg leading-relaxed mb-8 max-w-lg">
              advanced AI analyzes 10,000+ data points including player performance, 
              team statistics, and historical matchups to deliver the most accurate 
              NBA predictions in the game.
            </p>

            {/* CTA Button */}
            <Link 
              to="/nba"
              className="inline-flex items-center gap-2 bg-navy-dark text-white px-8 py-4 rounded-xl text-base font-bold hover:bg-navy transition-colors group"
            >
              See Full Prediction
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Accuracy badge */}
            <div className="mt-6">
              <div className="inline-flex items-center gap-2 border border-green-200 bg-green-50 text-green-600 px-4 py-2 rounded-lg text-sm font-semibold">
                <CheckCircle className="w-4 h-4" />
                Yesterday: 92.4% Accuracy
              </div>
            </div>
          </motion.div>

          {/* Right side - Mascot placeholder */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="w-full max-w-md aspect-square rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center shadow-2xl overflow-hidden">
              <div className="text-center text-white/60">
                <div className="text-8xl mb-4">🐾</div>
                <p className="text-sm font-semibold">Hero Mascot</p>
                <p className="text-xs opacity-60">Upload via Admin Panel</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
