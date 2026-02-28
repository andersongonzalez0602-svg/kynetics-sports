const BLOCKED_WORDS = [
  'admin','administrator','kynetics','kyneticssports','moderator','mod','support','official','staff','system','root','superuser','helpdesk','nba','espn','sports',
  'fuck','shit','ass','bitch','dick','cock','pussy','cunt','nigger','nigga','faggot','fag','retard','whore','slut',
  'puta','puto','mierda','verga','coño','pendejo','pendeja','cabron','cabrón','marica','maricon','maricón','joder','culo','chinga','pinche','malparido','hijueputa','gonorrea',
]

const containsBlockedWord = (username) => {
  const lower = username.toLowerCase().replace(/[_\-\.0-9]/g, '')
  return BLOCKED_WORDS.some(word => lower.includes(word))
}

export const validateUsername = (username) => {
  if (!username || typeof username !== 'string') return { valid: false, error: 'username_required' }
  const t = username.trim()
  if (t.length < 3) return { valid: false, error: 'username_too_short' }
  if (t.length > 15) return { valid: false, error: 'username_too_long' }
  if (!/^[a-zA-Z0-9_]+$/.test(t)) return { valid: false, error: 'username_invalid_chars' }
  if (!/^[a-zA-Z]/.test(t)) return { valid: false, error: 'username_must_start_letter' }
  if (/__/.test(t)) return { valid: false, error: 'username_no_double_underscore' }
  if (containsBlockedWord(t)) return { valid: false, error: 'username_blocked' }
  return { valid: true }
}
