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
      <img src={src} alt={name} className="w-full h-full object-cover drop-shadow-[0_4px_24px_rgba(0,0,0,0.3)]"
        onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }} />
      <div className="w-full h-full items-center justify-center absolute inset-0 hidden">
        <span className="text-white/10 font-black text-3xl italic">{name}</span>
      </div>
      <div className="absolute inset-0 shadow-[inset_0_-30px_40px_-10px_rgba(0,0,0,0.25)] pointer-events-none" />
    </div>
  )

  const VoteBtn = ({ team, name, color }) => (
    <button onClick={() => handleVote(team)} disabled={!!voted || voting}
      className={`flex-1 py-3.5 rounded-xl font-bold text-sm transition-all border-2 uppercase tracking-wide ${
        voted === team ? 'text-white shadow-lg scale-[1.02]' :
        voted ? 'opacity-25 border-gray-100 text-gray-300' :
        'border-gray-200 text-gray-700 hover:shadow-md active:scale-95'
      }`}
      style={voted === team ? { backgroundColor: color, borderColor: color } : {}}>
      {voting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : name}
    </button>
  )

  const PredictionBar = ({ height = 'h-12' }) => (
    <div className={`${height} rounded-2xl overflow-hidden flex shadow-md`}>
      <div className="flex items-center pl-4 relative" style={{ width: `${hp}%`, background: `linear-gradient(135deg, ${hc}, ${hc}cc)` }}>
        <span className="text-white text-lg font-black relative z-10 drop-shadow-sm">{hp}%</span>
        <div className="absolute inset-0 bar-shine" />
      </div>
      <div className="flex items-center justify-end pr-4" style={{ width: `${ap}%`, background: `linear-gradient(135deg, ${ac}cc, ${ac})` }}>
        <span className="text-white text-lg font-black drop-shadow-sm">{ap}%</span>
      </div>
    </div>
  )

  const StatsAndVote = ({ mobile = false }) => (
    <>
      {/* Streak + H2H */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Current Streak</p>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-black text-sm" style={{ color: game.home_streak?.startsWith('W') ? '#16a34a' : '#dc2626' }}>
              {game.home_team_abbr} {game.home_streak || '—'}
            </span>
            <span className="text-gray-200 font-bold">|</span>
            <span className="font-black text-sm" style={{ color: game.away_streak?.startsWith('W') ? '#16a34a' : '#dc2626' }}>
              {game.away_team_abbr} {game.away_streak || '—'}
            </span>
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Head to Head</p>
          <p className="font-black text-sm text-gray-800">{game.head_to_head || 'No data'}</p>
        </div>
      </div>

      {/* Reason */}
      {game.reason_text && (
        <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-4 mb-5">
          <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1.5">
            <TrendingUp className="w-3 h-3 inline mr-1" /> AI Insight
          </p>
          <p className="text-sm text-blue-900 leading-relaxed">{game.reason_text}</p>
        </div>
      )}

      {/* Vote */}
      <h3 className="font-bold text-gray-700 mb-3 text-sm text-center">Your Vote</h3>
      <div className="flex gap-3 mb-4">
        <VoteBtn team="home" name={hn} color={hc} />
        <VoteBtn team="away" name={an} color={ac} />
      </div>

      {/* Community */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
            <Users className="w-3 h-3" /> Community
          </span>
          <span className="text-[11px] text-gray-400 font-semibold">{tv.toLocaleString()} votes</span>
        </div>
        <div className="h-3 rounded-full overflow-hidden flex bg-gray-200 mb-2">
          <div className="rounded-l-full transition-all duration-500" style={{ width: `${hvp}%`, background: `linear-gradient(90deg, ${hc}, ${hc}cc)` }} />
          <div className="rounded-r-full transition-all duration-500" style={{ width: `${avp}%`, background: `linear-gradient(90deg, ${ac}cc, ${ac})` }} />
        </div>
        <div className="flex justify-between text-[11px] font-bold">
          <span style={{ color: hc }}>{hvp}% {game.home_team_abbr}</span>
          <span style={{ color: ac }}>{avp}% {game.away_team_abbr}</span>
        </div>
      </div>
    </>
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          {/* ===== DESKTOP ===== */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="hidden md:flex fixed inset-y-12 inset-x-16 lg:inset-y-10 lg:inset-x-24 xl:inset-y-12 xl:inset-x-32 bg-white rounded-3xl overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Close */}
            <button onClick={onClose} className="absolute top-4 right-4 z-30 w-10 h-10 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center transition-colors">
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Home panel */}
            <div className="w-[22%] flex flex-col" style={{ backgroundColor: hc }}>
              <div className="p-5 pb-3">
                <p className="text-white font-black text-2xl lg:text-3xl uppercase leading-tight">{game.home_team_name}</p>
                <p className="text-white/50 text-sm font-bold mt-1">{game.home_team_record}</p>
              </div>
              <div className="flex-1 relative overflow-hidden">
                <MascotImg src={hm} name={game.home_team_mascot_name || hn} color={hc} />
              </div>
            </div>

            {/* Center */}
            <div className="flex-1 overflow-y-auto px-8 py-6 lg:px-10 lg:py-8">
              {/* Status */}
              {game.status && game.status !== 'upcoming' && (
                <div className="flex justify-center mb-3">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${game.status === 'live' ? 'bg-red text-white animate-pulse' : 'bg-gray-200 text-gray-600'}`}>
                    {game.status === 'live' ? 'LIVE' : 'FINAL'}
                  </span>
                </div>
              )}
              {game.game_time && game.status === 'upcoming' && (
                <p className="text-center text-gray-400 text-sm font-semibold mb-3">{game.game_time}</p>
              )}

              <div className="flex items-center justify-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-navy" />
                <span className="text-sm font-bold text-gray-800">Kynetics AI Prediction</span>
              </div>

              <PredictionBar height="h-14" />
              <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1 mt-2 mb-6">
                <BarChart3 className="w-3 h-3" /> Based on {game.data_points || '10,000+'} data points analyzed
              </p>

              <StatsAndVote />
            </div>

            {/* Away panel */}
            <div className="w-[22%] flex flex-col" style={{ backgroundColor: ac }}>
              <div className="p-5 pb-3 text-right">
                <p className="text-white font-black text-2xl lg:text-3xl uppercase leading-tight">{game.away_team_name}</p>
                <p className="text-white/50 text-sm font-bold mt-1">{game.away_team_record}</p>
              </div>
              <div className="flex-1 relative overflow-hidden">
                <MascotImg src={am} name={game.away_team_mascot_name || an} color={ac} />
              </div>
            </div>
          </motion.div>

          {/* ===== MOBILE ===== */}
          <motion.div
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="md:hidden fixed inset-0 top-0 bg-white overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Close */}
            <button onClick={onClose} className="fixed top-3 right-3 z-30 w-9 h-9 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center">
              <X className="w-4 h-4 text-white" />
            </button>

            {/* Mobile team header */}
            <div className="flex" style={{ minHeight: '80px' }}>
              <div className="flex-1 p-3 flex flex-col justify-center" style={{ backgroundColor: hc }}>
                <p className="text-white font-black text-lg uppercase leading-tight">{game.home_team_name}</p>
                <p className="text-white/50 text-[10px] font-bold">{game.home_team_record}</p>
              </div>
              <div className="flex-1 p-3 flex flex-col justify-center items-end" style={{ backgroundColor: ac }}>
                <p className="text-white font-black text-lg uppercase leading-tight text-right">{game.away_team_name}</p>
                <p className="text-white/50 text-[10px] font-bold">{game.away_team_record}</p>
              </div>
            </div>

            {/* Mobile mascots - no gap, touching */}
            <div className="flex">
              <div className="flex-1 aspect-square relative overflow-hidden" style={{ backgroundColor: hc }}>
                <MascotImg src={hm} name={game.home_team_mascot_name || hn} color={hc} />
              </div>
              <div className="flex-1 aspect-square relative overflow-hidden" style={{ backgroundColor: ac }}>
                <MascotImg src={am} name={game.away_team_mascot_name || an} color={ac} />
              </div>
            </div>

            {/* Mobile content */}
            <div className="p-4 pb-10">
              <div className="flex items-center justify-center gap-2 mb-3 mt-2">
                <TrendingUp className="w-4 h-4 text-navy" />
                <span className="text-sm font-bold text-gray-700">Kynetics AI Prediction</span>
              </div>

              <PredictionBar height="h-11" />
              <p className="text-center text-[11px] text-gray-400 flex items-center justify-center gap-1 mt-2 mb-5">
                <BarChart3 className="w-3 h-3" /> {game.data_points || '10,000+'} data points
              </p>

              <StatsAndVote mobile />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default GameDetailModal
