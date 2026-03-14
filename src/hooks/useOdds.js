import { useState, useEffect, useRef } from 'react'

const ODDS_API_KEY = '5ccc38dc0edb2db37995346f6fb4ebd0'
const CACHE_DURATION = 10 * 60 * 1000 // 10 minutes — saves API quota
const cache = { data: null, ts: 0 }

// Convert American moneyline to implied probability %
export const moneylineToProb = (ml) => {
  if (!ml) return null
  const n = Number(ml)
  if (isNaN(n)) return null
  if (n > 0) return Math.round((100 / (n + 100)) * 100)
  return Math.round((Math.abs(n) / (Math.abs(n) + 100)) * 100)
}

// Format moneyline for display: -110 → "-110" | +105 → "+105"
export const fmtML = (ml) => {
  if (!ml) return null
  const n = Number(ml)
  if (isNaN(n)) return null
  return n > 0 ? `+${n}` : `${n}`
}

// Match Odds API team name to our abbreviation
const NAME_TO_ABBR = {
  'Atlanta Hawks': 'ATL', 'Boston Celtics': 'BOS', 'Brooklyn Nets': 'BKN',
  'Charlotte Hornets': 'CHA', 'Chicago Bulls': 'CHI', 'Cleveland Cavaliers': 'CLE',
  'Dallas Mavericks': 'DAL', 'Denver Nuggets': 'DEN', 'Detroit Pistons': 'DET',
  'Golden State Warriors': 'GSW', 'Houston Rockets': 'HOU', 'Indiana Pacers': 'IND',
  'LA Clippers': 'LAC', 'Los Angeles Clippers': 'LAC', 'Los Angeles Lakers': 'LAL',
  'Memphis Grizzlies': 'MEM', 'Miami Heat': 'MIA', 'Milwaukee Bucks': 'MIL',
  'Minnesota Timberwolves': 'MIN', 'New Orleans Pelicans': 'NOP', 'New York Knicks': 'NYK',
  'Oklahoma City Thunder': 'OKC', 'Orlando Magic': 'ORL', 'Philadelphia 76ers': 'PHI',
  'Phoenix Suns': 'PHX', 'Portland Trail Blazers': 'POR', 'Sacramento Kings': 'SAC',
  'San Antonio Spurs': 'SAS', 'Toronto Raptors': 'TOR', 'Utah Jazz': 'UTA',
  'Washington Wizards': 'WAS',
}

export const useOdds = () => {
  const [oddsMap, setOddsMap] = useState({}) // { 'HOME_ABBR_AWAY_ABBR': { homeML, awayML, homeProb, awayProb } }
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const fetchedRef = useRef(false)

  useEffect(() => {
    if (fetchedRef.current) return
    fetchedRef.current = true

    const fetchOdds = async () => {
      // Use cache if fresh
      if (cache.data && Date.now() - cache.ts < CACHE_DURATION) {
        setOddsMap(cache.data)
        return
      }

      setLoading(true)
      try {
        const res = await fetch(
          `https://api.the-odds-api.com/v4/sports/basketball_nba/odds/?apiKey=${ODDS_API_KEY}&regions=us&markets=h2h&oddsFormat=american&bookmakers=draftkings`
        )
        if (!res.ok) throw new Error(`Odds API error: ${res.status}`)
        const data = await res.json()

        const map = {}
        data.forEach(game => {
          const bk = game.bookmakers?.[0]
          if (!bk) return
          const market = bk.markets?.find(m => m.key === 'h2h')
          if (!market) return

          // home_team and away_team from API
          const homeAbbr = NAME_TO_ABBR[game.home_team]
          const awayAbbr = NAME_TO_ABBR[game.away_team]
          if (!homeAbbr || !awayAbbr) return

          const homeOdds = market.outcomes?.find(o => NAME_TO_ABBR[o.name] === homeAbbr)?.price
          const awayOdds = market.outcomes?.find(o => NAME_TO_ABBR[o.name] === awayAbbr)?.price

          if (!homeOdds && !awayOdds) return

          const homeProb = moneylineToProb(homeOdds)
          const awayProb = moneylineToProb(awayOdds)

          const key = `${homeAbbr}_${awayAbbr}`
          map[key] = {
            homeML: homeOdds,
            awayML: awayOdds,
            homeProb,
            awayProb,
          }
        })

        cache.data = map
        cache.ts = Date.now()
        setOddsMap(map)
      } catch (e) {
        setError(e.message)
        // Fail silently — odds are a bonus feature, not critical
      } finally {
        setLoading(false)
      }
    }

    fetchOdds()
  }, [])

  // Look up odds for a specific game
  const getGameOdds = (homeAbbr, awayAbbr) => {
    if (!homeAbbr || !awayAbbr) return null
    return oddsMap[`${homeAbbr}_${awayAbbr}`] || null
  }

  return { oddsMap, loading, error, getGameOdds }
}
