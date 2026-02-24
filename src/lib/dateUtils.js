/**
 * Returns the current date in US Eastern timezone as YYYY-MM-DD.
 * Use this for NBA game dates so "today" doesn't flip to tomorrow at 8 PM local.
 */
export const getEasternDateString = () => {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  return formatter.format(new Date())
}
