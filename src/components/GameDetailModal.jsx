import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, BarChart3, Zap, Trophy, ThumbsUp, Loader2, Clock, TrendingUp } from 'lucide-react'

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

  const MascotDisplay = ({ src, color, abbr }) => (
    <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden mx-auto" style={{ backgroundColor: color }}>
      {src ? (
        <img src={src} alt="" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-white font-black text-sm">{abbr}</div>
      )}
    </div>
  )

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
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="bg-white rounded-t-3xl md:rounded-2xl w-full md:max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Handle bar (mobile) */}
            <div className="md:hidden flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>

            {/* Close button */}
            <div className="flex justify-end px-5 pt-3 md:pt-5">
              <button onClick={onClose} className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Matchup header */}
            <div className="px-6 pb-5">
              {/* Time badge */}
              <div className="flex justify-center mb-5">
                <div className="flex items-center gap-2 bg-gray-100 text-gray-500 px-3 py-1.5 rounded-lg text-xs font-semibold">
                  <Clock className="w-3.5 h-3.5" />
                  {game.game_time || 'TBD'}
                </div>
              </div>

              {/* Teams face off */}
              <div className="flex items-center justify-between gap-4 mb-6">
                {/* Home */}
                <div className="flex-1 text-center">
                  <MascotDisplay src={game.home_team_mascot_image} color={homeColor} abbr={game.home_team_abbr} />
                  <p className="font-bold text-gray-900 text-sm mt-3">{game.home_team_name}</p>
                  <p className="text-gray-400 text-xs">{game.home_team_record}</p>
                  <p className="text-3xl font-black mt-2" style={{ color: homeColor }}>{homePct}%</p>
                </div>

                {/* VS */}
                <div className="flex flex-col items-center gap-1 shrink-0 py-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-black text-gray-400">VS</span>
                  </div>
                </div>

                {/* Away */}
                <div className="flex-1 text-center">
                  <MascotDisplay src={game.away_team_mascot_image} color={awayColor} abbr={game.away_team_abbr} />
                  <p className="font-bold text-gray-900 text-sm mt-3">{game.away_team_name}</p>
                  <p className="text-gray-400 text-xs">{game.away_team_record}</p>
                  <p className="text-3xl font-black mt-2" style={{ color: awayColor }}>{awayPct}%</p>
                </div>
              </div>

              {/* Prediction bar */}
              <div className="mb-1">
                <div className="h-3 rounded-full overflow-hidden flex bg-gray-100">
                  <div className="rounded-l-full transition-all duration-700 relative" style={{ width: `${homePct}%`, backgroundColor: homeColor }}>
                    <div className="absolute inset-0 bar-shine" />
                  </div>
                  <div className="rounded-r-full transition-all duration-700" style={{ width: `${awayPct}%`, backgroundColor: awayColor }} />
                </div>
              </div>
              <p className="text-center text-[11px] text-gray-400 flex items-center justify-center gap-1 mt-2">
                <BarChart3 className="w-3 h-3" />
                {game.data_points || '10,000+'} data points analyzed
              </p>
            </div>

            {/* Divider */}
            <div className="h-2 bg-gray-50" />

            {/* Stats */}
            <div className="px-6 py-5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Zap className="w-3 h-3" /> {game.home_team_abbr} Streak
                  </p>
                  <p className="text-xl font-black" style={{ color: game.home_streak?.startsWith('W') ? '#16a34a' : game.home_streak?.startsWith('L') ? '#dc2626' : '#6b7280' }}>
                    {game.home_streak || 'N/A'}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Zap className="w-3 h-3" /> {game.away_team_abbr} Streak
                  </p>
                  <p className="text-xl font-black" style={{ color: game.away_streak?.startsWith('W') ? '#16a34a' : game.away_streak?.startsWith('L') ? '#dc2626' : '#6b7280' }}>
                    {game.away_streak || 'N/A'}
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Trophy className="w-3 h-3" /> Head to Head (this season)
                </p>
                <p className="text-lg font-black text-gray-800">{game.head_to_head || 'No previous matchups'}</p>
              </div>
            </div>

            {/* Reason */}
            {game.reason_text && (
              <div className="px-6 pb-5">
                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4">
                  <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> AI Insight
                  </p>
                  <p className="text-sm text-blue-900 leading-relaxed">{game.reason_text}</p>
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="h-2 bg-gray-50" />

            {/* Community vote */}
            <div className="px-6 py-5 pb-8">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-sm">
                <ThumbsUp className="w-4 h-4 text-gray-400" /> Community Vote
              </h3>

              <div className="flex gap-3 mb-4">
                <button
                  onClick={() => handleVote('home')}
                  disabled={!!voted || voting}
                  className={`flex-1 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 border-2 ${
                    voted === 'home'
                      ? 'text-white shadow-lg scale-[1.02]'
                      : voted ? 'opacity-30 border-gray-100 text-gray-300' : 'border-gray-200 text-gray-700 hover:shadow-md active:scale-95'
                  }`}
                  style={voted === 'home' ? { backgroundColor: homeColor, borderColor: homeColor } : voted ? {} : { borderColor: homeColor + '40' }}
                >
                  {voting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : game.home_team_abbr}
                </button>
                <button
                  onClick={() => handleVote('away')}
                  disabled={!!voted || voting}
                  className={`flex-1 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 border-2 ${
                    voted === 'away'
                      ? 'text-white shadow-lg scale-[1.02]'
                      : voted ? 'opacity-30 border-gray-100 text-gray-300' : 'border-gray-200 text-gray-700 hover:shadow-md active:scale-95'
                  }`}
                  style={voted === 'away' ? { backgroundColor: awayColor, borderColor: awayColor } : voted ? {} : { borderColor: awayColor + '40' }}
                >
                  {voting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : game.away_team_abbr}
                </button>
              </div>

              {/* Vote results */}
              <div className="h-2 rounded-full overflow-hidden flex bg-gray-100 mb-2">
                <div className="rounded-l-full transition-all duration-500" style={{ width: `${homeVotePct}%`, backgroundColor: homeColor }} />
                <div className="rounded-r-full transition-all duration-500" style={{ width: `${awayVotePct}%`, backgroundColor: awayColor }} />
              </div>
              <div className="flex justify-between text-[11px] text-gray-400">
                <span style={{ color: homeColor }}>{homeVotePct}% ({game.community_votes_home || 0})</span>
                <span>{totalVotes} total votes</span>
                <span style={{ color: awayColor }}>{awayVotePct}% ({game.community_votes_away || 0})</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default GameDetailModal
