import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings, X, Upload, Trash2, Eye, Check, AlertCircle, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useNBAGames } from '@/hooks/useNBAGames'

const AdminJSONPanel = ({ onGamesUpdated, currentDate }) => {
  const { isAdmin } = useAuth()
  const { insertGames, deleteGamesByDate } = useNBAGames()
  const [isOpen, setIsOpen] = useState(false)
  const [jsonInput, setJsonInput] = useState('')
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [loading, setLoading] = useState(false)
  const [deleteDate, setDeleteDate] = useState(currentDate)

  if (!isAdmin) return null

  const handlePreview = () => {
    setError(null); setSuccess(null)
    try {
      const parsed = JSON.parse(jsonInput)
      if (!parsed.game_date || !parsed.games || !Array.isArray(parsed.games)) throw new Error('Need "game_date" and "games" array.')
      const rows = parsed.games.map(g => ({
        game_date: parsed.game_date, game_time: g.game_time||'TBD', status: g.status||'upcoming',
        is_value_pick: g.is_value_pick||false, is_featured: g.is_featured||false,
        home_team_name: g.home?.name||'', home_team_abbr: g.home?.abbr||'', home_team_record: g.home?.record||'',
        home_team_color: g.home?.color||'#1D428A', home_team_mascot_name: g.home?.mascot_name||'',
        away_team_name: g.away?.name||'', away_team_abbr: g.away?.abbr||'', away_team_record: g.away?.record||'',
        away_team_color: g.away?.color||'#333333', away_team_mascot_name: g.away?.mascot_name||'',
        home_win_pct: g.prediction?.home_win_pct||50, away_win_pct: g.prediction?.away_win_pct||50,
        data_points: g.prediction?.data_points||0, home_streak: g.home?.streak||'', away_streak: g.away?.streak||'',
        head_to_head: g.prediction?.head_to_head||'', reason_text: g.prediction?.reason||'',
        reason_text_es: g.prediction?.reason_es||'',
        community_votes_home: 0, community_votes_away: 0,
      }))
      setPreview(rows)
    } catch (err) { setError(err.message); setPreview(null) }
  }

  const handlePublish = async () => {
    if (!preview) return
    setLoading(true); setError(null)
    const result = await insertGames(preview)
    if (result.success) { setSuccess(`${preview.length} games published!`); setPreview(null); setJsonInput(''); onGamesUpdated?.() }
    else setError(result.error)
    setLoading(false)
  }

  const handleDelete = async () => {
    if (!deleteDate || !window.confirm(`Delete ALL games for ${deleteDate}?`)) return
    setLoading(true); setError(null)
    const result = await deleteGamesByDate(deleteDate)
    if (result.success) { setSuccess(`Deleted.`); onGamesUpdated?.() } else setError(result.error)
    setLoading(false)
  }

  return (
    <>
      <motion.button whileHover={{ scale:1.1 }} whileTap={{ scale:0.9 }} onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-navy text-white rounded-full shadow-lg shadow-navy/30 flex items-center justify-center hover:bg-navy-dark transition-colors">
        <Settings className="w-6 h-6" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="fixed inset-0 z-[80] bg-black/50 flex justify-end" onClick={() => setIsOpen(false)}>
            <motion.div initial={{ x:'100%' }} animate={{ x:0 }} exit={{ x:'100%' }} transition={{ type:'spring', damping:25, stiffness:200 }}
              className="w-full max-w-lg bg-white h-full overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="bg-navy p-6 flex items-center justify-between sticky top-0 z-10">
                <div><h2 className="text-white text-xl font-bold">Game Manager</h2><p className="text-blue-200 text-sm">Upload and manage NBA games</p></div>
                <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white"><X className="w-6 h-6" /></button>
              </div>
              <div className="p-6 flex flex-col gap-6">
                {error && <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm"><AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />{error}</div>}
                {success && <div className="flex items-start gap-2 bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg text-sm"><Check className="w-4 h-4 mt-0.5 shrink-0" />{success}</div>}

                <div>
                  <label className="text-sm font-bold text-gray-700 mb-2 block">Paste Game JSON</label>
                  <textarea value={jsonInput} onChange={e => { setJsonInput(e.target.value); setError(null); setSuccess(null) }}
                    placeholder='{"game_date":"2026-02-22","games":[...]}'
                    className="w-full h-48 p-4 font-mono text-xs border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-navy focus:outline-none resize-none" />
                  <button onClick={handlePreview} disabled={!jsonInput.trim()}
                    className="mt-3 w-full flex items-center justify-center gap-2 bg-navy text-white py-3 rounded-xl font-bold hover:bg-navy-dark transition-colors disabled:opacity-40">
                    <Eye className="w-4 h-4" /> Preview Games
                  </button>
                </div>

                {preview && (
                  <div>
                    <h3 className="text-sm font-bold text-gray-700 mb-3">Preview — {preview.length} game{preview.length!==1?'s':''}</h3>
                    <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
                      {preview.map((g,i) => (
                        <div key={i} className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-lg p-3">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded" style={{ backgroundColor:g.home_team_color }} />
                            <span className="text-sm font-bold">{g.home_team_abbr}</span>
                            <span className="text-gray-400 text-xs">vs</span>
                            <div className="w-6 h-6 rounded" style={{ backgroundColor:g.away_team_color }} />
                            <span className="text-sm font-bold">{g.away_team_abbr}</span>
                          </div>
                          <span className="text-xs text-gray-500">{g.game_time}</span>
                        </div>
                      ))}
                    </div>
                    <button onClick={handlePublish} disabled={loading}
                      className="mt-3 w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors disabled:opacity-60">
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      {loading ? 'Publishing...' : 'Publish Games'}
                    </button>
                  </div>
                )}

                <div className="border-t border-gray-200" />
                <div>
                  <h3 className="text-sm font-bold text-gray-700 mb-3">Delete Games by Date</h3>
                  <div className="flex gap-2">
                    <input type="date" value={deleteDate} onChange={e => setDeleteDate(e.target.value)}
                      className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-navy focus:outline-none" />
                    <button onClick={handleDelete} disabled={loading}
                      className="flex items-center gap-2 bg-red-50 text-red-600 border border-red-200 px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-red-100 transition-colors disabled:opacity-60">
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-700 mb-2">Mascot Images</h3>
                  <p className="text-xs text-gray-500 mb-3">Put mascot images in <code className="bg-gray-100 px-1.5 py-0.5 rounded text-navy font-mono">public/mascots/</code> named by team abbreviation. They load automatically.</p>
                  <p className="text-xs text-gray-400">Example: <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono">HOU.png</code>, <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono">BKN.png</code>, <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono">LAC.png</code></p>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-700 mb-2">JSON Template</h3>
                  <pre className="bg-gray-900 text-green-400 text-xs p-4 rounded-xl overflow-x-auto">
{`{
  "game_date": "2026-02-22",
  "games": [
    {
      "game_time": "7:00 PM EST",
      "status": "upcoming",
      "is_value_pick": false,
      "is_featured": true,
      "home": {
        "name": "Houston Rockets",
        "abbr": "HOU",
        "record": "35-18",
        "color": "#CE1141",
        "mascot_name": "Bear",
        "streak": "W4"
      },
      "away": {
        "name": "Brooklyn Nets",
        "abbr": "BKN",
        "record": "22-30",
        "color": "#000000",
        "mascot_name": "Knight",
        "streak": "L2"
      },
      "prediction": {
        "home_win_pct": 72,
        "away_win_pct": 28,
        "data_points": 48,
        "head_to_head": "Rockets 2-0",
        "reason": "HOU 4-game win streak at home. BKN 3-9 in last 12 away.",
        "reason_es": "HOU racha de 4 victorias en casa. BKN 3-9 en últimos 12 de visitante."
      }
    }
  ]
}`}
                  </pre>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default AdminJSONPanel
