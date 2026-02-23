import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Zap, Shield } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

const StatsBar = () => {
  const [gamesToday, setGamesToday] = useState(0)

  useEffect(() => {
    const fetch = async () => {
      const today = new Date().toISOString().split('T')[0]
      const { count } = await supabase
        .from('nba_games')
        .select('*', { count: 'exact', head: true })
        .eq('game_date', today)
      setGamesToday(count || 0)
    }
    fetch()
  }, [])

  const stats = [
    { icon: Calendar, value: gamesToday, label: 'Games Today', color: 'text-navy' },
    { icon: Zap, value: '30', label: 'Teams Covered', color: 'text-cyan' },
    { icon: Shield, value: '30', label: 'Original Mascots', color: 'text-navy' },
  ]

  return (
    <section className="bg-gradient-to-b from-gray-50 to-blue-50/30 py-6 sm:py-8">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 md:p-8"
        >
          <div className="grid grid-cols-3 gap-4 sm:gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-1">
                  <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.color} opacity-60`} />
                  <span className={`text-2xl sm:text-3xl md:text-4xl font-black ${stat.color}`}>
                    {stat.value}
                  </span>
                </div>
                <p className="text-gray-400 text-[11px] sm:text-sm font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default StatsBar
