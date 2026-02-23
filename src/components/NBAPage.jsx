import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Filter, Loader2, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import GameCard from './GameCard'
import GameDetailModal from './GameDetailModal'
import AdminJSONPanel from './AdminJSONPanel'
import { useNBAGames } from '@/hooks/useNBAGames'

const NBAPage = () => {
  const today = new Date().toISOString().split('T')[0]
  const [currentDate, setCurrentDate] = useState(today)
  const [activeTab, setActiveTab] = useState('All')
  const [selectedGame, setSelectedGame] = useState(null)

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

  const formattedDate = new Date(currentDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  const isToday = currentDate === today

  return (
    <div className="min-h-screen bg-gray-50 pt-[70px]">
      {/* Header */}
      <div className="bg-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-cyan rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 md:py-10 relative z-10">
          <div className="flex items-center gap-2 sm:gap-3 mb-1">
            <button onClick={() => shiftDate(-1)} className="w-8 h-8 sm:w-9 sm:h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors shrink-0">
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-2xl md:text-4xl font-black text-white truncate">{formattedDate}</h1>
              {isToday && <span className="text-cyan text-[10px] sm:text-xs font-bold uppercase tracking-wider">Today</span>}
            </div>
            <button onClick={() => shiftDate(1)} className="w-8 h-8 sm:w-9 sm:h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors shrink-0">
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2">
            <div className="flex items-center gap-1.5 sm:gap-2 bg-white/10 border border-white/10 px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-xl">
              <span className="text-xl sm:text-2xl font-black text-cyan">{games.length}</span>
              <span className="text-xs sm:text-sm font-semibold text-white/70">Games</span>
            </div>
            {!isToday && (
              <button onClick={() => setCurrentDate(today)} className="text-xs sm:text-sm font-semibold text-cyan/80 hover:text-cyan bg-white/5 hover:bg-white/10 px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-xl transition-colors">
                ← Today
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-[70px] z-40 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-2 sm:py-3">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar">
            <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-300 mr-0.5 shrink-0" />
            {tabs.map(tab => {
              const count = tab === 'Live' ? games.filter(g => g.status === 'live').length : tab === 'Featured' ? games.filter(g => g.is_featured).length : tab === 'Upcoming' ? games.filter(g => g.status === 'upcoming').length : games.length
              return (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab ? 'bg-navy text-white shadow-sm' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}>
                  {tab}
                  {tab === 'Live' && count > 0 && <span className="ml-1 w-1.5 h-1.5 bg-red rounded-full inline-block animate-pulse" />}
                  {tab !== 'All' && count > 0 && <span className={`ml-1 text-[10px] ${activeTab === tab ? 'text-white/60' : 'text-gray-300'}`}>{count}</span>}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 pb-24">
        {loading ? (
          <div className="flex flex-col items-center py-16 sm:py-20"><Loader2 className="w-7 h-7 sm:w-8 sm:h-8 text-navy animate-spin mb-3" /><p className="text-gray-400 text-sm">Loading games...</p></div>
        ) : error ? (
          <div className="flex flex-col items-center py-16 sm:py-20"><AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-red mb-3" /><p className="text-red text-sm font-bold">{error}</p></div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-5">
            {filtered.map((game, i) => (
              <GameCard key={game.id} game={game} index={i} onOpenDetail={setSelectedGame}
                onDelete={async id => { const r = await deleteGame(id); if (!r.success) alert(r.error) }} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center py-16 sm:py-20 text-gray-300">
            <Calendar className="w-10 h-10 sm:w-12 sm:h-12 mb-3 sm:mb-4 text-gray-200" />
            <p className="text-base sm:text-lg font-bold text-gray-400">No games for this date</p>
            <p className="text-xs sm:text-sm text-gray-300 mt-1">Try a different day or check back later.</p>
            {!isToday && <button onClick={() => setCurrentDate(today)} className="mt-4 text-sm font-semibold text-navy hover:underline">Go to Today</button>}
          </div>
        )}
      </div>

      <GameDetailModal game={selectedGame} isOpen={!!selectedGame} onClose={() => setSelectedGame(null)} onVote={async (id, t) => await voteForTeam(id, t)} />
      <AdminJSONPanel onGamesUpdated={() => fetchGamesByDate(currentDate)} currentDate={currentDate} />
    </div>
  )
}

export default NBAPage
