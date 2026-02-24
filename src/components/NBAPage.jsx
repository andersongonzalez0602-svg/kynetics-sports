import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Filter, Loader2, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import GameCard from './GameCard'
import GameDetailModal from './GameDetailModal'
import AdminJSONPanel from './AdminJSONPanel'
import { useNBAGames } from '@/hooks/useNBAGames'
import { getEasternDateString } from '@/lib/dateUtils'
import { useTranslation } from 'react-i18next'

const NBAPage = () => {
  const today = getEasternDateString()
  const [currentDate, setCurrentDate] = useState(today)
  const [activeTab, setActiveTab] = useState('All')
  const [selectedGame, setSelectedGame] = useState(null)
  const { t, i18n } = useTranslation()

  const { games, loading, error, fetchGamesByDate, deleteGame, voteForTeam } = useNBAGames()

  useEffect(() => { fetchGamesByDate(currentDate) }, [currentDate, fetchGamesByDate])

  const filteredGames = () => {
    if (activeTab === 'All') return games
    if (activeTab === 'Live') return games.filter(g => g.status === 'live')
    if (activeTab === 'Upcoming') return games.filter(g => g.status === 'upcoming')
    if (activeTab === 'Featured') return games.filter(g => g.is_featured)
    return games
  }

  const filtered = filteredGames()
  const tabs = ['All', 'Live', 'Upcoming', 'Featured']

  const shiftDate = (days) => {
    const d = new Date(currentDate + 'T12:00:00')
    d.setDate(d.getDate() + days)
    setCurrentDate(d.toISOString().split('T')[0])
  }

  const formattedDate = new Date(currentDate + 'T12:00:00').toLocaleDateString(
    i18n.language === 'es' ? 'es-ES' : 'en-US',
    { weekday: 'long', month: 'long', day: 'numeric' },
  )
  const isToday = currentDate === today

  return (
    <div className="min-h-screen bg-gray-50 pt-[70px]">
      {/* Header */}
      <div className="bg-gradient-to-br from-navy via-navy to-navy-dark relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative z-10">
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}>
            <div className="flex items-center gap-3 mb-3">
              <button onClick={() => shiftDate(-1)} className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <div className="flex-1">
                <h1 className="text-2xl md:text-4xl font-black text-white capitalize">{formattedDate}</h1>
                {isToday && <span className="text-cyan text-xs font-bold uppercase tracking-wider">{t('nba.todayLabel')}</span>}
              </div>
              <button onClick={() => shiftDate(1)} className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </div>
            <p className="text-blue-200/70 text-sm md:text-base max-w-2xl mb-4 leading-relaxed">
              {t('nba.headerDescription')}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-white/10 border border-white/10 px-4 py-2.5 rounded-xl">
                <span className="text-2xl font-black text-cyan">{games.length}</span>
                <span className="text-sm font-semibold text-white/70">{t('nba.gamesLabel')}</span>
              </div>
              {!isToday && (
                <button onClick={() => setCurrentDate(today)} className="text-sm font-semibold text-cyan/80 hover:text-cyan bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-xl transition-colors">
                  {t('nba.backToToday')}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-[70px] z-40 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <Filter className="w-4 h-4 text-gray-300 mr-1 shrink-0" />
            {tabs.map(tab => {
              const count = tab==='Live' ? games.filter(g=>g.status==='live').length : tab==='Featured' ? games.filter(g=>g.is_featured).length : tab==='Upcoming' ? games.filter(g=>g.status==='upcoming').length : games.length
              return (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab===tab ? 'bg-navy text-white shadow-sm' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}>
                  {t(`nba.tabs.${tab.toLowerCase()}`)}
                  {tab==='Live' && count>0 && <span className="ml-1.5 w-1.5 h-1.5 bg-red rounded-full inline-block animate-pulse" />}
                  {tab!=='All' && count>0 && <span className={`ml-1.5 text-xs ${activeTab===tab ? 'text-white/60' : 'text-gray-300'}`}>{count}</span>}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
        {loading ? (
          <div className="flex flex-col items-center py-20"><Loader2 className="w-8 h-8 text-navy animate-spin mb-3" /><p className="text-gray-400 text-sm">{t('nba.loading')}</p></div>
        ) : error ? (
          <div className="flex flex-col items-center py-20"><AlertCircle className="w-10 h-10 text-red mb-3" /><p className="text-red text-sm font-bold">{error}</p></div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <AnimatePresence mode="popLayout">
              {filtered.map((game, i) => (
                <motion.div key={game.id} layout initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, scale:0.95 }} transition={{ duration:0.3, delay:i*0.05 }}>
                  <GameCard game={game} onOpenDetail={setSelectedGame} onDelete={async id => { const r = await deleteGame(id); if(!r.success) alert(r.error) }} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex flex-col items-center py-20 text-gray-300">
            <Calendar className="w-12 h-12 mb-4 text-gray-200" />
            <p className="text-lg font-bold text-gray-400">{t('nba.noGamesTitle')}</p>
            <p className="text-sm text-gray-300 mt-1">{t('nba.noGamesBody')}</p>
            {!isToday && <button onClick={() => setCurrentDate(today)} className="mt-4 text-sm font-semibold text-navy hover:underline">{t('nba.goToToday')}</button>}
          </div>
        )}
      </div>

      <GameDetailModal game={selectedGame} isOpen={!!selectedGame} onClose={() => setSelectedGame(null)} onVote={async (id,t) => await voteForTeam(id,t)} />
      <AdminJSONPanel onGamesUpdated={() => fetchGamesByDate(currentDate)} currentDate={currentDate} />
    </div>
  )
}

export default NBAPage
