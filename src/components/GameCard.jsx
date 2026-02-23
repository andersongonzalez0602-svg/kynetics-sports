import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, TrendingUp, Trash2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { getMascotUrl } from '@/lib/mascots'

const GameCard = ({ game, onOpenDetail, onDelete, index = 0 }) => {
  const { isAdmin } = useAuth()
  const [hImgOk, setHImgOk] = useState(true)
  const [aImgOk, setAImgOk] = useState(true)
  const hc = game.home_team_color || '#1D428A'
  const ac = game.away_team_color || '#333333'
  const hp = game.home_win_pct || 50
  const ap = game.away_win_pct || 50
  const hm = game.home_team_mascot_image || getMascotUrl(game.home_team_abbr)
  const am = game.away_team_mascot_image || getMascotUrl(game.away_team_abbr)
  const hn = game.home_team_name?.split(' ').pop() || game.home_team_abbr
  const an = game.away_team_name?.split(' ').pop() || game.away_team_abbr

  const handleDelete = (e) => {
    e.stopPropagation()
    if (window.confirm(`Delete ${game.home_team_name} vs ${game.away_team_name}?`)) onDelete?.(game.id)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.3) }}
      onClick={() => onOpenDetail?.(game)}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden active:scale-[0.98] md:hover:shadow-xl md:hover:-translate-y-1 transition-all duration-200 relative group cursor-pointer"
    >
      {isAdmin && (
        <button onClick={handleDelete} className="absolute top-2 right-2 z-30 w-7 h-7 bg-black/30 hover:bg-red/80 rounded-full flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100">
          <Trash2 className="w-3 h-3 text-white" />
        </button>
      )}

      {/* MASCOTS WITH OVERLAID TEXT */}
      <div className="flex relative" style={{ aspectRatio: '2/1' }}>
        {/* Home */}
        <div className="flex-1 relative overflow-hidden" style={{ backgroundColor: hc }}>
          {hImgOk && <img src={hm} alt={hn} className="w-full h-full object-cover" loading="lazy" onError={() => setHImgOk(false)} />}
          {!hImgOk && <div className="w-full h-full flex items-center justify-center"><span className="text-white/15 font-black text-lg italic">{hn}</span></div>}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent pointer-events-none" />
          <div className="absolute top-0 left-0 p-2.5 sm:p-3 z-10">
            <p className="text-white/50 text-[9px] sm:text-[10px] font-bold">{game.home_team_record}</p>
            <p className="text-white font-black text-base sm:text-xl md:text-2xl leading-none uppercase drop-shadow-md">{hn}</p>
          </div>
        </div>

        {/* Away */}
        <div className="flex-1 relative overflow-hidden" style={{ backgroundColor: ac }}>
          {aImgOk && <img src={am} alt={an} className="w-full h-full object-cover" loading="lazy" onError={() => setAImgOk(false)} />}
          {!aImgOk && <div className="w-full h-full flex items-center justify-center"><span className="text-white/15 font-black text-lg italic">{an}</span></div>}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent pointer-events-none" />
          <div className="absolute top-0 right-0 p-2.5 sm:p-3 z-10 text-right">
            <p className="text-white/50 text-[9px] sm:text-[10px] font-bold">{game.away_team_record}</p>
            <p className="text-white font-black text-base sm:text-xl md:text-2xl leading-none uppercase drop-shadow-md">{an}</p>
          </div>
        </div>

        {/* VS */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white rounded-full flex items-center justify-center shadow-lg">
            <span className="text-[8px] sm:text-[9px] font-black text-gray-400">VS</span>
          </div>
        </div>

        {/* Time badge */}
        <div className="absolute top-2 left-2 z-20">
          <div className="flex items-center gap-1 bg-black/30 backdrop-blur-sm text-white px-2 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-bold">
            {game.status === 'live' ? <><span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> LIVE</> :
             game.status === 'final' ? 'FINAL' : <><Clock className="w-2.5 h-2.5" /> {game.game_time || 'TBD'}</>}
          </div>
        </div>

        {/* Value */}
        {game.is_value_pick && (
          <div className="absolute top-2 right-2 z-20">
            <div className="flex items-center gap-1 bg-emerald-500 text-white px-2 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-bold shadow-sm">
              <TrendingUp className="w-2.5 h-2.5" /> VALUE
            </div>
          </div>
        )}
      </div>

      {/* BAR */}
      <div className="px-3 pt-3 pb-1">
        <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">AI Prediction</p>
        <div className="h-9 sm:h-10 rounded-xl overflow-hidden flex">
          <div className="flex items-center pl-2.5 sm:pl-3 rounded-l-xl transition-all duration-700" style={{ width: `${hp}%`, backgroundColor: hc }}>
            <span className="text-white text-xs sm:text-sm font-black">{hp}%</span>
          </div>
          <div className="flex items-center justify-end pr-2.5 sm:pr-3 rounded-r-xl transition-all duration-700" style={{ width: `${ap}%`, backgroundColor: ac }}>
            <span className="text-white text-xs sm:text-sm font-black">{ap}%</span>
          </div>
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase">{game.home_team_abbr}</span>
          <span className="text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase">{game.away_team_abbr}</span>
        </div>
      </div>

      {/* REASON */}
      {game.reason_text && (
        <div className="px-3 pt-1.5">
          <p className="text-gray-400 text-[11px] sm:text-xs leading-relaxed line-clamp-2">💡 {game.reason_text}</p>
        </div>
      )}

      {/* BUTTON */}
      <div className="p-3 pt-2.5">
        <div className="w-full py-3 sm:py-3.5 bg-gray-50 md:group-hover:bg-navy text-gray-400 md:group-hover:text-white rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center border border-gray-100 md:group-hover:border-navy">
          See Details →
        </div>
      </div>
    </motion.div>
  )
}

export default GameCard
