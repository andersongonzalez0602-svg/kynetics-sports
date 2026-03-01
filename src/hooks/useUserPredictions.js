import { useState, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabaseClient'

export const useUserPredictions = () => {
  const [userVotes, setUserVotes] = useState({})
  // Use ref for session to avoid re-creating callbacks when auth state changes
  const sessionRef = useRef(null)

  // Call this from NBAPage whenever auth changes
  const setSession = useCallback((s) => {
    sessionRef.current = s
  }, [])

  const fetchUserVotes = useCallback(async (gameIds) => {
    const userId = sessionRef.current?.user?.id
    if (!userId || !gameIds?.length) { setUserVotes({}); return }

    try {
      const { data, error } = await supabase
        .from('user_predictions')
        .select('game_id, vote')
        .eq('user_id', userId)
        .in('game_id', gameIds)

      if (!error && data) {
        const map = {}
        data.forEach(v => { map[v.game_id] = v.vote })
        setUserVotes(map)
      }
    } catch {
      // Silent fail — votes just won't show
    }
  }, [])

  const castVote = async (gameId, team) => {
    const userId = sessionRef.current?.user?.id
    if (!userId) return { success: false, needsAuth: true }
    if (userVotes[gameId]) return { success: false, alreadyVoted: true }

    try {
      const { error: insertError } = await supabase
        .from('user_predictions')
        .insert({ user_id: userId, game_id: gameId, vote: team })

      if (insertError) {
        if (insertError.code === '23505') {
          setUserVotes(prev => ({ ...prev, [gameId]: team }))
          return { success: false, alreadyVoted: true }
        }
        throw insertError
      }

      // Increment community vote count
      const field = team === 'home' ? 'community_votes_home' : 'community_votes_away'
      const { data: game } = await supabase.from('nba_games').select(field).eq('id', gameId).single()
      if (game) {
        await supabase.from('nba_games').update({ [field]: (game[field] || 0) + 1 }).eq('id', gameId)
      }

      setUserVotes(prev => ({ ...prev, [gameId]: team }))
      return { success: true }
    } catch (err) {
      return { success: false, message: err.message }
    }
  }

  return { userVotes, fetchUserVotes, castVote, setSession }
}
