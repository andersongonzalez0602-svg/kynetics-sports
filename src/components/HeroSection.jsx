import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Flame, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabaseClient'
import { getMascotUrl } from '@/lib/mascots'

const HeroSection = () => {
  const [topPick, setTopPick] = useState(null)
  const [imgLoaded, setImgLoaded] = useState(false)

  useEffect(() => {
    const fetchTopPick = async () => {
      const today = new Date().toISOString().split('T')[0]
      const { data } = await supabase
        .from('nba_games')
        .select('*')
        .eq('game_date', today)
        .order('home_win_pct', { ascending: false })
        .limit(10)

      if (data?.length) {
        let best = null, bestPct = 0
        for (const g of data) {
          const mx = Math.max(g.home_win_pct || 0, g.away_win_pct || 0)
          if (mx > bestPct) { bestPct = mx; best = g }
        }
        if (best) {
          const isH = (best.home_win_pct || 0) >= (best.away_win_pct || 0)
          setTopPick({
            teamName: isH ? best.home_team_name : best.away_team_name,
            teamColor: isH ? best.home_team_color : best.away_team_color,
            mascotName: isH ? best.home_team_mascot_name : best.away_team_mascot_name,
            pct: isH ? best.home_win_pct : best.away_win_pct,
            mascotImage: isH
              ? (best.home_team_mascot_image || getMascotUrl(best.home_team_abbr))
              : (best.away_team_mascot_image || getMascotUrl(best.away_team_abbr)),
            opponent: isH ? best.away_team_name : best.home_team_name,
            gameTime: best.game_time,
            gameCount: data.length,
          })
        }
      }
    }
    fetchTopPick()
  }, [])

  const name = topPick?.teamName || 'CLEVELAND'
  const pct = topPick?.pct || 89
  const color = topPick?.teamColor || '#860038'
  const img = topPick?.mascotImage
  const opp = topPick?.opponent
  const time = topPick?.gameTime
  const shortName = name?.split(' ').pop()

  return (
    <section className="pt-[70px] bg-white relative overflow-hidden">
      {/* Subtle glow */}
      <div className="absolute top-20 right-0 w-64 sm:w-96 h-64 sm:h-96 rounded-full blur-[80px] sm:blur-[100px] pointer-events-none" style={{ backgroundColor: color, opacity: 0.06 }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        {/* ===== MOBILE LAYOUT ===== */}
        <div className="md:hidden py-6">
          {/* Mascot + overlay text */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-xl mb-5"
          >
            {img && (
              <img
                src={img}
                alt={shortName}
                className={`w-full h-full object-cover transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setImgLoaded(true)}
                onError={e => e.target.style.display = 'none'}
                loading="eager"
              />
            )}
            {!imgLoaded && (
              <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: color }}>
                <span className="text-6xl text-white/20">🏀</span>
              </div>
            )}
            {/* Gradient overlay at bottom for text */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="flex items-center gap-1.5 mb-1">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                <span className="text-white/70 text-[10px] font-bold uppercase tracking-wider">Today's Top Pick</span>
              </div>
              <h1 className="text-4xl font-black text-white leading-none uppercase">{shortName}</h1>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black text-white">{pct}%</span>
                {opp && <span className="text-white/50 text-xs font-semibold">vs {opp?.split(' ').pop()}</span>}
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              AI-powered predictions and unique mascots for every NBA matchup.
            </p>
            <Link to="/nba" className="flex items-center justify-center gap-2 text-white w-full py-3.5 rounded-xl text-sm font-bold group" style={{ backgroundColor: color }}>
              See All Predictions
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* ===== DESKTOP LAYOUT ===== */}
        <div className="hidden md:grid md:grid-cols-2 gap-12 items-center py-16 lg:py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-3 py-1.5 rounded-full text-xs font-bold mb-6">
              <TrendingUp className="w-3.5 h-3.5 text-red" />
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              TODAY'S TOP PICK
            </div>

            <h1 className="text-6xl lg:text-7xl font-black leading-[0.9] mb-3">
              <span className="uppercase" style={{ color }}>{shortName}</span>
              <br />
              <span style={{ color }}>{pct}%</span>
            </h1>

            {opp && (
              <p className="text-gray-400 text-sm font-semibold mb-4">
                vs {opp} {time ? `• ${time}` : ''}
              </p>
            )}

            <p className="text-gray-500 text-base lg:text-lg leading-relaxed mb-6 max-w-md">
              Predictions, stats, and matchups for every NBA game — powered by data analysis and brought to life with unique team mascots.
            </p>

            <Link to="/nba" className="inline-flex items-center gap-2 text-white px-7 py-3.5 rounded-xl text-sm font-bold group" style={{ backgroundColor: color }}>
              See Full Prediction
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.15 }} className="flex justify-center">
            <div className="w-full max-w-md aspect-square rounded-3xl overflow-hidden shadow-2xl relative">
              {img && (
                <img src={img} alt={shortName} className="w-full h-full object-cover"
                  onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }} loading="eager" />
              )}
              <div className={`w-full h-full items-center justify-center absolute inset-0 ${img ? 'hidden' : 'flex'}`} style={{ backgroundColor: color }}>
                <div className="text-7xl text-white/20">🏀</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
