// Auto-commits prediction JSON to kynetics-predictions repo after results are saved

const GITHUB_TOKEN = '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'
const GITHUB_OWNER = 'andersongonzalez0602-svg'
const GITHUB_REPO = 'kynetics-predictions'
const BRANCH = 'main'

const buildJSON = (date, games) => {
  return {
    game_date: date,
    committed_at: new Date().toISOString(),
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
      result: {
        actual_result: g.actual_result || null,
        correct: g.actual_result
          ? (g.home_win_pct >= 50 ? 'home' : 'away') === g.actual_result
          : null,
      },
      meta: {
        game_time: g.game_time,
        is_featured: g.is_featured,
        is_value_pick: g.is_value_pick,
      }
    }))
  }
}

export const commitResultsToGitHub = async (date, games) => {
  try {
    const filePath = `${date.slice(0, 4)}/${date.slice(5, 7)}/${date}.json`
    const apiBase = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`

    const headers = {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    }

    // Check if file already exists to get its SHA (needed for updates)
    let existingSha = null
    try {
      const checkRes = await fetch(apiBase, { headers })
      if (checkRes.ok) {
        const existing = await checkRes.json()
        existingSha = existing.sha
      }
    } catch {
      // File doesn't exist yet — that's fine
    }

    const content = buildJSON(date, games)
    const contentBase64 = btoa(unescape(encodeURIComponent(JSON.stringify(content, null, 2))))

    const resolvedCount = games.filter(g => g.actual_result).length
    const correctCount = games.filter(g => {
      if (!g.actual_result) return false
      return (g.home_win_pct >= 50 ? 'home' : 'away') === g.actual_result
    }).length

    const body = {
      message: `Results ${date} — ${correctCount}/${resolvedCount} correct`,
      content: contentBase64,
      branch: BRANCH,
      ...(existingSha ? { sha: existingSha } : {}),
    }

    const res = await fetch(apiBase, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message || 'GitHub commit failed')
    }

    return { success: true }
  } catch (e) {
    console.error('GitHub commit error:', e)
    return { success: false, error: e.message }
  }
}
