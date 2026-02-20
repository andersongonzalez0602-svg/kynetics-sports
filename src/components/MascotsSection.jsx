import React from 'react'
import { motion } from 'framer-motion'
import { Zap, Layers, Wifi } from 'lucide-react'

const mascotSlots = [
  { name: 'HOUSTON', color: '#CE1141' },
  { name: 'LAKERS', color: '#552583' },
  { name: 'BULLS', color: '#CE1141' },
  { name: 'CELTICS', color: '#007A33' },
  { name: 'NETS', color: '#000000' },
  { name: 'HEAT', color: '#98002E' },
]

const MascotsSection = () => {
  return (
    <section>
      {/* Top - Dark blue intro */}
      <div className="bg-gradient-to-b from-navy to-navy-dark py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Meet the Mascots</h2>
            <p className="text-blue-200 text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
              Every team has a story. Our AI-powered mascots bring that story to life, 
              capturing the essence and spirit of each franchise through dynamic, unique designs.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { icon: Zap, label: 'AI-Powered Design' },
                { icon: Layers, label: 'Dynamic Vector Style' },
                { icon: Wifi, label: 'Unique Identity' },
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-full text-white/80 text-sm font-medium">
                  <badge.icon className="w-4 h-4 text-cyan" />
                  {badge.label}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom - Mascot grid */}
      <div className="bg-gray-50 py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-3 italic">
              Every Game Has a Face
            </h3>
            <p className="text-gray-500 max-w-lg mx-auto">
              Each matchup features a unique mascot representing the identity and spirit of the franchise.
            </p>
            <div className="w-16 h-1 bg-cyan mx-auto rounded-full mt-4" />
          </motion.div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {mascotSlots.map((slot, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="text-center"
              >
                <div 
                  className="aspect-square rounded-2xl flex items-center justify-center mb-3 shadow-md overflow-hidden"
                  style={{ backgroundColor: slot.color }}
                >
                  <span className="text-4xl md:text-5xl opacity-50">🏀</span>
                </div>
                <p className="text-sm font-bold text-navy">{slot.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default MascotsSection
