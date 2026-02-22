import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, BarChart3, TrendingUp, Users, Loader2 } from 'lucide-react'
import { getMascotUrl } from '@/lib/mascots'

const GameDetailModal = ({ game, isOpen, onClose, onVote }) => {
  const [voting, setVoting] = useState(false)
  const [voted, setVoted] = useState(null)

  if (!game) return null

  const hc = game.home_team_color || '#1D428A'
  const ac = game.away_team_color || '#333333'
  const hp = game.home_win_pct || 50
  const ap = game.away_win_pct || 50
  const tv = (game.community_votes_home || 0) + (game.community_votes_away || 0)
  const hvp = tv > 0 ? Math.round((game.community_votes_home || 0) / tv * 100) : 50
  const avp = tv > 0 ? Math.round((game.community_votes_away || 0) / tv * 100) : 50
  const hm = game.home_team_mascot_image || getMascotUrl(game.home_team_abbr)
  const am = game.away_team_mascot_image || getMascotUrl(game.away_team_abbr)
  const hn = game.home_team_name?.split(' ').pop() || game.home_team_abbr
  const an = game.away_team_name?.split(' ').pop() || game.away_team_abbr

  const handleVote = async (team) => {
    if (voted || voting) return
    setVoting(true)
    const r = await onVote?.(game.id, team)
    if (r?.success) setVoted(team)
    setVoting(false)
  }

  const MascotImg = ({ src, name, color }) => (
    <div className="w-full h-full relative" style={{ backgroundColor: color }}>
      <img src={src} alt={name} className="w-full h-full object-cover"
        onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }} />
      <div className="w-full h-full items-center justify-center absolute inset-0 hidden">
        <span className="text-white/10 font-black text-3xl italic">{name}</span>
      </div>
    </div>
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          {/* ===== DESKTOP LAYOUT ===== */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="hidden md:flex fixed inset-4 lg:inset-8 bg-white rounded-3xl overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Close */}
            <button onClick={onClose} className="absolute top-4 right-4 z-30 w-10 h-10 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center transition-colors">
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Home panel */}
            <div className="w-1/4 flex flex-col" style={{ backgroundColor: hc }}>
              <div className="p-6 pb-4">
                <p className="text-white font-black text-3xl lg:text-4xl uppercase leading-tight">{game.home_team_name}</p>
                <p className="text-white/50 text-sm font-bold mt-1">{game.home_team_record}</p>
              </div>
              <div className="flex-1 relative overflow-hidden">
                <MascotImg src={hm} name={game.home_team_mascot_name || hn} color={hc} />
              </div>
            </div>

            {/* Center */}
            <div className="flex-1 overflow-y-auto p-8 lg:p-10 flex flex-col justify-center">
              {/* Status */}
              {game.status && game.status !== 'upcoming' && (
                <div className="flex justify-center mb-4">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${game.status === 'live' ? 'bg-red text-white animate-pulse' : 'bg-gray-200 text-gray-600'}`}>
                    {game.status === 'live' ? 'LIVE' : 'FINAL'}
                  </span>
                </div>
              )}

              {/* Time */}
              {game.game_time && game.status === 'upcoming' && (
                <p className="text-center text-gray-400 text-sm font-semibold mb-4">{game.game_time}</p>
              )}

              <div className="flex items-center justify-center gap-2 mb-5">
                <TrendingUp className="w-5 h-5 text-navy" />
                <span className="text-base font-bold text-gray-800">Kynetics AI Prediction</span>
              </div>

              {/* Big bar */}
              <div className="h-14 lg:h-16 rounded-2xl overflow-hidden flex mb-2">
                <div className="flex items-center pl-5 relative" style={{ width: `${hp}%`, backgroundColor: hc }}>
                  <span className="text-white text-xl lg:text-2xl font-black relative z-10">{hp}%</span>
                  <div className="absolute inset-0 bar-shine" />
                </div>
                <div className="flex items-center justify-end pr-5" style={{ width: `${ap}%`, backgroundColor: ac }}>
                  <span className="text-white text-xl lg:text-2xl font-black">{ap}%</span>
                </div>
              </div>
              <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1.5 mb-8">
                <BarChart3 className="w-3.5 h-3.5" /> Based on {game.data_points || '10,000+'} data points analyzed
              </p>

              {/* Streak + H2H */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Current Streak</p>
                  <div className="flex items-center gap-3">
                    <span className="font-black text-lg" style={{ color: game.home_streak?.startsWith('W') ? '#16a34a' : '#dc2626' }}>
                      {game.home_team_abbr} {game.home_streak || '—'}
                    </span>
                    <span className="text-gray-200 text-lg">|</span>
                    <span className="font-black text-lg" style={{ color: game.away_streak?.startsWith('W') ? '#16a34a' : '#dc2626' }}>
                      {game.away_team_abbr} {game.away_streak || '—'}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Head to Head</p>
                  <p className="font-black text-lg text-gray-800">{game.head_to_head || 'No data'}</p>
                </div>
              </div>

              {/* Reason */}
              {game.reason_text && (
                <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-5 mb-6">
                  <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2">
                    <TrendingUp className="w-3 h-3 inline mr-1" /> AI Insight
                  </p>
                  <p className="text-sm text-blue-900 leading-relaxed">{game.reason_text}</p>
                </div>
              )}

              {/* Vote */}
              <h3 className="font-bold text-gray-700 mb-3 text-sm text-center">Your Vote</h3>
              <div className="flex gap-3 mb-5">
                {[{ team: 'home', name: hn, color: hc }, { team: 'away', name: an, color: ac }].map(v => (
                  <button key={v.team} onClick={() => handleVote(v.team)} disabled={!!voted || voting}
                    className={`flex-1 py-4 rounded-xl font-bold text-sm transition-all border-2 uppercase tracking-wide ${
                      voted === v.team ? 'text-white shadow-lg scale-[1.02]' :
                      voted ? 'opacity-25 border-gray-100 text-gray-300' :
                      'border-gray-200 text-gray-700 hover:shadow-md active:scale-95'
                    }`}
                    style={voted === v.team ? { backgroundColor: v.color, borderColor: v.color } : {}}>
                    {voting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : v.name}
                  </button>
                ))}
              </div>

              {/* Community */}
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" /> Community
                  </span>
                  <span className="text-xs text-gray-400 font-semibold">{tv.toLocaleString()} votes</span>
                </div>
                <div className="h-4 rounded-full overflow-hidden flex bg-gray-200 mb-2">
                  <div className="rounded-l-full transition-all duration-500" style={{ width: `${hvp}%`, backgroundColor: hc }} />
                  <div className="rounded-r-full transition-all duration-500" style={{ width: `${avp}%`, backgroundColor: ac }} />
                </div>
                <div className="flex justify-between text-xs font-bold">
                  <span style={{ color: hc }}>{hvp}% {game.home_team_abbr}</span>
                  <span style={{ color: ac }}>{avp}% {game.away_team_abbr}</span>
                </div>
              </div>
            </div>

            {/* Away panel */}
            <div className="w-1/4 flex flex-col" style={{ backgroundColor: ac }}>
              <div className="p-6 pb-4 text-right">
                <p className="text-white font-black text-3xl lg:text-4xl uppercase leading-tight">{game.away_team_name}</p>
                <p className="text-white/50 text-sm font-bold mt-1">{game.away_team_record}</p>
              </div>
              <div className="flex-1 relative overflow-hidden">
                <MascotImg src={am} name={game.away_team_mascot_name || an} color={ac} />
              </div>
            </div>
          </motion.div>

          {/* ===== MOBILE LAYOUT ===== */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="md:hidden fixed inset-0 bg-white overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Close */}
            <button onClick={onClose} className="fixed top-4 right-4 z-30 w-10 h-10 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center">
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Mobile team header */}
            <div className="flex" style={{ minHeight: '100px' }}>
              <div className="flex-1 p-4 flex flex-col justify-center" style={{ backgroundColor: hc }}>
                <p className="text-white font-black text-2xl uppercase leading-tight">{game.home_team_name}</p>
                <p className="text-white/50 text-xs font-bold">{game.home_team_record}</p>
              </div>
              <div className="flex-1 p-4 flex flex-col justify-center items-end" style={{ backgroundColor: ac }}>
                <p className="text-white font-black text-2xl uppercase leading-tight text-right">{game.away_team_name}</p>
                <p className="text-white/50 text-xs font-bold">{game.away_team_record}</p>
              </div>
            </div>

            {/* Mobile mascots row */}
            <div className="flex gap-2 px-3 pt-3">
              <div className="flex-1 aspect-square rounded-xl overflow-hidden" style={{ backgroundColor: hc }}>
                <MascotImg src={hm} name={game.home_team_mascot_name || hn} color={hc} />
              </div>
              <div className="flex-1 aspect-square rounded-xl overflow-hidden" style={{ backgroundColor: ac }}>
                <MascotImg src={am} name={game.away_team_mascot_name || an} color={ac} />
              </div>
            </div>

            {/* Mobile content */}
            <div className="p-5 pb-10">
              {game.status && game.status !== 'upcoming' && (
                <div className="flex justify-center mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${game.status === 'live' ? 'bg-red text-white animate-pulse' : 'bg-gray-200 text-gray-600'}`}>
                    {game.status === 'live' ? 'LIVE' : 'FINAL'}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-navy" />
                <span className="text-sm font-bold text-gray-700">Kynetics AI Prediction</span>
              </div>

              {/* Bar */}
              <div className="h-12 rounded-2xl overflow-hidden flex mb-2">
                <div className="flex items-center pl-4 relative" style={{ width: `${hp}%`, backgroundColor: hc }}>
                  <span className="text-white text-lg font-black relative z-10">{hp}%</span>
                  <div className="absolute inset-0 bar-shine" />
                </div>
                <div className="flex items-center justify-end pr-4" style={{ width: `${ap}%`, backgroundColor: ac }}>
                  <span className="text-white text-lg font-black">{ap}%</span>
                </div>
              </div>
              <p className="text-center text-[11px] text-gray-400 flex items-center justify-center gap-1 mb-6">
                <BarChart3 className="w-3 h-3" /> Based on {game.data_points || '10,000+'} data points
              </p>

              {/* Streak + H2H */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Streak</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-black text-sm" style={{ color: game.home_streak?.startsWith('W') ? '#16a34a' : '#dc2626' }}>
                      {game.home_team_abbr} {game.home_streak || '—'}
                    </span>
                    <span className="text-gray-300">|</span>
                    <span className="font-black text-sm" style={{ color: game.away_streak?.startsWith('W') ? '#16a34a' : '#dc2626' }}>
                      {game.away_team_abbr} {game.away_streak || '—'}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">H2H</p>
                  <p className="font-black text-sm text-gray-800">{game.head_to_head || 'No data'}</p>
                </div>
              </div>

              {/* Reason */}
              {game.reason_text && (
                <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-4 mb-5">
                  <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1">
                    <TrendingUp className="w-3 h-3 inline mr-1" /> AI Insight
                  </p>
                  <p className="text-sm text-blue-900 leading-relaxed">{game.reason_text}</p>
                </div>
              )}

              {/* Vote */}
              <h3 className="font-bold text-gray-700 mb-3 text-sm text-center">Your Vote</h3>
              <div className="flex gap-3 mb-4">
                {[{ team: 'home', name: hn, color: hc }, { team: 'away', name: an, color: ac }].map(v => (
                  <button key={v.team} onClick={() => handleVote(v.team)} disabled={!!voted || voting}
                    className={`flex-1 py-4 rounded-xl font-bold text-sm transition-all border-2 uppercase tracking-wide ${
                      voted === v.team ? 'text-white shadow-lg scale-[1.02]' :
                      voted ? 'opacity-25 border-gray-100 text-gray-300' :
                      'border-gray-200 text-gray-700 hover:shadow-md active:scale-95'
                    }`}
                    style={voted === v.team ? { backgroundColor: v.color, borderColor: v.color } : {}}>
                    {voting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : v.name}
                  </button>
                ))}
              </div>

              {/* Community */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <Users className="w-3 h-3" /> Community
                  </span>
                  <span className="text-[11px] text-gray-400 font-semibold">{tv.toLocaleString()} votes</span>
                </div>
                <div className="h-3 rounded-full overflow-hidden flex bg-gray-200 mb-2">
                  <div className="rounded-l-full transition-all duration-500" style={{ width: `${hvp}%`, backgroundColor: hc }} />
                  <div className="rounded-r-full transition-all duration-500" style={{ width: `${avp}%`, backgroundColor: ac }} />
                </div>
                <div className="flex justify-between text-[11px] font-bold">
                  <span style={{ color: hc }}>{hvp}% {game.home_team_abbr}</span>
                  <span style={{ color: ac }}>{avp}% {game.away_team_abbr}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default GameDetailModal
