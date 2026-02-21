import React, { useRef } from 'react'
import { motion } from 'framer-motion'
import { Clock, TrendingUp, Star, Pencil, Trash2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

const GameCard = ({ game, onOpenDetail, onDelete, onMascotUpload }) => {
  const { isAdmin } = useAuth()
  const homeFileRef = useRef(null)
  const awayFileRef = useRef(null)
  const homeColor = game.home_team_color || '#1D428A'
  const awayColor = game.away_team_color || '#333333'
  const homePct = game.home_win_pct || 50
  const awayPct = game.away_win_pct || 50

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

  const MascotImage = ({ src, color, team }) => (
    <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 shadow-sm" style={{ backgroundColor: color }}>
      {src ? (
        <img src={src} alt="" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-white/40 text-2xl">🏀</div>
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow relative"
    >
      {/* Admin trash */}
      {isAdmin && (
        <button
          onClick={handleDelete}
          className="absolute top-3 right-3 z-10 w-8 h-8 bg-red-50 hover:bg-red-100 rounded-full flex items-center justify-center border border-red-200 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5 text-red" />
        </button>
      )}

      {/* Split color header */}
      <div className="h-2 flex">
        <div className="flex-1" style={{ backgroundColor: homeColor }} />
        <div className="flex-1" style={{ backgroundColor: awayColor }} />
      </div>

      {/* Badges */}
      <div className="px-5 pt-4 flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full text-xs font-semibold">
          <Clock className="w-3 h-3" />
          {game.game_time || 'TBD'}
        </div>
        {game.is_value_pick && (
          <div className="flex items-center gap-1 bg-green-50 text-green-600 px-2.5 py-1 rounded-full text-xs font-bold border border-green-200">
            <TrendingUp className="w-3 h-3" /> VALUE
          </div>
        )}
        {game.is_featured && (
          <div className="flex items-center gap-1 bg-yellow-50 text-yellow-600 px-2.5 py-1 rounded-full text-xs font-bold border border-yellow-200">
            <Star className="w-3 h-3" /> FEATURED
          </div>
        )}
        {badge && (
          <div className={`${badge.bg} text-white px-2.5 py-1 rounded-full text-xs font-bold ${badge.pulse ? 'animate-pulse' : ''}`}>
            {badge.text}
          </div>
        )}
      </div>

      {/* Teams */}
      <div className="px-5 py-4">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-3">
            <MascotImage src={game.home_team_mascot_image} color={homeColor} team="home" />
            <div>
              <p className="font-bold text-gray-900 text-sm">{game.home_team_name || 'Home'}</p>
              <p className="text-gray-400 text-xs">{game.home_team_record}</p>
            </div>
          </div>
          <span className="text-2xl font-black" style={{ color: homeColor }}>{homePct}%</span>
        </div>

        <div className="flex items-center justify-center my-3">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="px-3 text-xs font-bold text-gray-300 uppercase">vs</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MascotImage src={game.away_team_mascot_image} color={awayColor} team="away" />
            <div>
              <p className="font-bold text-gray-900 text-sm">{game.away_team_name || 'Away'}</p>
              <p className="text-gray-400 text-xs">{game.away_team_record}</p>
            </div>
          </div>
          <span className="text-2xl font-black" style={{ color: awayColor }}>{awayPct}%</span>
        </div>
      </div>

      {/* Prediction bar */}
      <div className="px-5 pb-3">
        <div className="h-3 rounded-full overflow-hidden flex bg-gray-100">
          <motion.div initial={{ width: 0 }} animate={{ width: `${homePct}%` }} transition={{ duration: 0.8 }} className="rounded-l-full" style={{ backgroundColor: homeColor }} />
          <motion.div initial={{ width: 0 }} animate={{ width: `${awayPct}%` }} transition={{ duration: 0.8, delay: 0.1 }} className="rounded-r-full" style={{ backgroundColor: awayColor }} />
        </div>
      </div>

      {/* Reason */}
      {game.reason_text && (
        <div className="px-5 pb-4">
          <p className="text-gray-500 text-xs leading-relaxed bg-gray-50 rounded-lg p-3 border border-gray-100">💡 {game.reason_text}</p>
        </div>
      )}

      {/* Footer */}
      <div className="px-5 pb-5">
        <button
          onClick={() => onOpenDetail?.(game)}
          className="w-full py-3 bg-gray-50 hover:bg-navy hover:text-white text-gray-600 rounded-xl text-sm font-bold transition-colors border border-gray-100 hover:border-navy"
        >
          See Details
        </button>
      </div>
    </motion.div>
  )
}

export default GameCard
