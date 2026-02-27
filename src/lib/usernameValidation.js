// Blocked words — profanity, slurs, impersonation, reserved terms
const BLOCKED_WORDS = [
  // Reserved / impersonation
  'admin', 'administrator', 'kynetics', 'kyneticssports', 'moderator', 'mod',
  'support', 'official', 'staff', 'system', 'root', 'superuser', 'helpdesk',
  'nba', 'espn', 'sports',
  // Profanity (English)
  'fuck', 'shit', 'ass', 'bitch', 'dick', 'cock', 'pussy', 'cunt',
  'nigger', 'nigga', 'faggot', 'fag', 'retard', 'whore', 'slut',
  // Profanity (Spanish)
  'puta', 'puto', 'mierda', 'verga', 'coño', 'pendejo', 'pendeja',
  'cabron', 'cabrón', 'marica', 'maricon', 'maricón', 'joder', 'culo',
  'chinga', 'pinche', 'malparido', 'hijueputa', 'gonorrea',
]

// Check if username contains any blocked word
const containsBlockedWord = (username) => {
  const lower = username.toLowerCase().replace(/[_\-\.0-9]/g, '')
  return BLOCKED_WORDS.some(word => lower.includes(word))
}

/**
 * Validate a username
 * @returns {{ valid: boolean, error?: string }}
 */
export const validateUsername = (username) => {
  if (!username || typeof username !== 'string') {
    return { valid: false, error: 'username_required' }
  }

  const trimmed = username.trim()

  if (trimmed.length < 3) {
    return { valid: false, error: 'username_too_short' }
  }

  if (trimmed.length > 15) {
    return { valid: false, error: 'username_too_long' }
  }

  // Only letters, numbers, underscores
  if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
    return { valid: false, error: 'username_invalid_chars' }
  }

  // Must start with a letter
  if (!/^[a-zA-Z]/.test(trimmed)) {
    return { valid: false, error: 'username_must_start_letter' }
  }

  // No consecutive underscores
  if (/__/.test(trimmed)) {
    return { valid: false, error: 'username_no_double_underscore' }
  }

  // Blocked words check
  if (containsBlockedWord(trimmed)) {
    return { valid: false, error: 'username_blocked' }
  }

  return { valid: true }
}
