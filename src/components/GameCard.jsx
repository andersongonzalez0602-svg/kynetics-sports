import React, { useRef } from 'react'
import { motion } from 'framer-motion'
import { Clock, TrendingUp, Star, Pencil, Trash2, ChevronRight } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

const GameCard = ({ game, onOpenDetail, onDelete, onMascotUpload }) => {
  const { isAdmin } = useAuth()
  const homeFileRef = useRef(null)
  const awayFileRef = useRef(null)
  const homeColor = game.home_team_color || '#1D428A'
  const awayColor = game.away_team_color || '#333333'
  const homePct = game.home_win_pct || 50
  const awayPct = game.away_win_pct || 50
  const winner = homePct >= awayPct ? 'home' : 'away'

  const statusBadge = () => {
    if (game.status === 'live') return { text: 'LIVE', bg: 'bg-red', pulse: true }
    if (game.status === 'final') return { text: 'FINAL', bg: 'bg-gray-600', pulse: false }
    return null
  }
  const badge = statusBadge()

  const handleMascotFile = (team, e) => {
    const file = e.target.files?.[0]
    if (file && onMascotUpload) onMascotUpload(game.id, team, file)
  }

  const handleDelete = () => {
    if (window.confirm(`Delete ${game.home_team_name} vs ${game.away_team_name}?`)) {
      onDelete?.(game.id)
    }
  }

  const MascotImage = ({ src, color, abbr, team }) => (
    <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-2xl overflow-hidden shrink-0" style={{ backgroundColor: color }}>
      {src ? (
        <img src={src} alt="" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-white font-black text-xs tracking-tight">
          {abbr || '???'}
        </div>
      )}
      {isAdmin && (
        <>
          <input type="file" ref={team === 'home' ? homeFileRef : awayFileRef} className="hidden" accept="image/*" onChange={e => handleMascotFile(team, e)} />
          <button
            onClick={() => (team === 'home' ? homeFileRef : awayFileRef).current?.click()}
            className="absolute inset-0 bg-black/0 hover:bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
          >
            <Pencil className="w-4 h-4 text-white" />
          </button>
        </>
      )}
    </div>
  )

  const TeamRow = ({ name, record, abbr, pct, color, mascotSrc, team, isWinner }) => (
    <div className="flex items-center gap-3">
      <MascotImage src={mascotSrc} color={color} abbr={abbr} team={team} />
      <div className="flex-1 min-w-0">
        <p className="font-bold text-gray-900 text-sm truncate">{name || 'TBD'}</p>
        <p className="text-gray-400 text-xs">{record}</p>
      </div>
      <div className="text-right">
        <span className={`text-2xl md:text-3xl font-black ${isWinner ? '' : 'opacity-50'}`} style={{ color }}>
          {pct}%
        </span>
      </div>
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all duration-300 relative group"
    >
      {/* Admin trash */}
      {isAdmin && (
        <button
          onClick={handleDelete}
          className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/90 hover:bg-red-50 rounded-full flex items-center justify-center border border-gray-200 hover:border-red-200 transition-colors opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="w-3.5 h-3.5 text-gray-400 hover:text-red" />
        </button>
      )}

      {/* Color accent line */}
      <div className="h-1.5 flex">
        <div className="flex-1 transition-all" style={{ backgroundColor: homeColor }} />
        <div className="w-px bg-white" />
        <div className="flex-1 transition-all" style={{ backgroundColor: awayColor }} />
      </div>

      {/* Badges */}
      <div className="px-5 pt-4 flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 bg-gray-50 text-gray-500 px-3 py-1.5 rounded-lg text-xs font-semibold">
          <Clock className="w-3.5 h-3.5" />
          {game.game_time || 'TBD'}
        </div>
        {game.is_value_pick && (
          <div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg text-xs font-bold">
            <TrendingUp className="w-3.5 h-3.5" /> VALUE PICK
          </div>
        )}
        {game.is_featured && (
          <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-3 py-1.5 rounded-lg text-xs font-bold">
            <Star className="w-3.5 h-3.5" /> FEATURED
          </div>
        )}
        {badge && (
          <div className={`${badge.bg} text-white px-3 py-1.5 rounded-lg text-xs font-bold ${badge.pulse ? 'animate-pulse' : ''}`}>
            {badge.text}
          </div>
        )}
      </div>

      {/* Teams */}
      <div className="px-5 py-5 space-y-4">
        <TeamRow
          name={game.home_team_name} record={game.home_team_record}
          abbr={game.home_team_abbr} pct={homePct} color={homeColor}
          mascotSrc={game.home_team_mascot_image} team="home"
          isWinner={winner === 'home'}
        />

        <div className="flex items-center gap-3 px-2">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-[10px] font-black text-gray-300 tracking-widest">VS</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        <TeamRow
          name={game.away_team_name} record={game.away_team_record}
          abbr={game.away_team_abbr} pct={awayPct} color={awayColor}
          mascotSrc={game.away_team_mascot_image} team="away"
          isWinner={winner === 'away'}
        />
      </div>

      {/* Prediction bar */}
      <div className="px-5 pb-2">
        <div className="h-2.5 rounded-full overflow-hidden flex bg-gray-100 relative">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${homePct}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="rounded-l-full relative"
            style={{ backgroundColor: homeColor }}
          >
            <div className="absolute inset-0 bar-shine" />
          </motion.div>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${awayPct}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.15 }}
            className="rounded-r-full"
            style={{ backgroundColor: awayColor }}
          />
        </div>
      </div>

      {/* Reason */}
      {game.reason_text && (
        <div className="px-5 pt-2 pb-1">
          <p className="text-gray-400 text-xs leading-relaxed">
            💡 <span className="text-gray-500">{game.reason_text}</span>
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="p-5 pt-4">
        <button
          onClick={() => onOpenDetail?.(game)}
          className="w-full py-3 bg-navy/5 hover:bg-navy text-navy hover:text-white rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-1.5 group/btn"
        >
          See Details
          <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </motion.div>
  )
}

export default GameCard
