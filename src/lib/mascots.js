// Mascot images live in /public/ named as mascot-{name}.png
// Maps team abbreviation to the filename

const ABBR_TO_FILE = {
  ATL: 'mascot-hawks',
  BOS: 'mascot-celtics',
  BKN: 'mascot-nets',
  CHA: 'mascot-hornets',
  CHI: 'mascot-bulls',
  CLE: 'mascot-cleveland',
  DAL: 'mascot-mavericks',
  DEN: 'mascot-nuggets',
  DET: 'mascot-pistons',
  GSW: 'mascot-warriors',
  HOU: 'mascot-houston',
  IND: 'mascot-pacers',
  LAC: 'mascot-clippers',
  LAL: 'mascot-lakers',
  MEM: 'mascot-grizzlies',
  MIA: 'mascot-heat',
  MIL: 'mascot-bucks',
  MIN: 'mascot-timberwolves',
  NOP: 'mascot-orleans',
  NYK: 'mascot-knicks',
  OKC: 'mascot-oklahoma',
  ORL: 'mascot-orlando',
  PHI: 'mascot-philadelphia',
  PHX: 'mascot-phoenix',
  POR: 'mascot-portland',
  SAC: 'mascot-sacramento',
  SAS: 'mascot-spurs',
  TOR: 'mascot-raptors',
  UTA: 'mascot-jazz',
  WAS: 'mascot-wizards',
}

export const getMascotUrl = (abbr) => {
  if (!abbr) return null
  const file = ABBR_TO_FILE[abbr.toUpperCase()]
  if (!file) return null
  return `/${file}.png`
}

const ALL_MASCOT_FILES = Object.values(ABBR_TO_FILE)

export const getRandomMascotUrl = () => {
  const file = ALL_MASCOT_FILES[Math.floor(Math.random() * ALL_MASCOT_FILES.length)]
  return `/${file}.png`
}
