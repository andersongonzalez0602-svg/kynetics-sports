import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, BarChart3, Zap, Trophy, ThumbsUp, Loader2 } from 'lucide-react'

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
          className="fixed inset-0 z-[90] bg-black/60 flex items-center justify-center p-4 overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-4"
            onClick={e => e.stopPropagation()}
          >
            {/* Header with team colors */}
            <div className="relative h-32 flex">
              <div className="flex-1 flex items-center justify-center" style={{ backgroundColor: homeColor }}>
                {game.home_team_mascot_image ? (
                  <img src={game.home_team_mascot_image} alt="" className="h-24 w-24 object-cover rounded-xl" />
                ) : (
                  <span className="text-5xl text-white/30">🏀</span>
                )}
              </div>
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white w-12 h-12 rounded-full flex items-center justify-center font-black text-gray-400 text-sm shadow-lg z-10">
                VS
              </div>
              <div className="flex-1 flex items-center justify-center" style={{ backgroundColor: awayColor }}>
                {game.away_team_mascot_image ? (
                  <img src={game.away_team_mascot_image} alt="" className="h-24 w-24 object-cover rounded-xl" />
                ) : (
                  <span className="text-5xl text-white/30">🏀</span>
                )}
              </div>
              <button onClick={onClose} className="absolute top-3 right-3 bg-black/30 hover:bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Teams & score */}
            <div className="px-6 py-5">
              <div className="flex items-center justify-between mb-2">
                <div className="text-center flex-1">
                  <p className="font-black text-lg text-gray-900">{game.home_team_name}</p>
                  <p className="text-gray-400 text-sm">{game.home_team_record}</p>
                </div>
                <div className="px-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-black" style={{ color: homeColor }}>{homePct}%</span>
                    <span className="text-gray-300">-</span>
                    <span className="text-3xl font-black" style={{ color: awayColor }}>{awayPct}%</span>
                  </div>
                </div>
                <div className="text-center flex-1">
                  <p className="font-black text-lg text-gray-900">{game.away_team_name}</p>
                  <p className="text-gray-400 text-sm">{game.away_team_record}</p>
                </div>
              </div>

              {/* Prediction bar */}
              <div className="h-4 rounded-full overflow-hidden flex bg-gray-100 mb-2">
                <div className="rounded-l-full transition-all duration-500" style={{ width: `${homePct}%`, backgroundColor: homeColor }} />
                <div className="rounded-r-full transition-all duration-500" style={{ width: `${awayPct}%`, backgroundColor: awayColor }} />
              </div>
              <p className="text-center text-xs text-gray-400 mb-6">
                <BarChart3 className="w-3 h-3 inline mr-1" />
                Based on {game.data_points || '10,000+'} data points analyzed
              </p>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {/* Home streak */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase mb-1 flex items-center gap-1">
                    <Zap className="w-3 h-3" /> {game.home_team_abbr} Streak
                  </p>
                  <p className="text-xl font-black" style={{ color: game.home_streak?.startsWith('W') ? '#16a34a' : '#dc2626' }}>
                    {game.home_streak || 'N/A'}
                  </p>
                </div>
                {/* Away streak */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase mb-1 flex items-center gap-1">
                    <Zap className="w-3 h-3" /> {game.away_team_abbr} Streak
                  </p>
                  <p className="text-xl font-black" style={{ color: game.away_streak?.startsWith('W') ? '#16a34a' : '#dc2626' }}>
                    {game.away_streak || 'N/A'}
                  </p>
                </div>
                {/* Head to head */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 col-span-2">
                  <p className="text-xs font-bold text-gray-400 uppercase mb-1 flex items-center gap-1">
                    <Trophy className="w-3 h-3" /> Head to Head
                  </p>
                  <p className="text-lg font-black text-gray-800">{game.head_to_head || 'No data'}</p>
                </div>
              </div>

              {/* Reason */}
              {game.reason_text && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
                  <p className="text-sm text-blue-900 leading-relaxed">💡 {game.reason_text}</p>
                </div>
              )}

              {/* Community vote */}
              <div className="border border-gray-200 rounded-xl p-5">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <ThumbsUp className="w-4 h-4" /> Your Vote
                </h3>
                
                <div className="flex gap-3 mb-4">
                  <button
                    onClick={() => handleVote('home')}
                    disabled={!!voted || voting}
                    className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all border-2 ${
                      voted === 'home'
                        ? 'text-white shadow-md scale-105'
                        : voted ? 'opacity-40 border-gray-200 text-gray-400' : 'border-gray-200 text-gray-700 hover:border-current hover:shadow-sm'
                    }`}
                    style={voted === 'home' ? { backgroundColor: homeColor, borderColor: homeColor } : {}}
                  >
                    {voting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : game.home_team_abbr}
                  </button>
                  <button
                    onClick={() => handleVote('away')}
                    disabled={!!voted || voting}
                    className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all border-2 ${
                      voted === 'away'
                        ? 'text-white shadow-md scale-105'
                        : voted ? 'opacity-40 border-gray-200 text-gray-400' : 'border-gray-200 text-gray-700 hover:border-current hover:shadow-sm'
                    }`}
                    style={voted === 'away' ? { backgroundColor: awayColor, borderColor: awayColor } : {}}
                  >
                    {voting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : game.away_team_abbr}
                  </button>
                </div>

                {/* Vote results bar */}
                <div className="h-3 rounded-full overflow-hidden flex bg-gray-100 mb-2">
                  <div className="rounded-l-full transition-all duration-500" style={{ width: `${homeVotePct}%`, backgroundColor: homeColor }} />
                  <div className="rounded-r-full transition-all duration-500" style={{ width: `${awayVotePct}%`, backgroundColor: awayColor }} />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{homeVotePct}% ({game.community_votes_home || 0})</span>
                  <span className="text-gray-400">{totalVotes} votes</span>
                  <span>{awayVotePct}% ({game.community_votes_away || 0})</span>
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
