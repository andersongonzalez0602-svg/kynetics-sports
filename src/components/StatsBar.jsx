import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabaseClient'

const StatsBar = () => {
  const [gamesToday, setGamesToday] = useState(null)

  useEffect(() => {
    const fetchCount = async () => {
      const today = new Date().toISOString().split('T')[0]
      const { count } = await supabase
        .from('nba_games')
        .select('*', { count: 'exact', head: true })
        .eq('game_date', today)
      setGamesToday(count || 0)
    }
    fetchCount()
  }, [])

  return (
    <section className="bg-gradient-to-b from-gray-50 to-blue-50/30 py-6 md:py-8">
      <div className="max-w-3xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Link
            to="/nba"
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6 flex items-center justify-between hover:shadow-md transition-shadow group block"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-navy/5 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 md:w-7 md:h-7 text-navy" />
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl md:text-4xl font-black text-navy">
                    {gamesToday !== null ? gamesToday : '—'}
                  </span>
                  <span className="text-sm md:text-base font-semibold text-gray-400">
                    {gamesToday === 1 ? 'Game' : 'Games'} Today
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  {gamesToday > 0
                    ? 'AI predictions ready — tap to explore'
                    : 'Check back later for upcoming matchups'}
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-navy group-hover:translate-x-1 transition-all shrink-0" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default StatsBar
