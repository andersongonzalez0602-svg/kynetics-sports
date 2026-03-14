import React, { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle2, XCircle, Minus, TrendingUp, Calendar,
  Target, Flame, ChevronDown, ChevronUp, Settings,
  X, Check, AlertCircle, Loader2, Save
} from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/contexts/AuthContext'
import { useTranslation } from 'react-i18next'

const formatDate = (dateStr) => {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
const getGameResult = (game) => {
  if (!game.actual_result) return 'pending'
  const predicted = game.home_win_pct >= 50 ? 'home' : 'away'
  return predicted === game.actual_result ? 'correct' : 'incorrect'
}
const getPredictedTeam = (game) =>
  game.home_win_pct >= 50
    ? (game.home_team_name || game.home_team_abbr)
    : (game.away_team_name || game.away_team_abbr)
const getActualWinner = (game) => {
  if (!game.actual_result) return '—'
  return game.actual_result === 'home'
    ? (game.home_team_name || game.home_team_abbr)
    : (game.away_team_name || game.away_team_abbr)
}
const getConfidence = (game) => {
  const pct = Math.max(game.home_win_pct || 50, game.away_win_pct || 50)
  if (pct >= 80) return { label: 'High', color: 'text-emerald-600 bg-emerald-50' }
  if (pct >= 65) return { label: 'Medium', color: 'text-amber-600 bg-amber-50' }
  return { label: 'Low', color: 'text-gray-500 bg-gray-100' }
}

const ResultBadge = ({ result }) => {
  if (result === 'correct') return (
    <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap">
      <CheckCircle2 className="w-3 h-3" /> Correct
    </span>
  )
  if (result === 'incorrect') return (
    <span className="inline-flex items-center gap-1 text-red bg-red/10 px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap">
      <XCircle className="w-3 h-3" /> Wrong
    </span>
  )
  return (
    <span className="inline-flex items-center gap-1 text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap">
      <Minus className="w-3 h-3" /> Pending
    </span>
  )
}

const AdminResultsPanel = ({ games, onResultSaved }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [results, setResults] = useState({})
  const [saving, setSaving] = useState({})
  const [saved, setSaved] = useState({})
  const [error, setError] = useState(null)

  useEffect(() => {
    const init = {}
    games.forEach(g => { init[g.id] = g.actual_result || '' })
    setResults(init)
  }, [games])

  const handleSaveOne = async (game) => {
    const val = results[game.id]
    if (!val) return
    setSaving(s => ({ ...s, [game.id]: true }))
    setError(null)
    try {
      const { error: err } = await supabase.from('nba_games').update({ actual_result: val }).eq('id', game.id)
      if (err) throw err
      setSaved(s => ({ ...s, [game.id]: true }))
      setTimeout(() => setSaved(s => ({ ...s, [game.id]: false })), 2000)
      onResultSaved?.()
    } catch (e) { setError(e.message) }
    finally { setSaving(s => ({ ...s, [game.id]: false })) }
  }

  const handleSaveAll = async () => {
    setError(null)
    const pending = games.filter(g => results[g.id] && results[g.id] !== g.actual_result)
    if (pending.length === 0) return
    const allSaving = {}
    pending.forEach(g => { allSaving[g.id] = true })
    setSaving(allSaving)
    try {
      for (const game of pending) {
        const { error: err } = await supabase.from('nba_games').update({ actual_result: results[game.id] }).eq('id', game.id)
        if (err) throw err
      }
      const allSaved = {}
      pending.forEach(g => { allSaved[g.id] = true })
      setSaved(allSaved)
      setTimeout(() => setSaved({}), 2500)
      onResultSaved?.()
    } catch (e) { setError(e.message) }
    finally { setSaving({}) }
  }

  const byDate = games.reduce((acc, g) => {
    if (!acc[g.game_date]) acc[g.game_date] = []
    acc[g.game_date].push(g)
    return acc
  }, {})
  const dates = Object.keys(byDate).sort((a, b) => b.localeCompare(a))
  const pendingCount = games.filter(g => !g.actual_result).length
  const hasDirty = games.some(g => results[g.id] && results[g.id] !== g.actual_result)

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-navy text-white px-4 py-3 rounded-full shadow-lg shadow-navy/30 hover:bg-navy-dark transition-colors"
      >
        <Settings className="w-5 h-5" />
        <span className="text-sm font-bold">Update Results</span>
        {pendingCount > 0 && (
          <span className="bg-red text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
            {pendingCount > 9 ? '9+' : pendingCount}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/50 flex justify-end"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              <div className="bg-navy p-6 flex items-center justify-between sticky top-0 z-10">
                <div>
                  <h2 className="text-white text-xl font-black">Update Results</h2>
                  <p className="text-blue-200 text-sm mt-0.5">
                    {pendingCount > 0 ? `${pendingCount} game${pendingCount !== 1 ? 's' : ''} need results` : 'All results up to date ✓'}
                  </p>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-5 flex flex-col gap-1 flex-1">
                {error && (
                  <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-sm mb-3">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /> {error}
                  </div>
                )}

                {hasDirty && (
                  <button
                    onClick={handleSaveAll}
                    className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors mb-4 text-sm"
                  >
                    <Save className="w-4 h-4" /> Save All Changes
                  </button>
                )}

                {dates.map(date => (
                  <div key={date} className="mb-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-xs font-black text-gray-600 uppercase tracking-wider">{formatDate(date)}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      {byDate[date].map(game => {
                        const currentVal = results[game.id] || ''
                        const isSaving = saving[game.id]
                        const isSaved = saved[game.id]
                        const isDirty = currentVal !== (game.actual_result || '')
                        return (
                          <div key={game.id} className={`bg-gray-50 border rounded-xl p-3.5 transition-colors ${isDirty ? 'border-navy/30 bg-navy/5' : 'border-gray-100'}`}>
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <img src={`/mascot-${game.away_team_abbr?.toLowerCase()}.png`} className="w-6 h-6 object-contain" onError={e => { e.target.style.display = 'none' }} alt="" />
                                <span className="text-xs font-bold text-gray-700">{game.away_team_abbr}</span>
                                <span className="text-[10px] text-gray-300">@</span>
                                <span className="text-xs font-bold text-gray-700">{game.home_team_abbr}</span>
                                <img src={`/mascot-${game.home_team_abbr?.toLowerCase()}.png`} className="w-6 h-6 object-contain" onError={e => { e.target.style.display = 'none' }} alt="" />
                              </div>
                              <span className="text-[10px] text-gray-400">
                                Pick: <span className="font-bold text-navy">{getPredictedTeam(game)?.split(' ').pop()}</span>
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => setResults(r => ({ ...r, [game.id]: 'home' }))}
                                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all border ${currentVal === 'home' ? 'bg-navy text-white border-navy' : 'bg-white text-gray-600 border-gray-200 hover:border-navy/30'}`}
                              >{game.home_team_abbr} Won</button>
                              <button
                                onClick={() => setResults(r => ({ ...r, [game.id]: 'away' }))}
                                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all border ${currentVal === 'away' ? 'bg-navy text-white border-navy' : 'bg-white text-gray-600 border-gray-200 hover:border-navy/30'}`}
                              >{game.away_team_abbr} Won</button>
                              {currentVal && (
                                <button onClick={() => setResults(r => ({ ...r, [game.id]: '' }))} className="px-2.5 py-2 rounded-lg text-xs text-gray-400 border border-gray-200 hover:border-red/30 hover:text-red transition-colors" title="Clear">
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                            {isDirty && currentVal && (
                              <button
                                onClick={() => handleSaveOne(game)}
                                disabled={isSaving}
                                className="mt-2 w-full flex items-center justify-center gap-1.5 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors disabled:opacity-60"
                              >
                                {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : isSaved ? <Check className="w-3 h-3" /> : <Save className="w-3 h-3" />}
                                {isSaving ? 'Saving...' : isSaved ? 'Saved!' : 'Save'}
                              </button>
                            )}
                            {game.actual_result && !isDirty && (
                              <div className="mt-2 flex items-center gap-1.5 text-emerald-600 text-[10px] font-bold">
                                <Check className="w-3 h-3" />
                                Result recorded: {game.actual_result === 'home' ? game.home_team_abbr : game.away_team_abbr} won
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}

                {games.length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm font-semibold">No games found</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

const PredictionHistoryPage = () => {
  const { isAdmin } = useAuth()
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedDates, setExpandedDates] = useState({})

  const fetchGames = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error: err } = await supabase
        .from('nba_games')
        .select('*')
        .order('game_date', { ascending: false })
        .limit(300)
      if (err) throw err
      setGames(data || [])
      if (data && data.length > 0) setExpandedDates({ [data[0].game_date]: true })
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchGames() }, [fetchGames])

  const resolved = games.filter(g => g.actual_result)
  const correct = resolved.filter(g => getGameResult(g) === 'correct')
  const incorrect = resolved.filter(g => getGameResult(g) === 'incorrect')
  const accuracy = resolved.length > 0 ? Math.round((correct.length / resolved.length) * 100) : 0

  const byDate = games.reduce((acc, g) => {
    if (!acc[g.game_date]) acc[g.game_date] = []
    acc[g.game_date].push(g)
    return acc
  }, {})
  const dates = Object.keys(byDate).sort((a, b) => b.localeCompare(a))

  let streak = 0
  for (const date of dates) {
    const dayResolved = byDate[date].filter(g => g.actual_result)
    if (dayResolved.length === 0) continue
    const dayCorrect = dayResolved.filter(g => getGameResult(g) === 'correct')
    if (dayCorrect.length === dayResolved.length) streak++
    else break
  }

  const toggleDate = (date) => setExpandedDates(prev => ({ ...prev, [date]: !prev[date] }))

  return (
    <div className="min-h-screen bg-gray-50 pt-[70px]">
      <div className="bg-navy pt-12 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 px-3 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4">
              <Target className="w-3 h-3" /> Prediction Record
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-3">Our Prediction Record</h1>
            <p className="text-blue-200 text-lg max-w-xl leading-relaxed">
              Tracking every game since <span className="text-white font-bold">March 8, 2026</span> — the launch date of the final version of the Kynetics Engine™. Every prediction logged before tip-off, every result posted after the buzzer.
            </p>
            <div className="mt-5 bg-white/10 border border-white/20 rounded-xl px-4 py-3 max-w-xl">
              <p className="text-white/90 text-xs leading-relaxed">
                <span className="font-black text-white uppercase tracking-wide">⚠ Disclaimer — </span>
                The Kynetics Engine™ provides probability estimates based on publicly available data. No prediction is a guarantee. Sports outcomes are inherently uncertain — even an 85% probability means the other team wins 1 in 6 times. Use our analysis as an informational tool only, never as financial advice.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: <Target className="w-5 h-5 text-navy" />, label: 'Overall Accuracy', value: loading ? '—' : `${accuracy}%`, sub: `${correct.length} of ${resolved.length} correct`, highlight: true },
            { icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />, label: 'Correct Picks', value: loading ? '—' : correct.length, sub: 'All-time correct' },
            { icon: <XCircle className="w-5 h-5 text-red" />, label: 'Incorrect Picks', value: loading ? '—' : incorrect.length, sub: 'All-time incorrect' },
            { icon: <Flame className="w-5 h-5 text-orange-500" />, label: 'Current Streak', value: loading ? '—' : streak > 0 ? `${streak}d` : '—', sub: 'Consecutive perfect days' },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}
              className={`bg-white rounded-2xl p-5 shadow-sm border ${stat.highlight ? 'border-navy/20' : 'border-gray-100'}`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${stat.highlight ? 'bg-navy/10' : 'bg-gray-50'}`}>{stat.icon}</div>
              <div className={`text-3xl font-black mb-1 ${stat.highlight ? 'text-navy' : 'text-gray-900'}`}>{stat.value}</div>
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">{stat.label}</div>
              <div className="text-xs text-gray-300 mt-0.5">{stat.sub}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading && (
          <div className="flex items-center justify-center py-20 gap-3 text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin" /><span className="font-semibold">Loading history...</span>
          </div>
        )}
        {error && <div className="text-center py-20 text-red font-semibold">Error: {error}</div>}
        {!loading && !error && dates.length === 0 && (
          <div className="text-center py-20">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-400 font-semibold text-lg">No prediction history yet.</p>
            <p className="text-gray-300 text-sm mt-1">Check back after today's games.</p>
          </div>
        )}

        {!loading && dates.map((date, di) => {
          const dayGames = byDate[date]
          const dayResolved = dayGames.filter(g => g.actual_result)
          const dayCorrect = dayResolved.filter(g => getGameResult(g) === 'correct')
          const allPending = dayResolved.length === 0
          const isExpanded = expandedDates[date] ?? false

          return (
            <motion.div key={date} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(di * 0.04, 0.3) }} className="mb-4">
              <button onClick={() => toggleDate(date)} className="w-full flex items-center justify-between bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 hover:border-navy/20 transition-colors group">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-400 group-hover:text-navy transition-colors" />
                  <span className="font-black text-gray-900">{formatDate(date)}</span>
                  <span className="text-xs text-gray-400">{dayGames.length} game{dayGames.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center gap-3">
                  {!allPending ? (
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${dayCorrect.length === dayResolved.length ? 'bg-emerald-50 text-emerald-600' : dayCorrect.length === 0 ? 'bg-red/10 text-red' : 'bg-amber-50 text-amber-600'}`}>
                      {dayCorrect.length}/{dayResolved.length} correct
                    </span>
                  ) : (
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-gray-100 text-gray-400">Pending</span>
                  )}
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                    <div className="bg-white rounded-b-2xl border border-t-0 border-gray-100 shadow-sm overflow-hidden">
                      <div className="hidden md:grid grid-cols-12 gap-2 px-5 py-3 bg-gray-50 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <div className="col-span-4">Matchup</div>
                        <div className="col-span-3">Our Pick</div>
                        <div className="col-span-2 text-center">Confidence</div>
                        <div className="col-span-2">Actual Winner</div>
                        <div className="col-span-1 text-right">Result</div>
                      </div>
                      {dayGames.map((game, gi) => {
                        const result = getGameResult(game)
                        const confidence = getConfidence(game)
                        const isLast = gi === dayGames.length - 1
                        return (
                          <div key={game.id}>
                            <div className={`hidden md:grid grid-cols-12 gap-2 px-5 py-4 items-center ${!isLast ? 'border-b border-gray-50' : ''} hover:bg-gray-50/50 transition-colors`}>
                              <div className="col-span-4 flex items-center gap-2">
                                <img src={`/mascot-${game.away_team_abbr?.toLowerCase()}.png`} alt="" className="w-7 h-7 object-contain" onError={e => { e.target.style.display = 'none' }} />
                                <span className="text-xs font-bold text-gray-600">{game.away_team_abbr}</span>
                                <span className="text-[10px] text-gray-300 font-bold">@</span>
                                <span className="text-xs font-bold text-gray-600">{game.home_team_abbr}</span>
                                <img src={`/mascot-${game.home_team_abbr?.toLowerCase()}.png`} alt="" className="w-7 h-7 object-contain" onError={e => { e.target.style.display = 'none' }} />
                              </div>
                              <div className="col-span-3">
                                <span className="text-sm font-bold text-gray-800">{getPredictedTeam(game)?.split(' ').pop()}</span>
                                <div className="text-[10px] text-gray-400 mt-0.5">{Math.max(game.home_win_pct || 50, game.away_win_pct || 50)}% probability</div>
                              </div>
                              <div className="col-span-2 flex justify-center">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${confidence.color}`}>{confidence.label}</span>
                              </div>
                              <div className="col-span-2">
                                <span className="text-sm font-semibold text-gray-600">{getActualWinner(game)?.split(' ').pop()}</span>
                              </div>
                              <div className="col-span-1 flex justify-end"><ResultBadge result={result} /></div>
                            </div>
                            <div className={`md:hidden px-4 py-3.5 ${!isLast ? 'border-b border-gray-50' : ''}`}>
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <img src={`/mascot-${game.away_team_abbr?.toLowerCase()}.png`} alt="" className="w-6 h-6 object-contain" onError={e => { e.target.style.display = 'none' }} />
                                  <span className="text-xs font-bold text-gray-600">{game.away_team_abbr}</span>
                                  <span className="text-[10px] text-gray-300">@</span>
                                  <span className="text-xs font-bold text-gray-600">{game.home_team_abbr}</span>
                                  <img src={`/mascot-${game.home_team_abbr?.toLowerCase()}.png`} alt="" className="w-6 h-6 object-contain" onError={e => { e.target.style.display = 'none' }} />
                                </div>
                                <ResultBadge result={result} />
                              </div>
                              <div className="flex items-center justify-between text-[11px] text-gray-400">
                                <span>Pick: <span className="font-bold text-gray-700">{getPredictedTeam(game)?.split(' ').pop()}</span></span>
                                <span>Winner: <span className="font-bold text-gray-700">{getActualWinner(game)?.split(' ').pop()}</span></span>
                                <span className={`px-2 py-0.5 rounded-full font-bold ${confidence.color}`}>{confidence.label}</span>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}

        {!loading && games.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="mt-6 p-5 bg-navy/5 rounded-2xl border border-navy/10 flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-navy shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-navy mb-1">How this record works.</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Every prediction is published before tip-off and logged with a timestamp. Results are entered after the final buzzer and cannot be backdated. We show every game — correct and incorrect — from our first day of tracking, March 8, 2026. The Kynetics Engine™ is a probabilistic model, not a guarantee. Past accuracy does not predict future results.
              </p>
            </div>
          </motion.div>
        )}

        {/* GitHub verification section */}
        {!loading && games.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="mt-4 p-5 bg-gray-900 rounded-2xl flex items-start gap-4">
            {/* GitHub icon */}
            <div className="shrink-0 mt-0.5">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-white text-sm font-bold mb-1">Want to verify our predictions yourself?</p>
              <p className="text-gray-400 text-xs leading-relaxed mb-3">
                Every daily prediction JSON is published to our public GitHub repository before games tip off. Each file is cryptographically timestamped by GitHub — nobody can alter a past prediction without it being visible in the commit history. This is our proof of integrity.
              </p>
              <a
                href="https://github.com/andersongonzalez0602/kynetics-predictions"
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="inline-flex items-center gap-2 bg-white text-gray-900 px-4 py-2 rounded-lg text-xs font-bold hover:bg-gray-100 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                View prediction history on GitHub →
              </a>
            </div>
          </motion.div>
        )}
      </div>

      {isAdmin && <AdminResultsPanel games={games} onResultSaved={fetchGames} />}
    </div>
  )
}

export default PredictionHistoryPage
