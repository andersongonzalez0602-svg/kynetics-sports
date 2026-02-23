import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Users, Calendar, Flame } from 'lucide-react'

const stats = [
  { icon: TrendingUp, value: '82%', label: 'AI Accuracy', color: 'text-cyan' },
  { icon: Users, value: '12,534', label: 'Votes Today', color: 'text-navy' },
  { icon: Calendar, value: '6', label: 'Games Today', color: 'text-navy' },
  { icon: Flame, value: '0', label: 'My Streak', color: 'text-orange-500' },
]

const StatsBar = () => {
  return (
    <section className="bg-gradient-to-b from-gray-50 to-blue-50/30 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <stat.icon className={`w-5 h-5 ${stat.color} opacity-60`} />
                  <span className={`text-3xl md:text-4xl font-black ${stat.color}`}>
                    {stat.value}
                  </span>
                </div>
                <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default StatsBar
