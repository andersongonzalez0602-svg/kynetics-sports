import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'

export const useNBAGames = () => {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchGamesByDate = useCallback(async (date) => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: fetchError } = await supabase
        .from('nba_games')
        .select('*')
        .eq('game_date', date)
        .order('created_at', { ascending: true })

      if (fetchError) throw fetchError
      setGames(data || [])
    } catch (err) {
      console.error('Error fetching games:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const insertGames = async (gamesData) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('You must be logged in.')

      const { data, error: insertError } = await supabase
        .from('nba_games')
        .insert(gamesData)
        .select()

      if (insertError) throw insertError
      return { success: true, data }
    } catch (err) {
      console.error('Error inserting games:', err)
      return { success: false, error: err.message }
    }
  }

  const deleteGamesByDate = async (date) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('You must be logged in.')

      const { error: deleteError } = await supabase
        .from('nba_games')
        .delete()
        .eq('game_date', date)

      if (deleteError) throw deleteError
      setGames([])
      return { success: true }
    } catch (err) {
      console.error('Error deleting games:', err)
      return { success: false, error: err.message }
    }
  }

  return { games, loading, error, fetchGamesByDate, insertGames, deleteGamesByDate }
}
