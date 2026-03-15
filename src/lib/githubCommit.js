// Calls our own Vercel API route — token never touches the browser

export const commitResultsToGitHub = async (date, games) => {
  try {
    const res = await fetch('/api/commit-results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, games }),
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Commit failed')
    return { success: true }
  } catch (e) {
    console.error('[GitHub] commit error:', e)
    return { success: false, error: e.message }
  }
}
