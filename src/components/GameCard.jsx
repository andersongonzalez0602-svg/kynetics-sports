import React from 'react'
import { motion } from 'framer-motion'
import { Clock, TrendingUp, Trash2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { getMascotUrl } from '@/lib/mascots'
import { useTranslation } from 'react-i18next'

const GameCard = ({ game, onOpenDetail, onDelete }) => {
  const { isAdmin } = useAuth()
  const { t, i18n } = useTranslation()
  const hc = game.home_team_color || '#1D428A'
  const ac = game.away_team_color || '#333333'
  const hp = game.home_win_pct || 50
  const ap = game.away_win_pct || 50
  const hm = game.home_team_mascot_image || getMascotUrl(game.home_team_abbr)
  const am = game.away_team_mascot_image || getMascotUrl(game.away_team_abbr)
  const hn = game.home_team_name?.split(' ').pop() || game.home_team_abbr
  const an = game.away_team_name?.split(' ').pop() || game.away_team_abbr
  const reasonText =
    i18n.language?.startsWith('es')
      ? game.reason_text_es || game.reason_text
      : game.reason_text

  const handleDelete = (e) => {
    e.stopPropagation()
    if (window.confirm(`Delete ${game.home_team_name} vs ${game.away_team_name}?`)) onDelete?.(game.id)
  }

  // One unified team panel: image fills everything, text overlays on top
  const TeamPanel = ({ src, name, record, mascotName, side }) => (
    <div className="flex-1 relative overflow-hidden">
      {/* Image fills the whole panel */}
      <img src={src} alt={mascotName} className="w-full h-full object-cover absolute inset-0"
        onError={e => { e.target.style.display='none' }} />
      {/* Gradient overlay for text readability at top */}
      <div className={`absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent z-10 pointer-events-none`} />
      {/* Text on top */}
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

      {/* UNIFIED TEAM PANELS - image is the background, text overlays */}
      <div className="flex relative" style={{ aspectRatio: '16/9' }}>
        <TeamPanel src={hm} name={hn} record={game.home_team_record} mascotName={game.home_team_mascot_name || hn} side="home" />
        <TeamPanel src={am} name={an} record={game.away_team_record} mascotName={game.away_team_mascot_name || an} side="away" />

        {/* VS circle */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-lg">
            <span className="text-[9px] font-black text-gray-400">{t('dashboard.vs')}</span>
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 z-20 flex items-center gap-1.5">
          <div className="flex items-center gap-1 bg-black/30 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-[10px] font-bold">
            {game.status === 'live' ? (
              <>
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> {t('dashboard.live')}
              </>
            ) : game.status === 'final' ? (
              t('dashboard.final')
            ) : (
              <>
                <Clock className="w-2.5 h-2.5" /> {game.game_time || 'TBD'}
              </>
            )}
          </div>
        </div>
        {game.is_value_pick && (
          <div className="absolute top-2.5 right-2.5 z-20">
            <div className="flex items-center gap-1 bg-emerald-500 text-white px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm">
              <TrendingUp className="w-2.5 h-2.5" /> {t('dashboard.value')}
            </div>
          </div>
        )}
      </div>

      {/* PREDICTION BAR - solid, clean */}
      <div className="px-3 pt-4 pb-1">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
          {t('dashboard.aiPredictionLabel')}
        </p>
        <div className="h-10 sm:h-11 rounded-xl overflow-hidden flex">
          <motion.div initial={{ width: 0 }} animate={{ width: `${hp}%` }} transition={{ duration: 1, ease: 'easeOut' }}
            className="flex items-center pl-3 rounded-l-xl"
            style={{ backgroundColor: hc }}>
            <span className="text-white text-sm sm:text-base font-black">{hp}%</span>
          </motion.div>
          <motion.div initial={{ width: 0 }} animate={{ width: `${ap}%` }} transition={{ duration: 1, ease: 'easeOut', delay: 0.15 }}
            className="flex items-center justify-end pr-3 rounded-r-xl"
            style={{ backgroundColor: ac }}>
            <span className="text-white text-sm sm:text-base font-black">{ap}%</span>
          </motion.div>
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[10px] text-gray-400 font-bold uppercase">{game.home_team_abbr}</span>
          <span className="text-[10px] text-gray-400 font-bold uppercase">{game.away_team_abbr}</span>
        </div>
      </div>

      {/* REASON */}
      {reasonText && (
        <div className="px-3 pt-2">
          <p className="text-gray-400 text-xs leading-relaxed">
            💡 <span className="text-gray-500">{reasonText}</span>
          </p>
        </div>
      )}

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
