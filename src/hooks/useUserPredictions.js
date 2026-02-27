import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/contexts/AuthContext'

export const useUserPredictions = () => {
  const { session, isLoggedIn } = useAuth()
  const [userVotes, setUserVotes] = useState({}) // { [game_id]: 'home' | 'away' }

  // Fetch all user votes for a list of game IDs
  const fetchUserVotes = useCallback(async (gameIds) => {
    if (!isLoggedIn || !session?.user?.id || !gameIds?.length) return

    const { data, error } = await supabase
      .from('user_predictions')
      .select('game_id, vote')
      .eq('user_id', session.user.id)
      .in('game_id', gameIds)

    if (!error && data) {
      const map = {}
      data.forEach(v => { map[v.game_id] = v.vote })
      setUserVotes(map)
    }
  }, [isLoggedIn, session?.user?.id])

  // Cast a vote — inserts into user_predictions AND increments community count
  const castVote = async (gameId, team) => {
    if (!isLoggedIn || !session?.user?.id) {
      return { success: false, needsAuth: true }
    }

    // Already voted?
    if (userVotes[gameId]) {
      return { success: false, alreadyVoted: true }
    }

    try {
      // 1. Insert user prediction
      const { error: insertError } = await supabase
        .from('user_predictions')
        .insert({
          user_id: session.user.id,
          game_id: gameId,
          vote: team,
        })

      if (insertError) {
        // Unique constraint = already voted
        if (insertError.code === '23505') {
          setUserVotes(prev => ({ ...prev, [gameId]: team }))
          return { success: false, alreadyVoted: true }
        }
        throw insertError
      }

      // 2. Increment community vote count on nba_games
      const field = team === 'home' ? 'community_votes_home' : 'community_votes_away'

      // Fetch current value first
      const { data: game } = await supabase
        .from('nba_games')
        .select(field)
        .eq('id', gameId)
        .single()

      if (game) {
        await supabase
          .from('nba_games')
          .update({ [field]: (game[field] || 0) + 1 })
          .eq('id', gameId)
      }

      // 3. Update local state
      setUserVotes(prev => ({ ...prev, [gameId]: team }))
      return { success: true }

    } catch (err) {
      return { success: false, message: err.message }
    }
  }

  return { userVotes, fetchUserVotes, castVote }
}
