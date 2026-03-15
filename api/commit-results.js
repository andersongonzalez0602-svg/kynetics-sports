// Vercel Serverless Function — lives at /api/commit-results
// GITHUB_TOKEN env var is server-side only (no VITE_ prefix)

const GITHUB_OWNER = 'andersongonzalez0602-svg'
const GITHUB_REPO = 'kynetics-predictions'
const BRANCH = 'main'

const buildJSON = (date, games, isPredictionCommit) => ({
  game_date: date,
  published_at: new Date().toISOString(),
  type: isPredictionCommit ? 'predictions' : 'results',
  games: games.map(g => ({
    home: {
      name: g.home_team_name,
      abbr: g.home_team_abbr,
      record: g.home_team_record,
      color: g.home_team_color,
      streak: g.home_streak,
      last5: g.home_last5,
    },
    away: {
      name: g.away_team_name,
      abbr: g.away_team_abbr,
      record: g.away_team_record,
      color: g.away_team_color,
      streak: g.away_streak,
      last5: g.away_last5,
    },
    prediction: {
      home_win_pct: g.home_win_pct,
      away_win_pct: g.away_win_pct,
      reason: g.reason_text,
      reason_es: g.reason_text_es,
      head_to_head: g.head_to_head,
    },
    result: isPredictionCommit ? null : {
      actual_result: g.actual_result || null,
      correct: g.actual_result
        ? (g.home_win_pct >= 50 ? 'home' : 'away') === g.actual_result
        : null,
    },
    meta: {
      game_time: g.game_time,
      is_featured: g.is_featured,
      is_value_pick: g.is_value_pick,
    },
  })),
})

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const token = process.env.GITHUB_TOKEN
  if (!token) {
    return res.status(500).json({ error: 'GitHub token not configured on server' })
  }

  const { date, games, isPredictionCommit } = req.body
  if (!date || !games) {
    return res.status(400).json({ error: 'Missing date or games' })
  }

  try {
    // Use separate files: predictions/2026/03/2026-03-15.json vs results/2026/03/2026-03-15.json
    const folder = isPredictionCommit ? 'predictions' : 'results'
    const filePath = `${folder}/${date.slice(0, 4)}/${date.slice(5, 7)}/${date}.json`
    const apiBase = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`

    const headers = {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    }

    // Check if file exists (need SHA for updates)
    let existingSha = null
    try {
      const checkRes = await fetch(apiBase, { headers })
      if (checkRes.ok) {
        const existing = await checkRes.json()
        existingSha = existing.sha
      }
    } catch {
      // File doesn't exist yet — fine
    }

    const content = buildJSON(date, games, isPredictionCommit)
    const contentBase64 = btoa(unescape(encodeURIComponent(JSON.stringify(content, null, 2))))

    let commitMessage
    if (isPredictionCommit) {
      commitMessage = `Predictions ${date} — ${games.length} game${games.length !== 1 ? 's' : ''} published before tip-off`
    } else {
      const resolvedCount = games.filter(g => g.actual_result).length
      const correctCount = games.filter(g => {
        if (!g.actual_result) return false
        return (g.home_win_pct >= 50 ? 'home' : 'away') === g.actual_result
      }).length
      commitMessage = `Results ${date} — ${correctCount}/${resolvedCount} correct`
    }

    const body = {
      message: commitMessage,
      content: contentBase64,
      branch: BRANCH,
      ...(existingSha ? { sha: existingSha } : {}),
    }

    const putRes = await fetch(apiBase, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    })

    if (!putRes.ok) {
      const err = await putRes.json()
      throw new Error(err.message || 'GitHub API error')
    }

    return res.status(200).json({ success: true })
  } catch (e) {
    console.error('[commit-results]', e)
    return res.status(500).json({ success: false, error: e.message })
  }
}
