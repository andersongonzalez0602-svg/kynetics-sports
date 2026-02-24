import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Flame, CheckCircle, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabaseClient'
import { getMascotUrl, getRandomMascotUrl } from '@/lib/mascots'
import { getEasternDateString } from '@/lib/dateUtils'

const HeroSection = () => {
  const [topPick, setTopPick] = useState(null)
  const [loading, setLoading] = useState(true)
  const [fallbackMascot] = useState(() => getRandomMascotUrl())

  useEffect(() => {
    const fetchTopPick = async () => {
      const today = getEasternDateString()
      const { data } = await supabase
        .from('nba_games')
        .select('*')
        .eq('game_date', today)
        .order('home_win_pct', { ascending: false })
        .limit(10)

      if (data && data.length > 0) {
        // Find the game with the highest win probability (either home or away)
        let best = null
        let bestPct = 0
        for (const g of data) {
          const maxPct = Math.max(g.home_win_pct || 0, g.away_win_pct || 0)
          if (maxPct > bestPct) {
            bestPct = maxPct
            best = g
          }
        }
        if (best) {
          const isHome = (best.home_win_pct || 0) >= (best.away_win_pct || 0)
          setTopPick({
            teamName: isHome ? best.home_team_name : best.away_team_name,
            teamAbbr: isHome ? best.home_team_abbr : best.away_team_abbr,
            teamColor: isHome ? best.home_team_color : best.away_team_color,
            mascotName: isHome ? best.home_team_mascot_name : best.away_team_mascot_name,
            pct: isHome ? best.home_win_pct : best.away_win_pct,
            mascotImage: isHome
              ? (best.home_team_mascot_image || getMascotUrl(best.home_team_abbr))
              : (best.away_team_mascot_image || getMascotUrl(best.away_team_abbr)),
            opponent: isHome ? best.away_team_name : best.home_team_name,
            gameTime: best.game_time,
          })
        }
      }
      setLoading(false)
    }
    fetchTopPick()
  }, [])

  const hasTopPick = !!topPick
  const teamName = topPick?.teamName
  const pct = topPick?.pct
  const teamColor = topPick?.teamColor || '#1D428A'
  const mascotImage = topPick?.mascotImage || fallbackMascot
  const mascotName = topPick?.mascotName || 'Mascot'
  const opponent = topPick?.opponent
  const gameTime = topPick?.gameTime

  return (
    <section className="pt-[70px] bg-white relative overflow-hidden">
      <div className="absolute top-20 right-0 w-96 h-96 rounded-full blur-[100px] pointer-events-none" style={{ backgroundColor: teamColor, opacity: 0.06 }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left */}
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }} className="order-2 md:order-1">
            <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-3 py-1.5 rounded-full text-xs font-bold mb-6">
              <TrendingUp className="w-3.5 h-3.5 text-red" />
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              TODAY'S TOP PICK
            </div>

            {loading ? (
              <div className="mb-3 space-y-3">
                <div className="h-14 md:h-16 w-48 bg-gray-200 rounded-lg animate-pulse" />
                <div className="h-12 md:h-14 w-24 bg-gray-200 rounded-lg animate-pulse" />
              </div>
            ) : (
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-black leading-[0.9] mb-3">
                {hasTopPick ? (
                  <>
                    <span className="uppercase" style={{ color: teamColor }}>
                      {teamName?.split(' ').pop()}
                    </span>
                    <br />
                    <span style={{ color: teamColor }}>{pct}%</span>
                  </>
                ) : (
                  <span style={{ color: teamColor }}>Don&apos;t miss any game</span>
                )}
              </h1>
            )}

            {!loading && opponent && (
              <p className="text-gray-400 text-sm font-semibold mb-4">
                vs {opponent} {gameTime ? `• ${gameTime}` : ''}
              </p>
            )}

            <p className="text-gray-500 text-base md:text-lg leading-relaxed mb-6 max-w-md">
              Predictions, stats, and matchups for every NBA game — powered by data analysis and brought to life with unique team mascots.
            </p>

            <Link to="/nba" className="inline-flex items-center gap-2 text-white px-7 py-3.5 rounded-xl text-sm font-bold transition-colors group" style={{ backgroundColor: teamColor }}>
              See Full Prediction
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            {hasTopPick && (
              <div className="mt-5">
                <div className="inline-flex items-center gap-2 border border-green-200 bg-green-50 text-green-600 px-3 py-1.5 rounded-lg text-xs font-semibold">
                  <CheckCircle className="w-3.5 h-3.5" />
                  {new Date().toLocaleDateString('en-US', { month:'short', day:'numeric' })} — Live picks available
                </div>
              </div>
            )}
          </motion.div>

          {/* Right — Mascot */}
          <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} transition={{ duration:0.5, delay:0.15 }} className="flex justify-center order-1 md:order-2">
            <div className={`w-full max-w-xs md:max-w-md aspect-square rounded-3xl overflow-hidden shadow-2xl relative ${loading ? 'bg-gray-200 animate-pulse' : ''}`} style={loading ? undefined : { backgroundColor: teamColor }}>
              {loading ? null : mascotImage ? (
                <img
                  src={mascotImage}
                  alt={mascotName}
                  className="w-full h-full object-cover"
                  onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex' }}
                />
              ) : null}
              <div className={`w-full h-full items-center justify-center absolute inset-0 ${mascotImage ? 'hidden' : 'flex'}`}>
                <div className="text-center">
                  <div className="text-7xl md:text-8xl mb-4 text-white/20">🏀</div>
                  <p className="text-white/30 text-sm font-semibold">{mascotName}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
