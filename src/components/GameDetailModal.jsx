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
  const tv = (game.community_votes_home||0) + (game.community_votes_away||0)
  const hvp = tv > 0 ? Math.round((game.community_votes_home||0)/tv*100) : 50
  const avp = tv > 0 ? Math.round((game.community_votes_away||0)/tv*100) : 50
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

  const TeamPanel = ({ color, name, fullName, record, mascotSrc, mascotName, side }) => (
    <div className={`hidden md:flex md:w-52 lg:w-64 flex-col p-5 ${side === 'away' ? 'items-end text-right' : 'items-start'}`} style={{ backgroundColor: color }}>
      <p className="text-white font-black text-2xl lg:text-3xl leading-tight uppercase">{fullName}</p>
      <p className="text-white/60 text-sm font-semibold mb-3">{record}</p>
      <div className="w-full aspect-square rounded-xl overflow-hidden relative" style={{ backgroundColor: `${color}cc` }}>
        <img src={mascotSrc} alt={mascotName} className="w-full h-full object-cover" onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex' }} />
        <div className="w-full h-full items-center justify-center absolute inset-0 hidden">
          <span className="text-white/15 font-black text-2xl italic">{mascotName}</span>
        </div>
      </div>
    </div>
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center" onClick={onClose}>
          <motion.div
            initial={{ y:'100%' }} animate={{ y:0 }} exit={{ y:'100%' }}
            transition={{ type:'spring', damping:30, stiffness:300 }}
            className="bg-white rounded-t-3xl md:rounded-2xl w-full md:max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Mobile handle */}
            <div className="md:hidden flex justify-center pt-3 pb-1"><div className="w-10 h-1 bg-gray-300 rounded-full" /></div>

            {/* Close */}
            <button onClick={onClose} className="absolute top-3 right-3 md:top-4 md:right-4 z-20 w-8 h-8 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center transition-colors">
              <X className="w-4 h-4 text-white" />
            </button>

            <div className="flex flex-col md:flex-row">
              {/* Home panel (desktop) */}
              <TeamPanel color={hc} name={hn} fullName={game.home_team_name} record={game.home_team_record} mascotSrc={hm} mascotName={game.home_team_mascot_name || hn} side="home" />

              {/* Mobile teams row */}
              <div className="md:hidden flex">
                <div className="flex-1 p-4 flex flex-col" style={{ backgroundColor: hc }}>
                  <p className="text-white font-black text-xl uppercase leading-tight">{game.home_team_name}</p>
                  <p className="text-white/60 text-xs font-semibold">{game.home_team_record}</p>
                </div>
                <div className="flex-1 p-4 flex flex-col items-end" style={{ backgroundColor: ac }}>
                  <p className="text-white font-black text-xl uppercase leading-tight text-right">{game.away_team_name}</p>
                  <p className="text-white/60 text-xs font-semibold">{game.away_team_record}</p>
                </div>
              </div>

              {/* CENTER CONTENT */}
              <div className="flex-1 p-5 md:p-6">
                {/* Status */}
                {game.status && game.status !== 'upcoming' && (
                  <div className="flex justify-center mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${game.status==='live' ? 'bg-red text-white animate-pulse' : 'bg-gray-200 text-gray-600'}`}>
                      {game.status==='live' ? 'LIVE' : 'FINAL'}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4 text-navy" />
                  <span className="text-sm font-bold text-gray-700">Kynetics AI Prediction</span>
                </div>

                {/* BIG prediction bar */}
                <div className="h-12 md:h-14 rounded-2xl overflow-hidden flex mb-2">
                  <div className="flex items-center pl-4 relative" style={{ width:`${hp}%`, backgroundColor: hc }}>
                    <span className="text-white text-lg md:text-xl font-black relative z-10">{hp}%</span>
                    <div className="absolute inset-0 bar-shine" />
                  </div>
                  <div className="flex items-center justify-end pr-4" style={{ width:`${ap}%`, backgroundColor: ac }}>
                    <span className="text-white text-lg md:text-xl font-black">{ap}%</span>
                  </div>
                </div>
                <p className="text-center text-[11px] text-gray-400 flex items-center justify-center gap-1 mb-5">
                  <BarChart3 className="w-3 h-3" /> Based on {game.data_points || '10,000+'} data points analyzed
                </p>

                {/* Streak + H2H */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Current Streak</p>
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
                  <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Head to Head</p>
                    <p className="font-black text-sm text-gray-800">{game.head_to_head || 'No data'}</p>
                  </div>
                </div>

                {/* Reason */}
                {game.reason_text && (
                  <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-4 mb-5">
                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1.5">
                      <TrendingUp className="w-3 h-3 inline mr-1" /> AI Insight
                    </p>
                    <p className="text-sm text-blue-900 leading-relaxed">{game.reason_text}</p>
                  </div>
                )}

                {/* Vote */}
                <div>
                  <h3 className="font-bold text-gray-700 mb-3 text-sm text-center">Your Vote</h3>
                  <div className="flex gap-3 mb-4">
                    <button onClick={() => handleVote('home')} disabled={!!voted||voting}
                      className={`flex-1 py-3.5 rounded-xl font-bold text-sm transition-all border-2 uppercase tracking-wide ${voted==='home' ? 'text-white shadow-lg scale-[1.02]' : voted ? 'opacity-30 border-gray-100 text-gray-300' : 'border-gray-200 text-gray-700 hover:shadow-md active:scale-95'}`}
                      style={voted==='home' ? { backgroundColor:hc, borderColor:hc } : {}}>
                      {voting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : hn}
                    </button>
                    <button onClick={() => handleVote('away')} disabled={!!voted||voting}
                      className={`flex-1 py-3.5 rounded-xl font-bold text-sm transition-all border-2 uppercase tracking-wide ${voted==='away' ? 'text-white shadow-lg scale-[1.02]' : voted ? 'opacity-30 border-gray-100 text-gray-300' : 'border-gray-200 text-gray-700 hover:shadow-md active:scale-95'}`}
                      style={voted==='away' ? { backgroundColor:ac, borderColor:ac } : {}}>
                      {voting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : an}
                    </button>
                  </div>

                  {/* Community bar */}
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1"><Users className="w-3 h-3" /> Community</span>
                      <span className="text-[11px] text-gray-400 font-semibold">{tv.toLocaleString()} votes</span>
                    </div>
                    <div className="h-3 rounded-full overflow-hidden flex bg-gray-200 mb-2">
                      <div className="rounded-l-full transition-all duration-500" style={{ width:`${hvp}%`, backgroundColor:hc }} />
                      <div className="rounded-r-full transition-all duration-500" style={{ width:`${avp}%`, backgroundColor:ac }} />
                    </div>
                    <div className="flex justify-between text-[11px] font-semibold">
                      <span style={{ color:hc }}>{hvp}% {game.home_team_abbr}</span>
                      <span style={{ color:ac }}>{avp}% {game.away_team_abbr}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Away panel (desktop) */}
              <TeamPanel color={ac} name={an} fullName={game.away_team_name} record={game.away_team_record} mascotSrc={am} mascotName={game.away_team_mascot_name || an} side="away" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default GameDetailModal
