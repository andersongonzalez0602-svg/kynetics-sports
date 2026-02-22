import React from 'react'
import { motion } from 'framer-motion'
import { Clock, TrendingUp, Trash2, ChevronRight } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { getMascotUrl } from '@/lib/mascots'

const GameCard = ({ game, onOpenDetail, onDelete }) => {
  const { isAdmin } = useAuth()
  const homeColor = game.home_team_color || '#1D428A'
  const awayColor = game.away_team_color || '#333333'
  const homePct = game.home_win_pct || 50
  const awayPct = game.away_win_pct || 50
  const homeMascot = game.home_team_mascot_image || getMascotUrl(game.home_team_abbr)
  const awayMascot = game.away_team_mascot_image || getMascotUrl(game.away_team_abbr)
  const homeShort = game.home_team_name?.split(' ').pop() || game.home_team_abbr
  const awayShort = game.away_team_name?.split(' ').pop() || game.away_team_abbr

  const handleDelete = (e) => {
    e.stopPropagation()
    if (window.confirm(`Delete ${game.home_team_name} vs ${game.away_team_name}?`)) onDelete?.(game.id)
  }

  const MascotBox = ({ src, color, name }) => (
    <div className="flex-1 aspect-[4/3] rounded-xl overflow-hidden relative" style={{ backgroundColor: color }}>
      <img src={src} alt={name} className="w-full h-full object-cover" onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex' }} />
      <div className="w-full h-full items-center justify-center absolute inset-0 hidden">
        <span className="text-white/20 font-black text-base md:text-xl italic">{name}</span>
      </div>
    </div>
  )

  return (
    <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 relative group">
      {isAdmin && (
        <button onClick={handleDelete} className="absolute top-2 right-2 z-20 w-7 h-7 bg-black/20 hover:bg-red/80 rounded-full flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100">
          <Trash2 className="w-3 h-3 text-white" />
        </button>
      )}

      {/* HEADER */}
      <div className="relative flex" style={{ minHeight:'80px' }}>
        <div className="flex-1 p-3 md:p-4 flex flex-col justify-center" style={{ backgroundColor: homeColor }}>
          <p className="text-white/60 text-[10px] font-bold">{game.home_team_record}</p>
          <p className="text-white font-black text-lg md:text-2xl leading-tight uppercase tracking-tight">{homeShort}</p>
        </div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
            <span className="text-[9px] font-black text-gray-400">VS</span>
          </div>
        </div>
        <div className="flex-1 p-3 md:p-4 flex flex-col justify-center items-end" style={{ backgroundColor: awayColor }}>
          <p className="text-white/60 text-[10px] font-bold">{game.away_team_record}</p>
          <p className="text-white font-black text-lg md:text-2xl leading-tight uppercase tracking-tight text-right">{awayShort}</p>
        </div>

        <div className="absolute top-2.5 left-2.5 z-10">
          <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded-full text-[10px] font-bold">
            {game.status === 'live' && <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />}
            {game.status === 'live' ? 'LIVE' : game.status === 'final' ? 'FINAL' : <><Clock className="w-2.5 h-2.5" /> {game.game_time || 'TBD'}</>}
          </div>
        </div>

        {game.is_value_pick && (
          <div className="absolute top-2.5 right-2.5 z-10">
            <div className="flex items-center gap-1 bg-emerald-500 text-white px-2 py-1 rounded-full text-[10px] font-bold shadow-sm">
              <TrendingUp className="w-2.5 h-2.5" /> VALUE
            </div>
          </div>
        )}
      </div>

      {/* MASCOTS */}
      <div className="px-3 md:px-4 pt-3 flex gap-2 md:gap-3">
        <MascotBox src={homeMascot} color={homeColor} name={game.home_team_mascot_name || homeShort} />
        <MascotBox src={awayMascot} color={awayColor} name={game.away_team_mascot_name || awayShort} />
      </div>

      {/* PREDICTION BAR */}
      <div className="px-3 md:px-4 pt-4 pb-1">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">AI Prediction</p>
        <div className="h-9 md:h-10 rounded-xl overflow-hidden flex">
          <motion.div initial={{ width:0 }} animate={{ width:`${homePct}%` }} transition={{ duration:1, ease:'easeOut' }} className="flex items-center pl-3 rounded-l-xl relative" style={{ backgroundColor: homeColor }}>
            <span className="text-white text-sm md:text-base font-black relative z-10">{homePct}%</span>
            <div className="absolute inset-0 bar-shine" />
          </motion.div>
          <motion.div initial={{ width:0 }} animate={{ width:`${awayPct}%` }} transition={{ duration:1, ease:'easeOut', delay:0.15 }} className="flex items-center justify-end pr-3 rounded-r-xl" style={{ backgroundColor: awayColor }}>
            <span className="text-white text-sm md:text-base font-black">{awayPct}%</span>
          </motion.div>
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[10px] text-gray-400 font-bold uppercase">{game.home_team_abbr}</span>
          <span className="text-[10px] text-gray-400 font-bold uppercase">{game.away_team_abbr}</span>
        </div>
      </div>

      {/* REASON */}
      {game.reason_text && (
        <div className="px-3 md:px-4 pt-2">
          <p className="text-gray-400 text-xs leading-relaxed">💡 <span className="text-gray-500">{game.reason_text}</span></p>
        </div>
      )}

      {/* BUTTON */}
      <div className="p-3 md:p-4 pt-3">
        <button onClick={() => onOpenDetail?.(game)} className="w-full py-3 bg-gray-50 hover:bg-navy text-gray-500 hover:text-white rounded-xl text-sm font-bold transition-all border border-gray-100 hover:border-navy flex items-center justify-center gap-1 group/btn">
          See Details <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </motion.div>
  )
}

export default GameCard
