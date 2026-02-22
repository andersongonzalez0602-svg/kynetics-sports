import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Flame, CheckCircle, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const HeroSection = () => {
  return (
    <section className="pt-[70px] bg-white relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-cyan/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left side */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="order-2 md:order-1"
          >
            {/* Pick of the day badge */}
            <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-3 py-1.5 rounded-full text-xs font-bold mb-6">
              <TrendingUp className="w-3.5 h-3.5 text-red" />
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              TODAY'S TOP PICK
            </div>

            {/* Main heading */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black leading-[0.9] mb-5">
              <span className="bg-gradient-to-r from-navy to-red bg-clip-text text-transparent">
                CLEVELAND
              </span>
              <br />
              <span className="text-navy">89%</span>
            </h1>

            {/* Description */}
            <p className="text-gray-500 text-base md:text-lg leading-relaxed mb-6 max-w-md">
              Predictions, stats, and matchups for every NBA game — powered by data analysis and brought to life with unique team mascots.
            </p>

            {/* CTA Button */}
            <Link 
              to="/nba"
              className="inline-flex items-center gap-2 bg-navy text-white px-7 py-3.5 rounded-xl text-sm font-bold hover:bg-navy-dark transition-colors group"
            >
              See Full Prediction
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Accuracy badge */}
            <div className="mt-5">
              <div className="inline-flex items-center gap-2 border border-green-200 bg-green-50 text-green-600 px-3 py-1.5 rounded-lg text-xs font-semibold">
                <CheckCircle className="w-3.5 h-3.5" />
                Yesterday: 92.4% Accuracy
              </div>
            </div>
          </motion.div>

          {/* Right side - Mascot */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex justify-center order-1 md:order-2"
          >
            <div className="w-full max-w-xs md:max-w-md aspect-square rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center shadow-2xl shadow-indigo-500/20 overflow-hidden">
              <div className="text-center text-white/60">
                <div className="text-7xl md:text-8xl mb-4">🐾</div>
                <p className="text-sm font-semibold">Hero Mascot</p>
                <p className="text-xs opacity-60">Swap in /public/mascots/</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
