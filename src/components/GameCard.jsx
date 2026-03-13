import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Trash2, Lock } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { getMascotUrl } from '@/lib/mascots'
import { useTranslation } from 'react-i18next'
import Navigation from './Navigation'

const GameCard = ({ game, onOpenDetail, onDelete, isLocked }) => {
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

  // If locked (not logged in + not the free game), blur the prediction
  const showBlur = isLocked && !isLoggedIn

  const handleDelete = (e) => {
    e.stopPropagation()
    if (window.confirm(`Delete ${game.home_team_name} vs ${game.away_team_name}?`)) onDelete?.(game.id)
  }

  const handleLoginClick = (e) => {
    e.stopPropagation()
    Navigation.openAuth?.()
  }

  const TeamPanel = ({ src, name, record, mascotName, side }) => (
    <div className="flex-1 relative overflow-hidden">
      <img src={src} alt={mascotName} className="w-full h-full object-cover absolute inset-0"
        onError={e => { e.target.style.display='none' }} />
      <div className={`absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent z-10 pointer-events-none`} />
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

      {/* PREDICTION BAR */}
      <div className="px-3 pt-4 pb-1 relative">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
          {t('dashboard.aiPredictionLabel')}
        </p>

        {showBlur ? (
          /* BLURRED STATE — show fake 50/50 bar with blur + lock overlay */
          <div className="relative">
            <div className="h-10 sm:h-11 rounded-xl overflow-hidden flex filter blur-[6px]">
              <div className="flex items-center pl-3 rounded-l-xl" style={{ width: '50%', backgroundColor: '#94a3b8' }}>
                <span className="text-white text-sm sm:text-base font-black">??%</span>
              </div>
              <div className="flex items-center justify-end pr-3 rounded-r-xl" style={{ width: '50%', backgroundColor: '#94a3b8' }}>
                <span className="text-white text-sm sm:text-base font-black">??%</span>
              </div>
            </div>
            {/* Lock overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button onClick={handleLoginClick} className="flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-gray-200 hover:bg-navy hover:text-white hover:border-navy transition-all group/lock">
                <Lock className="w-3 h-3 text-gray-400 group-hover/lock:text-white" />
                <span className="text-xs font-bold text-gray-600 group-hover/lock:text-white">{t('dashboard.signInToSee')}</span>
              </button>
            </div>
          </div>
        ) : (
          /* NORMAL STATE — real percentages */
          <div className="h-10 sm:h-11 rounded-xl overflow-hidden relative flex">
            <motion.div initial={{ width: 0 }} animate={{ width: `${hp}%` }} transition={{ duration: 1, ease: 'easeOut' }}
              className="flex items-center pl-3 shrink-0"
              style={{ backgroundColor: hc }}>
              <span className="text-white text-sm sm:text-base font-black whitespace-nowrap">{hp}%</span>
            </motion.div>
            {/* White separator */}
            <div className="w-[2px] shrink-0 bg-white z-10" />
            <motion.div initial={{ width: 0 }} animate={{ width: `${ap}%` }} transition={{ duration: 1, ease: 'easeOut', delay: 0.15 }}
              className="flex items-center justify-end pr-3 shrink-0"
              style={{ backgroundColor: ac }}>
              <span className="text-white text-sm sm:text-base font-black whitespace-nowrap">{ap}%</span>
            </motion.div>
          </div>
        )}

        {!showBlur && (
          <div className="flex justify-between mt-1.5">
            <span className="text-[10px] text-gray-400 font-bold uppercase">{game.home_team_abbr}</span>
            <span className="text-[10px] text-gray-400 font-bold uppercase">{game.away_team_abbr}</span>
          </div>
        )}
      </div>

      {/* REASON / INSIGHT */}
      {(() => {
        const reason = i18n.language === 'es' && game.reason_text_es ? game.reason_text_es : game.reason_text
        if (!reason) return null

        if (showBlur) {
          return (
            <div className="px-3 pt-2 relative">
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
          <div className="px-3 pt-2">
            <p className="text-gray-400 text-xs leading-relaxed">💡 <span className="text-gray-500">{reason}</span></p>
          </div>
        )
      })()}

      {/* BUTTON */}
      <div className="p-3 pt-3">
        <div className="w-full py-3.5 bg-gray-50 group-hover:bg-navy text-gray-400 group-hover:text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-1 border border-gray-100 group-hover:border-navy">
          {t('dashboard.seeDetails')}
        </div>
      </div>
    </motion.div>
  )
}

export default GameCard
