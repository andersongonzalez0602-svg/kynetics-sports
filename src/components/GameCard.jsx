import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Trash2, Lock, Users } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { getMascotUrl } from '@/lib/mascots'
import { useTranslation } from 'react-i18next'
import Navigation from './Navigation'
import { fmtML } from '@/hooks/useOdds'

const GameCard = ({ game, onOpenDetail, onDelete, isLocked, odds, onVote, userVote }) => {
  const { isAdmin, isLoggedIn } = useAuth()
  const { t, i18n } = useTranslation()

  const hc = game.home_team_color || '#1D428A'
  const ac = game.away_team_color || '#333333'
  const hp = game.home_win_pct || 50
  const ap = game.away_win_pct || 50
  const hm = game.home_team_mascot_image || getMascotUrl(game.home_team_abbr)
  const am = game.away_team_mascot_image || getMascotUrl(game.away_team_abbr)
  const hn = game.home_team_name?.split(' ').pop() || game.home_team_abbr
  const an = game.away_team_name?.split(' ').pop() || game.away_team_abbr

  const showBlur = isLocked && !isLoggedIn

  // Community vote totals
  const tv = (game.community_votes_home || 0) + (game.community_votes_away || 0)
  const hvp = tv > 0 ? Math.round((game.community_votes_home || 0) / tv * 100) : 50
  const avp = tv > 0 ? Math.round((game.community_votes_away || 0) / tv * 100) : 50

  const handleDelete = (e) => {
    e.stopPropagation()
    if (window.confirm(`Delete ${game.home_team_name} vs ${game.away_team_name}?`)) onDelete?.(game.id)
  }

  const handleLoginClick = (e) => {
    e.stopPropagation()
    Navigation.openAuth?.()
  }

  const handleVote = async (e, team) => {
    e.stopPropagation()
    if (!isLoggedIn) { Navigation.openAuth?.(); return }
    if (userVote) return
    await onVote?.(game.id, team)
  }

  const TeamPanel = ({ src, name, record, mascotName, side }) => (
    <div className="flex-1 relative overflow-hidden">
      <img src={src} alt={mascotName} className="w-full h-full object-cover absolute inset-0"
        onError={e => { e.target.style.display = 'none' }} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent z-10 pointer-events-none" />
      <div className={`relative z-20 p-3 sm:p-4 ${side === 'away' ? 'text-right' : ''}`}>
        <p className="text-white/60 text-[10px] font-bold tracking-wide drop-shadow-sm">{record}</p>
        <p className="text-white font-black text-xl sm:text-2xl md:text-3xl leading-none uppercase tracking-tight drop-shadow-md">{name}</p>
      </div>
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => onOpenDetail?.(game)}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group cursor-pointer"
    >
      {isAdmin && (
        <button onClick={handleDelete} className="absolute top-2 right-2 z-30 w-7 h-7 bg-black/30 hover:bg-red/80 rounded-full flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100">
          <Trash2 className="w-3 h-3 text-white" />
        </button>
      )}

      {/* TEAM PANELS */}
      <div className="flex relative" style={{ aspectRatio: '16/9' }}>
        <TeamPanel src={hm} name={hn} record={game.home_team_record} mascotName={game.home_team_mascot_name || hn} side="home" />
        <TeamPanel src={am} name={an} record={game.away_team_record} mascotName={game.away_team_mascot_name || an} side="away" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-lg">
            <span className="text-[9px] font-black text-gray-400">{t('dashboard.vs')}</span>
          </div>
        </div>
        {game.is_featured && (
          <div className="absolute top-2.5 left-2.5 z-20">
            <div className="flex items-center gap-1 bg-black/30 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-[10px] font-bold">
              <TrendingUp className="w-2.5 h-2.5" /> {t('dashboard.featured')}
            </div>
          </div>
        )}
      </div>

      <div className="px-3 pt-4 pb-1">

        {/* ── KYNETICS PREDICTION BAR ── */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              {t('dashboard.aiPredictionLabel')}
            </p>
            <span className="text-[10px] font-bold text-navy uppercase tracking-wide">Kynetics</span>
          </div>

          {showBlur ? (
            <div className="relative">
              <div className="h-10 sm:h-11 rounded-xl overflow-hidden flex filter blur-[6px]">
                <div className="flex items-center pl-3" style={{ width: '50%', backgroundColor: '#94a3b8' }}>
                  <span className="text-white text-sm font-black">??%</span>
                </div>
                <div className="w-[2px] shrink-0 bg-white" />
                <div className="flex items-center justify-end pr-3" style={{ width: '50%', backgroundColor: '#94a3b8' }}>
                  <span className="text-white text-sm font-black">??%</span>
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <button onClick={handleLoginClick} className="flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-gray-200 hover:bg-navy hover:text-white hover:border-navy transition-all group/lock">
                  <Lock className="w-3 h-3 text-gray-400 group-hover/lock:text-white" />
                  <span className="text-xs font-bold text-gray-600 group-hover/lock:text-white">{t('dashboard.signInToSee')}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="h-10 sm:h-11 rounded-xl overflow-hidden relative flex">
              <motion.div initial={{ width: 0 }} animate={{ width: `${hp}%` }} transition={{ duration: 1, ease: 'easeOut' }}
                className="flex items-center pl-3 shrink-0"
                style={{ backgroundColor: hc }}>
                <span className="text-white text-sm sm:text-base font-black whitespace-nowrap">{hp}%</span>
              </motion.div>
              <div className="w-[2px] shrink-0 bg-white z-10" />
              <motion.div initial={{ width: 0 }} animate={{ width: `${ap}%` }} transition={{ duration: 1, ease: 'easeOut', delay: 0.15 }}
                className="flex items-center justify-end pr-3 shrink-0"
                style={{ backgroundColor: ac }}>
                <span className="text-white text-sm sm:text-base font-black whitespace-nowrap">{ap}%</span>
              </motion.div>
            </div>
          )}

          {!showBlur && (
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-gray-400 font-bold uppercase">{game.home_team_abbr}</span>
              <span className="text-[10px] text-gray-400 font-bold uppercase">{game.away_team_abbr}</span>
            </div>
          )}
        </div>

        {/* ── MARKET BAR (from Odds API) ── */}
        {!showBlur && odds && (odds.homeProb || odds.awayProb) && (
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Market</p>
              <div className="flex items-center gap-2">
                {odds.homeML && <span className="text-[10px] font-black text-amber-600">{fmtML(odds.homeML)}</span>}
                {odds.homeML && odds.awayML && <span className="text-[10px] text-gray-300">|</span>}
                {odds.awayML && <span className="text-[10px] font-black text-amber-600">{fmtML(odds.awayML)}</span>}
                <span className="text-[9px] text-gray-300 font-medium">DraftKings</span>
              </div>
            </div>
            <div className="h-7 rounded-xl overflow-hidden relative flex">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${odds.homeProb || 50}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                className="flex items-center pl-3 shrink-0 bg-amber-400"
              >
                <span className="text-white text-xs font-black whitespace-nowrap">{odds.homeProb}%</span>
              </motion.div>
              <div className="w-[2px] shrink-0 bg-white z-10" />
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${odds.awayProb || 50}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.45 }}
                className="flex items-center justify-end pr-3 shrink-0 bg-amber-400"
              >
                <span className="text-white text-xs font-black whitespace-nowrap">{odds.awayProb}%</span>
              </motion.div>
            </div>
            {/* Edge indicator — show when model and market diverge by 10%+ */}
            {Math.abs(hp - (odds.homeProb || 50)) >= 10 && (
              <div className="mt-1.5 flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-navy" />
                <span className="text-[10px] font-bold text-navy">
                  {hp > (odds.homeProb || 50)
                    ? `We rate ${hn} ${hp - (odds.homeProb || 50)}% higher than market`
                    : `We rate ${an} ${(odds.homeProb || 50) - hp}% lower than market`
                  }
                </span>
              </div>
            )}
          </div>
        )}

        {/* ── AI INSIGHT ── */}
        {(() => {
          const reason = i18n.language === 'es' && game.reason_text_es ? game.reason_text_es : game.reason_text
          if (!reason) return null
          if (showBlur) {
            return (
              <div className="px-0 pt-1 pb-1 relative mb-2">
                <p className="text-gray-400 text-xs leading-relaxed filter blur-[5px] select-none">
                  💡 <span className="text-gray-500">{reason}</span>
                </p>
                <div className="absolute inset-0 flex items-center justify-center">
                  <button onClick={handleLoginClick} className="flex items-center gap-1.5 bg-white/90 px-3 py-1.5 rounded-full shadow-sm border border-gray-200 hover:bg-navy hover:text-white hover:border-navy transition-all group/lock">
                    <Lock className="w-3 h-3 text-gray-400 group-hover/lock:text-white" />
                    <span className="text-[10px] font-bold text-gray-500 group-hover/lock:text-white">{t('dashboard.signInInsight')}</span>
                  </button>
                </div>
              </div>
            )
          }
          return (
            <p className="text-gray-400 text-xs leading-relaxed mb-3">💡 <span className="text-gray-500">{reason}</span></p>
          )
        })()}
      </div>

      {/* ── COMMUNITY VOTE (big, visible on card) ── */}
      <div className="px-3 pb-3" onClick={e => e.stopPropagation()}>
        <div className="border border-gray-100 rounded-xl p-3 bg-gray-50">
          <div className="flex items-center gap-1.5 mb-2.5">
            <Users className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('dashboard.community')}</span>
            {tv > 0 && <span className="text-[10px] text-gray-300 ml-auto">{tv} {t('dashboard.votes')}</span>}
          </div>

          {/* Vote buttons */}
          {!userVote ? (
            <div className="flex gap-2 mb-2.5">
              <button
                onClick={(e) => handleVote(e, 'home')}
                className="flex-1 py-2.5 rounded-lg text-xs font-black uppercase tracking-wide transition-all border-2 border-transparent hover:border-opacity-60 hover:shadow-md active:scale-95 text-white"
                style={{ backgroundColor: hc }}
              >
                {hn}
              </button>
              <button
                onClick={(e) => handleVote(e, 'away')}
                className="flex-1 py-2.5 rounded-lg text-xs font-black uppercase tracking-wide transition-all border-2 border-transparent hover:border-opacity-60 hover:shadow-md active:scale-95 text-white"
                style={{ backgroundColor: ac }}
              >
                {an}
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 mb-2.5 py-2.5 bg-emerald-50 border border-emerald-100 rounded-lg">
              <span className="text-xs font-bold text-emerald-600">
                ✓ Voted {userVote === 'home' ? hn : an}
              </span>
            </div>
          )}

          {/* Community bar */}
          <div className="h-2 rounded-full overflow-hidden flex bg-gray-200">
            <div className="rounded-l-full transition-all duration-700" style={{ width: `${hvp}%`, backgroundColor: hc }} />
            <div className="rounded-r-full transition-all duration-700" style={{ width: `${avp}%`, backgroundColor: ac }} />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[10px] font-bold" style={{ color: hc }}>{hvp}% {game.home_team_abbr}</span>
            <span className="text-[10px] font-bold" style={{ color: ac }}>{game.away_team_abbr} {avp}%</span>
          </div>
        </div>
      </div>

      {/* ── SEE DETAILS BUTTON ── */}
      <div className="px-3 pb-3">
        <div className="w-full py-3 bg-gray-50 group-hover:bg-navy text-gray-400 group-hover:text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-1 border border-gray-100 group-hover:border-navy">
          {t('dashboard.seeDetails')}
        </div>
      </div>
    </motion.div>
  )
}

export default GameCard
