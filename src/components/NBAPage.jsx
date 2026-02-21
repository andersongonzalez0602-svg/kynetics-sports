import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Filter, Loader2, AlertCircle } from 'lucide-react'
import GameCard from './GameCard'
import AdminJSONPanel from './AdminJSONPanel'
import { useNBAGames } from '@/hooks/useNBAGames'

const NBAPage = () => {
  const today = new Date().toISOString().split('T')[0]
  const [currentDate, setCurrentDate] = useState(today)
  const { games, loading, error, fetchGamesByDate } = useNBAGames()
  const [activeTab, setActiveTab] = useState('All')

  useEffect(() => {
    fetchGamesByDate(currentDate)
  }, [currentDate, fetchGamesByDate])

  const filteredGames = () => {
    if (activeTab === 'All') return games
    if (activeTab === 'Live') return games.filter(g => g.status === 'live')
    if (activeTab === 'Upcoming') return games.filter(g => g.status === 'upcoming')
    if (activeTab === 'Featured') return games.filter(g => g.is_featured)
    return games
  }

  const filtered = filteredGames()
  const tabs = ['All', 'Live', 'Upcoming', 'Featured']

  const formattedDate = new Date(currentDate + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
  })

  return (
    <div className="min-h-screen bg-gray-50 pt-[70px]">
      
      {/* Header */}
      <div className="bg-navy relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 transform origin-top" />
        <div className="absolute bottom-0 left-0 w-1/4 h-full bg-black/10 -skew-x-12 transform origin-bottom" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2 text-cyan font-bold mb-2 uppercase tracking-wider text-xs">
              <Calendar className="w-4 h-4" /> Today's Games
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white mb-3">
              {formattedDate}
            </h1>
            <p className="text-blue-200 text-base md:text-lg max-w-xl mb-6">
              AI-driven predictions for today's NBA matchups.
            </p>
            
            {/* Date picker + game count */}
            <div className="flex flex-wrap items-center gap-4">
              <input
                type="date"
                value={currentDate}
                onChange={e => setCurrentDate(e.target.value)}
                className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan"
              />
              <div className="flex items-center gap-2 bg-white/10 border border-white/10 px-4 py-2 rounded-lg">
                <span className="text-2xl font-black text-cyan">{games.length}</span>
                <span className="text-sm font-bold text-white/80 uppercase tracking-wide">Games</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="sticky top-[70px] z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <Filter className="w-4 h-4 text-gray-400 mr-1 shrink-0" />
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-navy text-white shadow-md'
                    : 'text-gray-500 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {tab}
                {tab === 'Live' && games.filter(g => g.status === 'live').length > 0 && (
                  <span className="ml-1.5 w-2 h-2 bg-red rounded-full inline-block animate-pulse" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Game Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-navy animate-spin" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-red">
            <AlertCircle className="w-10 h-10 mb-2" />
            <p className="text-lg font-bold">{error}</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map(game => (
                <motion.div
                  key={game.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <GameCard game={game} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <span className="text-6xl mb-4">🏀</span>
            <p className="text-lg font-bold">No games available</p>
            <p className="text-sm">Check back later for new predictions.</p>
          </div>
        )}
      </div>

      {/* Admin JSON Panel */}
      <AdminJSONPanel 
        onGamesUpdated={() => fetchGamesByDate(currentDate)} 
        currentDate={currentDate}
      />
    </div>
  )
}

export default NBAPage
