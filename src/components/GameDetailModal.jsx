import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, TrendingUp, Users, Loader2, MapPin, LogIn } from 'lucide-react'
import { getMascotUrl } from '@/lib/mascots'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/contexts/AuthContext'
import Navigation from './Navigation'

const GameDetailModal = ({ game, isOpen, onClose, onVote, userVote }) => {
  const [voting, setVoting] = useState(false)
  const { t, i18n } = useTranslation()
  const { isLoggedIn } = useAuth()

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
  const reasonText = i18n.language === 'es' && game.reason_text_es ? game.reason_text_es : game.reason_text

  const fmtPct = (v) => `${v}%`

  const handleVote = async (team) => {
    if (userVote || voting || !isLoggedIn) return
    setVoting(true)
    await onVote?.(game.id, team)
    setVoting(false)
  }

  const handleLoginClick = () => {
    onClose()
    setTimeout(() => Navigation.openAuth?.(), 300)
  }

  const parseL5 = (str) => {
    if (!str) return null
    const arr = str.toUpperCase().split('').filter(c => c === 'W' || c === 'L')
    return arr.length > 0 ? arr : null
  }
  const homeL5 = parseL5(game.home_last5)
  const awayL5 = parseL5(game.away_last5)

  const L5Badge = ({ char }) => (
    <span className={`inline-flex items-center justify-center w-6 h-6 rounded text-[10px] font-black text-white ${char === 'W' ? 'bg-emerald-500' : 'bg-red'}`}>{char}</span>
  )

  const L5Row = ({ abbr, last5 }) => {
    if (!last5) return null
    const wins = last5.filter(c => c === 'W').length
    const losses = last5.filter(c => c === 'L').length
    return (
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-gray-500 uppercase">{abbr}</span>
        <div className="flex items-center gap-1">
          <div className="flex gap-0.5 mr-2">{last5.map((c, i) => <L5Badge key={i} char={c} />)}</div>
          <span className="text-sm font-black text-gray-700">{wins}-{losses}</span>
        </div>
      </div>
    )
  }

  const StreakBadge = ({ streak, small }) => {
    if (!streak) return null
    const isWin = streak.startsWith('W')
    return (
      <span className={`inline-flex items-center font-black uppercase tracking-wide ${small ? 'text-[10px] px-2 py-0.5 rounded' : 'text-xs px-2.5 py-1 rounded-lg'} ${isWin ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red/15 text-red-400'}`}>{streak}</span>
    )
  }

  const Bar = ({ h = 'h-12' }) => (
    <div className={`${h} rounded-2xl overflow-hidden flex`}>
      <div className="flex items-center pl-4 rounded-l-2xl" style={{ width: `${hp}%`, backgroundColor: hc }}>
        <span className="text-white text-lg font-black">{fmtPct(hp)}</span>
      </div>
      <div className="flex items-center justify-end pr-4 rounded-r-2xl" style={{ width: `${ap}%`, backgroundColor: ac }}>
        <span className="text-white text-lg font-black">{fmtPct(ap)}</span>
      </div>
    </div>
  )

  const VoteBtn = ({ team, name, color }) => {
    const isThisVote = userVote === team
    const hasVoted = !!userVote
    return (
      <button onClick={() => isLoggedIn ? handleVote(team) : handleLoginClick()} disabled={hasVoted || voting}
        className={`flex-1 py-3.5 rounded-xl font-bold text-sm transition-all border-2 uppercase tracking-wide ${
          isThisVote ? 'text-white shadow-lg scale-[1.02]' :
          hasVoted ? 'opacity-25 border-gray-100 text-gray-300 cursor-default' :
          'border-gray-200 text-gray-700 hover:shadow-md active:scale-95'
        }`}
        style={isThisVote ? { backgroundColor: color, borderColor: color } : {}}>
        {voting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : name}
      </button>
    )
  }

  const CommunityBar = () => (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
      <div className="h-3.5 rounded-full overflow-hidden flex bg-gray-200 mb-2">
        <div className="rounded-l-full transition-all duration-500" style={{ width: `${hvp}%`, backgroundColor: hc }} />
        <div className="rounded-r-full transition-all duration-500" style={{ width: `${avp}%`, backgroundColor: ac }} />
      </div>
      <div className="flex justify-between text-[11px] font-bold">
        <span style={{ color: hc }}>{hvp}% {game.home_team_abbr} ({game.community_votes_home || 0})</span>
        <span className="text-gray-300">{tv.toLocaleString()} {t('dashboard.votes')}</span>
        <span style={{ color: ac }}>{avp}% {game.away_team_abbr} ({game.community_votes_away || 0})</span>
      </div>
    </div>
  )

  const SidePanel = ({ src, fullName, record, mascotName, side, abbr, streak }) => (
    <div className="w-[22%] flex flex-col relative overflow-hidden">
      <img src={src} alt={mascotName} className="absolute inset-0 w-full h-full object-cover" onError={e => { e.target.style.display='none' }} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-transparent pointer-events-none z-10" />
      <div className={`relative z-20 p-5 pb-3 ${side === 'away' ? 'text-right' : ''}`}>
        <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest mb-1">
          {side === 'home' ? t('dashboard.homeLabel') : t('dashboard.awayLabel')} · {abbr}
        </p>
        <p className="text-white font-black text-2xl lg:text-3xl uppercase leading-tight drop-shadow-lg">{fullName}</p>
        <p className="text-white/60 text-sm font-bold mt-1 drop-shadow-sm">{record}</p>
        {streak && <div className="mt-2"><StreakBadge streak={streak} /></div>}
      </div>
      <div className="flex-1" />
    </div>
  )

  const CenterContent = ({ barHeight, isMobile }) => (
    <>
      {game.game_time && game.status === 'upcoming' && (
        <p className="text-center text-gray-400 text-sm font-semibold mb-3">{game.game_time}</p>
      )}
      {game.status && game.status !== 'upcoming' && (
        <div className="flex justify-center mb-3">
          <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${game.status === 'live' ? 'bg-red text-white animate-pulse' : 'bg-gray-200 text-gray-600'}`}>
            {game.status === 'live' ? t('dashboard.live') : t('dashboard.final')}
          </span>
        </div>
      )}

      <div className="flex items-center justify-center gap-2 mb-4">
        <TrendingUp className="w-4 h-4 text-navy" />
        <span className="text-sm font-bold text-gray-800">
          {t('dashboard.aiTitle')} · {game.data_points || '10,000+'} {t('dashboard.dataPoints')}
        </span>
      </div>

      <Bar h={barHeight} />

      <div className="grid grid-cols-2 gap-3 mt-5 mb-5">
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <p className={`text-[10px] font-bold text-gray-400 uppercase ${isMobile ? 'tracking-wider' : 'tracking-widest'} mb-2`}>
            {t('dashboard.gameInfo')}
          </p>
          <p className="font-bold text-sm text-gray-700">{game.game_time || 'TBD'}</p>
          <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {game.home_team_name?.split(' ').slice(0, -1).join(' ') || game.home_team_abbr}
          </p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <p className={`text-[10px] font-bold text-gray-400 uppercase ${isMobile ? 'tracking-wider' : 'tracking-widest'} mb-2`}>
            {isMobile ? t('dashboard.h2hShort') : t('dashboard.headToHead')}
          </p>
          <p className={`font-black ${isMobile ? 'text-sm' : 'text-base'} text-gray-800`}>{game.head_to_head || t('dashboard.noData')}</p>
        </div>
      </div>

      {(homeL5 || awayL5) && (
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-5">
          <p className={`text-[10px] font-bold text-gray-400 uppercase ${isMobile ? 'tracking-wider' : 'tracking-widest'} mb-3`}>
            {t('dashboard.last5')}
          </p>
          <div className="flex flex-col gap-2.5">
            {homeL5 && <L5Row abbr={game.home_team_abbr} last5={homeL5} />}
            {awayL5 && <L5Row abbr={game.away_team_abbr} last5={awayL5} />}
          </div>
        </div>
      )}

      {reasonText && (
        <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-4 mb-5">
          <p className={`text-[10px] font-bold text-blue-400 uppercase ${isMobile ? 'tracking-wider' : 'tracking-widest'} mb-1.5`}>
            <TrendingUp className="w-3 h-3 inline mr-1" /> {t('dashboard.aiInsight')}
          </p>
          <p className="text-sm text-blue-900 leading-relaxed">{reasonText}</p>
        </div>
      )}

      <h3 className="font-bold text-gray-400 mb-3 text-[10px] text-center uppercase tracking-widest">
        {t('dashboard.communityVoteTitle')}
      </h3>

      {!isLoggedIn && (
        <button onClick={handleLoginClick} className="w-full bg-navy/5 border border-navy/10 rounded-xl p-3 mb-3 flex items-center justify-center gap-2 hover:bg-navy/10 transition-colors cursor-pointer">
          <LogIn className="w-3.5 h-3.5 text-navy" />
          <span className="text-xs font-semibold text-navy">{t('dashboard.loginToVote')}</span>
        </button>
      )}

      {userVote && (
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 mb-3 flex items-center justify-center gap-2">
          <span className="text-xs font-semibold text-emerald-600">{t('dashboard.alreadyVoted')}</span>
        </div>
      )}

      <div className="flex gap-3 mb-4">
        <VoteBtn team="home" name={hn} color={hc} />
        <VoteBtn team="away" name={an} color={ac} />
      </div>
      <CommunityBar />
    </>
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm" onClick={onClose}>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="hidden md:flex fixed inset-y-12 inset-x-16 lg:inset-y-10 lg:inset-x-24 xl:inset-y-12 xl:inset-x-32 bg-white rounded-3xl overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}>
            <button onClick={onClose} className="absolute top-4 right-4 z-30 w-10 h-10 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center transition-colors">
              <X className="w-5 h-5 text-white" />
            </button>
            <SidePanel src={hm} fullName={game.home_team_name} record={game.home_team_record} mascotName={game.home_team_mascot_name || hn} side="home" abbr={game.home_team_abbr} streak={game.home_streak} />
            <div className="flex-1 overflow-y-auto px-8 py-6 lg:px-10 lg:py-8">
              <CenterContent barHeight="h-14" isMobile={false} />
            </div>
            <SidePanel src={am} fullName={game.away_team_name} record={game.away_team_record} mascotName={game.away_team_mascot_name || an} side="away" abbr={game.away_team_abbr} streak={game.away_streak} />
          </motion.div>

          <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="md:hidden fixed inset-0 bg-white overflow-y-auto"
            onClick={e => e.stopPropagation()}>
            <button onClick={onClose} className="fixed top-3 right-3 z-30 w-9 h-9 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center">
              <X className="w-4 h-4 text-white" />
            </button>
            <div className="flex" style={{ aspectRatio: '16/9' }}>
              {[{ src: hm, name: game.home_team_name, record: game.home_team_record, mn: game.home_team_mascot_name || hn, side: 'home', abbr: game.home_team_abbr, streak: game.home_streak },
                { src: am, name: game.away_team_name, record: game.away_team_record, mn: game.away_team_mascot_name || an, side: 'away', abbr: game.away_team_abbr, streak: game.away_streak }].map((tm, i) => (
                <div key={i} className="flex-1 relative overflow-hidden">
                  <img src={tm.src} alt={tm.mn} className="w-full h-full object-cover absolute inset-0" onError={e => { e.target.style.display='none' }} />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent z-10 pointer-events-none" />
                  <div className={`relative z-20 p-3 ${tm.side === 'away' ? 'text-right' : ''}`}>
                    <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest mb-0.5">
                      {tm.side === 'home' ? t('dashboard.homeLabel') : t('dashboard.awayLabel')} · {tm.abbr}
                    </p>
                    <p className="text-white font-black text-lg uppercase leading-tight drop-shadow-md">{tm.name}</p>
                    <p className="text-white/60 text-[10px] font-bold drop-shadow-sm">{tm.record}</p>
                    {tm.streak && <div className="mt-1"><StreakBadge streak={tm.streak} small /></div>}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 pb-10 mt-2">
              <CenterContent barHeight="h-11" isMobile={true} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default GameDetailModal
