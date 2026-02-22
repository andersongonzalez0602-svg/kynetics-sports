import React, { useRef } from 'react'
import { motion } from 'framer-motion'
import { Clock, TrendingUp, Pencil, Trash2, ChevronRight } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

const GameCard = ({ game, onOpenDetail, onDelete, onMascotUpload }) => {
  const { isAdmin } = useAuth()
  const homeFileRef = useRef(null)
  const awayFileRef = useRef(null)
  const homeColor = game.home_team_color || '#1D428A'
  const awayColor = game.away_team_color || '#333333'
  const homePct = game.home_win_pct || 50
  const awayPct = game.away_win_pct || 50

  const handleMascotFile = (team, e) => {
    const file = e.target.files?.[0]
    if (file && onMascotUpload) onMascotUpload(game.id, team, file)
  }

  const handleDelete = () => {
    if (window.confirm(`Delete ${game.home_team_name} vs ${game.away_team_name}?`)) {
      onDelete?.(game.id)
    }
  }

  const MascotBox = ({ src, color, mascotName, team }) => (
    <div className="relative flex-1 aspect-[4/3] rounded-xl overflow-hidden" style={{ backgroundColor: color }}>
      {src ? (
        <img src={src} alt={mascotName || ''} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-white/30 font-black text-lg md:text-xl rotate-[-10deg]">
            {mascotName || '?'}
          </span>
        </div>
      )}
      {isAdmin && (
        <>
          <input type="file" ref={team === 'home' ? homeFileRef : awayFileRef} className="hidden" accept="image/*" onChange={e => handleMascotFile(team, e)} />
          <button
            onClick={(e) => { e.stopPropagation(); (team === 'home' ? homeFileRef : awayFileRef).current?.click() }}
            className="absolute inset-0 bg-black/0 hover:bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
          >
            <Pencil className="w-5 h-5 text-white" />
          </button>
        </>
      )}
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 relative group"
    >
      {/* Admin trash */}
      {isAdmin && (
        <button
          onClick={handleDelete}
          className="absolute top-3 right-3 z-20 w-8 h-8 bg-white/90 hover:bg-red-50 rounded-full flex items-center justify-center border border-gray-200 hover:border-red-200 transition-colors opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="w-3.5 h-3.5 text-gray-400 hover:text-red" />
        </button>
      )}

      {/* Team header with split colors */}
      <div className="relative flex h-24 md:h-28">
        {/* Home side */}
        <div className="flex-1 relative overflow-hidden" style={{ backgroundColor: homeColor }}>
          <div className="absolute inset-0 flex flex-col justify-center px-3 md:px-4">
            <p className="text-white/70 text-[10px] font-semibold">{game.home_team_record || ''}</p>
            <p className="text-white font-black text-base md:text-xl leading-tight truncate">
              {game.home_team_abbr || 'HOME'}
            </p>
          </div>
        </div>

        {/* VS badge */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-lg">
            <span className="text-[10px] font-black text-gray-400">VS</span>
          </div>
        </div>

        {/* Away side */}
        <div className="flex-1 relative overflow-hidden" style={{ backgroundColor: awayColor }}>
          <div className="absolute inset-0 flex flex-col justify-center items-end px-3 md:px-4">
            <p className="text-white/70 text-[10px] font-semibold">{game.away_team_record || ''}</p>
            <p className="text-white font-black text-base md:text-xl leading-tight truncate">
              {game.away_team_abbr || 'AWAY'}
            </p>
          </div>
        </div>

        {/* Badges overlaid */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
          <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-[10px] font-bold">
            <Clock className="w-3 h-3" />
            {game.game_time || 'TBD'}
          </div>
          {game.status === 'live' && (
            <div className="bg-red text-white px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              LIVE
            </div>
          )}
          {game.status === 'final' && (
            <div className="bg-gray-700 text-white px-2.5 py-1 rounded-full text-[10px] font-bold">FINAL</div>
          )}
        </div>

        {game.is_value_pick && (
          <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1 bg-emerald-500 text-white px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm">
            <TrendingUp className="w-3 h-3" /> VALUE
          </div>
        )}
      </div>

      {/* Mascots row */}
      <div className="px-4 -mt-3 relative z-10">
        <div className="flex gap-3">
          <MascotBox
            src={game.home_team_mascot_image}
            color={homeColor}
            mascotName={game.home_team_mascot_name}
            team="home"
          />
          <MascotBox
            src={game.away_team_mascot_image}
            color={awayColor}
            mascotName={game.away_team_mascot_name}
            team="away"
          />
        </div>
      </div>

      {/* Prediction bar */}
      <div className="px-4 pt-4 pb-1">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">AI Prediction</p>
        <div className="h-8 rounded-xl overflow-hidden flex relative">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${homePct}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="flex items-center justify-start pl-3 rounded-l-xl relative"
            style={{ backgroundColor: homeColor }}
          >
            <span className="text-white text-xs font-black relative z-10">{homePct}%</span>
            <div className="absolute inset-0 bar-shine" />
          </motion.div>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${awayPct}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.15 }}
            className="flex items-center justify-end pr-3 rounded-r-xl"
            style={{ backgroundColor: awayColor }}
          >
            <span className="text-white text-xs font-black">{awayPct}%</span>
          </motion.div>
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[10px] text-gray-400 font-semibold">{game.home_team_abbr}</span>
          <span className="text-[10px] text-gray-400 font-semibold">{game.away_team_abbr}</span>
        </div>
      </div>

      {/* Reason */}
      {game.reason_text && (
        <div className="px-4 pt-2 pb-1">
          <p className="text-gray-400 text-xs leading-relaxed">
            💡 <span className="text-gray-500">{game.reason_text}</span>
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="p-4 pt-3">
        <button
          onClick={() => onOpenDetail?.(game)}
          className="w-full py-3 bg-gray-50 hover:bg-navy text-gray-500 hover:text-white rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-1.5 border border-gray-100 hover:border-navy group/btn"
        >
          See Details
          <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </motion.div>
  )
}

export default GameCard
