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
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const insertGames = async (gamesData) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('You must be logged in.')
      const { data, error } = await supabase.from('nba_games').insert(gamesData).select()
      if (error) throw error
      return { success: true, data }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const deleteGamesByDate = async (date) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('You must be logged in.')
      const { error } = await supabase.from('nba_games').delete().eq('game_date', date)
      if (error) throw error
      setGames([])
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const deleteGame = async (gameId) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('You must be logged in.')
      const { error } = await supabase.from('nba_games').delete().eq('id', gameId)
      if (error) throw error
      setGames(prev => prev.filter(g => g.id !== gameId))
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const updateMascotImage = async (gameId, team, file) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('You must be logged in.')

      const ext = file.name.split('.').pop()
      const path = `${gameId}/${team}_${Date.now()}.${ext}`

      const { error: upErr } = await supabase.storage
        .from('mascot-images')
        .upload(path, file, { upsert: true })
      if (upErr) throw upErr

      const { data: { publicUrl } } = supabase.storage
        .from('mascot-images')
        .getPublicUrl(path)

      const field = team === 'home' ? 'home_team_mascot_image' : 'away_team_mascot_image'
      const { error: dbErr } = await supabase
        .from('nba_games')
        .update({ [field]: publicUrl })
        .eq('id', gameId)
      if (dbErr) throw dbErr

      setGames(prev => prev.map(g => g.id === gameId ? { ...g, [field]: publicUrl } : g))
      return { success: true, url: publicUrl }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const voteForTeam = async (gameId, team) => {
    try {
      const field = team === 'home' ? 'community_votes_home' : 'community_votes_away'
      const game = games.find(g => g.id === gameId)
      if (!game) throw new Error('Game not found')

      const newVal = (game[field] || 0) + 1
      const { error } = await supabase
        .from('nba_games')
        .update({ [field]: newVal })
        .eq('id', gameId)
      if (error) throw error

      setGames(prev => prev.map(g => g.id === gameId ? { ...g, [field]: newVal } : g))
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  return {
    games, loading, error,
    fetchGamesByDate, insertGames,
    deleteGamesByDate, deleteGame,
    updateMascotImage, voteForTeam
  }
}
