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

  const Bar = ({ h = 'h-12' }) => (
    <div className={`${h} rounded-2xl overflow-hidden flex`}>
      <div className="flex items-center pl-4 rounded-l-2xl" style={{ width: `${hp}%`, backgroundColor: hc }}>
        <span className="text-white text-lg font-black">{hp}%</span>
      </div>
      <div className="flex items-center justify-end pr-4 rounded-r-2xl" style={{ width: `${ap}%`, backgroundColor: ac }}>
        <span className="text-white text-lg font-black">{ap}%</span>
      </div>
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

  const CommunityBar = () => (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
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
  )

  // Desktop side panel: image fills, text overlays with gradient
  const SidePanel = ({ src, fullName, record, mascotName, side }) => (
    <div className="w-[22%] flex flex-col relative overflow-hidden">
      {/* Image fills entire panel */}
      <img src={src} alt={mascotName} className="absolute inset-0 w-full h-full object-cover"
        onError={e => { e.target.style.display='none' }} />
      {/* Gradient for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-transparent pointer-events-none z-10" />
      {/* Text */}
      <div className={`relative z-20 p-5 pb-3 ${side === 'away' ? 'text-right' : ''}`}>
        <p className="text-white font-black text-2xl lg:text-3xl uppercase leading-tight drop-shadow-lg">{fullName}</p>
        <p className="text-white/60 text-sm font-bold mt-1 drop-shadow-sm">{record}</p>
      </div>
      <div className="flex-1" />
    </div>
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm" onClick={onClose}>

          {/* DESKTOP */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="hidden md:flex fixed inset-y-12 inset-x-16 lg:inset-y-10 lg:inset-x-24 xl:inset-y-12 xl:inset-x-32 bg-white rounded-3xl overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <button onClick={onClose} className="absolute top-4 right-4 z-30 w-10 h-10 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center transition-colors">
              <X className="w-5 h-5 text-white" />
            </button>

            <SidePanel src={hm} fullName={game.home_team_name} record={game.home_team_record} mascotName={game.home_team_mascot_name || hn} side="home" />

            {/* Center */}
            <div className="flex-1 overflow-y-auto px-8 py-6 lg:px-10 lg:py-8">
              {game.game_time && game.status === 'upcoming' && (
                <p className="text-center text-gray-400 text-sm font-semibold mb-3">{game.game_time}</p>
              )}
              {game.status && game.status !== 'upcoming' && (
                <div className="flex justify-center mb-3">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${game.status === 'live' ? 'bg-red text-white animate-pulse' : 'bg-gray-200 text-gray-600'}`}>
                    {game.status === 'live' ? 'LIVE' : 'FINAL'}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-navy" />
                <span className="text-sm font-bold text-gray-800">Kynetics AI Prediction</span>
              </div>

              <Bar h="h-14" />
              <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1 mt-2 mb-6">
                <BarChart3 className="w-3 h-3" /> Based on {game.data_points || '10,000+'} data points analyzed
              </p>

              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Current Streak</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-black text-base" style={{ color: game.home_streak?.startsWith('W') ? '#16a34a' : '#dc2626' }}>
                      {game.home_team_abbr} {game.home_streak || '—'}
                    </span>
                    <span className="text-gray-200 font-bold">|</span>
                    <span className="font-black text-base" style={{ color: game.away_streak?.startsWith('W') ? '#16a34a' : '#dc2626' }}>
                      {game.away_team_abbr} {game.away_streak || '—'}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Head to Head</p>
                  <p className="font-black text-base text-gray-800">{game.head_to_head || 'No data'}</p>
                </div>
              </div>

              {game.reason_text && (
                <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-4 mb-5">
                  <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1.5">
                    <TrendingUp className="w-3 h-3 inline mr-1" /> AI Insight
                  </p>
                  <p className="text-sm text-blue-900 leading-relaxed">{game.reason_text}</p>
                </div>
              )}

              <h3 className="font-bold text-gray-700 mb-3 text-sm text-center">Your Vote</h3>
              <div className="flex gap-3 mb-4">
                <VoteBtn team="home" name={hn} color={hc} />
                <VoteBtn team="away" name={an} color={ac} />
              </div>
              <CommunityBar />
            </div>

            <SidePanel src={am} fullName={game.away_team_name} record={game.away_team_record} mascotName={game.away_team_mascot_name || an} side="away" />
          </motion.div>

          {/* MOBILE */}
          <motion.div
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="md:hidden fixed inset-0 bg-white overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <button onClick={onClose} className="fixed top-3 right-3 z-30 w-9 h-9 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center">
              <X className="w-4 h-4 text-white" />
            </button>

            {/* Mobile: mascots with overlaid names */}
            <div className="flex" style={{ aspectRatio: '16/9' }}>
              {[{ src: hm, name: game.home_team_name, record: game.home_team_record, mn: game.home_team_mascot_name || hn, side: 'home' },
                { src: am, name: game.away_team_name, record: game.away_team_record, mn: game.away_team_mascot_name || an, side: 'away' }].map((t, i) => (
                <div key={i} className="flex-1 relative overflow-hidden">
                  <img src={t.src} alt={t.mn} className="w-full h-full object-cover absolute inset-0"
                    onError={e => { e.target.style.display='none' }} />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent z-10 pointer-events-none" />
                  <div className={`relative z-20 p-3 ${t.side === 'away' ? 'text-right' : ''}`}>
                    <p className="text-white font-black text-lg uppercase leading-tight drop-shadow-md">{t.name}</p>
                    <p className="text-white/60 text-[10px] font-bold drop-shadow-sm">{t.record}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile content */}
            <div className="p-4 pb-10">
              <div className="flex items-center justify-center gap-2 mb-3 mt-2">
                <TrendingUp className="w-4 h-4 text-navy" />
                <span className="text-sm font-bold text-gray-700">Kynetics AI Prediction</span>
              </div>

              <Bar h="h-11" />
              <p className="text-center text-[11px] text-gray-400 flex items-center justify-center gap-1 mt-2 mb-5">
                <BarChart3 className="w-3 h-3" /> {game.data_points || '10,000+'} data points
              </p>

              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Streak</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-black text-sm" style={{ color: game.home_streak?.startsWith('W') ? '#16a34a' : '#dc2626' }}>
                      {game.home_team_abbr} {game.home_streak || '—'}
                    </span>
                    <span className="text-gray-200">|</span>
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

              {game.reason_text && (
                <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-4 mb-5">
                  <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1">
                    <TrendingUp className="w-3 h-3 inline mr-1" /> AI Insight
                  </p>
                  <p className="text-sm text-blue-900 leading-relaxed">{game.reason_text}</p>
                </div>
              )}

              <h3 className="font-bold text-gray-700 mb-3 text-sm text-center">Your Vote</h3>
              <div className="flex gap-3 mb-4">
                <VoteBtn team="home" name={hn} color={hc} />
                <VoteBtn team="away" name={an} color={ac} />
              </div>
              <CommunityBar />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default GameDetailModal
