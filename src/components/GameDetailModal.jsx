import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, BarChart3, Zap, Trophy, ThumbsUp, Loader2, TrendingUp, Users } from 'lucide-react'

const GameDetailModal = ({ game, isOpen, onClose, onVote }) => {
  const [voting, setVoting] = useState(false)
  const [voted, setVoted] = useState(null)

  if (!game) return null

  const homeColor = game.home_team_color || '#1D428A'
  const awayColor = game.away_team_color || '#333333'
  const homePct = game.home_win_pct || 50
  const awayPct = game.away_win_pct || 50
  const totalVotes = (game.community_votes_home || 0) + (game.community_votes_away || 0)
  const homeVotePct = totalVotes > 0 ? Math.round((game.community_votes_home || 0) / totalVotes * 100) : 50
  const awayVotePct = totalVotes > 0 ? Math.round((game.community_votes_away || 0) / totalVotes * 100) : 50

  const handleVote = async (team) => {
    if (voted || voting) return
    setVoting(true)
    const result = await onVote?.(game.id, team)
    if (result?.success) setVoted(team)
    setVoting(false)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="bg-white rounded-t-3xl md:rounded-2xl w-full md:max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Handle bar (mobile) */}
            <div className="md:hidden flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>

            {/* Close */}
            <button onClick={onClose} className="absolute top-4 right-4 z-20 w-8 h-8 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center transition-colors">
              <X className="w-4 h-4 text-white" />
            </button>

            {/* Team panels + center content */}
            <div className="flex flex-col md:flex-row">
              {/* Home panel */}
              <div className="md:w-56 p-5 md:p-6 flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-3" style={{ backgroundColor: homeColor }}>
                <div className="w-20 h-20 md:w-full md:h-40 rounded-xl overflow-hidden shrink-0" style={{ backgroundColor: `${homeColor}cc` }}>
                  {game.home_team_mascot_image ? (
                    <img src={game.home_team_mascot_image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20 font-black text-lg">
                      {game.home_team_mascot_name || game.home_team_abbr}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-white font-black text-xl md:text-2xl leading-tight">{game.home_team_name}</p>
                  <p className="text-white/60 text-sm font-semibold">{game.home_team_record}</p>
                </div>
              </div>

              {/* Center content */}
              <div className="flex-1 p-5 md:p-6">
                {/* Status */}
                {game.status && game.status !== 'upcoming' && (
                  <div className="flex justify-center mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${game.status === 'live' ? 'bg-red text-white animate-pulse' : 'bg-gray-200 text-gray-600'}`}>
                      {game.status === 'live' ? 'LIVE' : 'FINAL'}
                    </span>
                  </div>
                )}

                {/* AI Prediction label */}
                <div className="flex items-center justify-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4 text-navy" />
                  <span className="text-sm font-bold text-gray-700">Kynetics AI Prediction</span>
                </div>

                {/* Big prediction bar */}
                <div className="h-12 rounded-2xl overflow-hidden flex relative mb-2">
                  <div
                    className="flex items-center justify-start pl-4 relative"
                    style={{ width: `${homePct}%`, backgroundColor: homeColor }}
                  >
                    <span className="text-white text-lg font-black relative z-10">{homePct}%</span>
                    <div className="absolute inset-0 bar-shine" />
                  </div>
                  <div
                    className="flex items-center justify-end pr-4"
                    style={{ width: `${awayPct}%`, backgroundColor: awayColor }}
                  >
                    <span className="text-white text-lg font-black">{awayPct}%</span>
                  </div>
                </div>
                <p className="text-center text-[11px] text-gray-400 flex items-center justify-center gap-1 mb-5">
                  <BarChart3 className="w-3 h-3" />
                  Based on {game.data_points || '10,000+'} data points analyzed
                </p>

                {/* Streak + H2H row */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Current Streak</p>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-base" style={{ color: game.home_streak?.startsWith('W') ? '#16a34a' : '#dc2626' }}>
                        {game.home_team_abbr} {game.home_streak || '—'}
                      </span>
                      <span className="text-gray-300">|</span>
                      <span className="font-black text-base" style={{ color: game.away_streak?.startsWith('W') ? '#16a34a' : '#dc2626' }}>
                        {game.away_team_abbr} {game.away_streak || '—'}
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Head to Head</p>
                    <p className="font-black text-base text-gray-800">{game.head_to_head || 'No data'}</p>
                  </div>
                </div>

                {/* Reason */}
                {game.reason_text && (
                  <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-4 mb-5">
                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1.5">
                      <TrendingUp className="w-3 h-3 inline mr-1" />AI Insight
                    </p>
                    <p className="text-sm text-blue-900 leading-relaxed">{game.reason_text}</p>
                  </div>
                )}

                {/* Vote section */}
                <div>
                  <h3 className="font-bold text-gray-700 mb-3 text-sm text-center">Your Vote</h3>
                  <div className="flex gap-3 mb-4">
                    <button
                      onClick={() => handleVote('home')}
                      disabled={!!voted || voting}
                      className={`flex-1 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 border-2 uppercase tracking-wide ${
                        voted === 'home'
                          ? 'text-white shadow-lg scale-[1.02]'
                          : voted ? 'opacity-30 border-gray-100 text-gray-300' : 'border-gray-200 text-gray-700 hover:shadow-md active:scale-95'
                      }`}
                      style={voted === 'home' ? { backgroundColor: homeColor, borderColor: homeColor } : {}}
                    >
                      {voting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : game.home_team_name?.split(' ').pop()}
                    </button>
                    <button
                      onClick={() => handleVote('away')}
                      disabled={!!voted || voting}
                      className={`flex-1 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 border-2 uppercase tracking-wide ${
                        voted === 'away'
                          ? 'text-white shadow-lg scale-[1.02]'
                          : voted ? 'opacity-30 border-gray-100 text-gray-300' : 'border-gray-200 text-gray-700 hover:shadow-md active:scale-95'
                      }`}
                      style={voted === 'away' ? { backgroundColor: awayColor, borderColor: awayColor } : {}}
                    >
                      {voting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : game.away_team_name?.split(' ').pop()}
                    </button>
                  </div>

                  {/* Community bar */}
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                        <Users className="w-3 h-3" /> Community
                      </span>
                      <span className="text-[11px] text-gray-400 font-semibold">{totalVotes.toLocaleString()} votes</span>
                    </div>
                    <div className="h-3 rounded-full overflow-hidden flex bg-gray-200 mb-2">
                      <div className="rounded-l-full transition-all duration-500" style={{ width: `${homeVotePct}%`, backgroundColor: homeColor }} />
                      <div className="rounded-r-full transition-all duration-500" style={{ width: `${awayVotePct}%`, backgroundColor: awayColor }} />
                    </div>
                    <div className="flex justify-between text-[11px] font-semibold">
                      <span style={{ color: homeColor }}>{homeVotePct}% {game.home_team_abbr}</span>
                      <span style={{ color: awayColor }}>{awayVotePct}% {game.away_team_abbr}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Away panel */}
              <div className="md:w-56 p-5 md:p-6 flex flex-row-reverse md:flex-col items-center md:items-end gap-4 md:gap-3 text-right" style={{ backgroundColor: awayColor }}>
                <div className="w-20 h-20 md:w-full md:h-40 rounded-xl overflow-hidden shrink-0" style={{ backgroundColor: `${awayColor}cc` }}>
                  {game.away_team_mascot_image ? (
                    <img src={game.away_team_mascot_image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20 font-black text-lg">
                      {game.away_team_mascot_name || game.away_team_abbr}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-white font-black text-xl md:text-2xl leading-tight">{game.away_team_name}</p>
                  <p className="text-white/60 text-sm font-semibold">{game.away_team_record}</p>
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
