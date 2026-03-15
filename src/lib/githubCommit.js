// Calls our Vercel API route — token never touches the browser

// Deduplicate games by home+away team combo before committing
const deduplicateGames = (games) => {
  const seen = new Set()
  return games.filter(g => {
    const key = `${g.home_team_abbr}_${g.away_team_abbr}_${g.game_date}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export const commitResultsToGitHub = async (date, games) => {
  try {
    const uniqueGames = deduplicateGames(games)
    const res = await fetch('/api/commit-results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, games: uniqueGames }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Commit failed')
    return { success: true }
  } catch (e) {
    console.error('[GitHub] commit error:', e)
    return { success: false, error: e.message }
  }
}

// Called when predictions are first published — proves predictions posted before games
export const commitPredictionsToGitHub = async (date, games) => {
  try {
    const uniqueGames = deduplicateGames(games)
    const res = await fetch('/api/commit-results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, games: uniqueGames, isPredictionCommit: true }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Commit failed')
    return { success: true }
  } catch (e) {
    console.error('[GitHub] prediction commit error:', e)
    return { success: false, error: e.message }
  }
}
