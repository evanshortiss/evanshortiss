export type EmulationStationMonthString = 'Jan'|'Feb'|'Mar'|'Apr'|'May'|'Jun'|'Jul'|'Aug'|'Sep'|'Oct'|'Nov'|'Dec'

export const MonthIndexesMap: Record<EmulationStationMonthString, number> = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11
}

// These are the platform names in the roms folder for RetroPie
export enum Platform {
  gb = 'gb',
  gbc = 'gbc',
  gba = 'gba',
  snes = 'snes',
  nes = 'nes',
  n64 = 'n64',
  psx = 'psx',
  segacd = 'segacd',
  sega32x = 'sega32x',
  megadrive = 'megadrive',
  genesis = 'genesis'
}

export type PlatformPretty = 'Game Boy'|'Game Boy Color'|'Game Boy Advance'|'SNES'|'NES'|'N64'|'PSX'|'Sega CD'|'Sega Mega Drive 32X'|'Sega Mega Drive'|'Sega Mega Drive'

export const PlatformMap: Record<Platform, PlatformPretty> = {
  gb: 'Game Boy',
  gbc: 'Game Boy Color',
  gba: 'Game Boy Advance',
  snes: 'SNES',
  nes: 'NES',
  n64: 'N64',
  psx: 'PSX',
  segacd: 'Sega CD',
  sega32x: 'Sega Mega Drive 32X',
  megadrive: 'Sega Mega Drive',
  genesis: 'Sega Mega Drive'
}

// Data indexes for game launch log lines 
export enum DataIndexes {
  DateMonth = 0,
  DateDate = 1,
  DateTime = 2,
  Platform = 7,
  GameStart = 8
}

type GameHistoryKey = `[${Platform}] ${string}`

export type GameHistory = {
  [key: GameHistoryKey]: Date
}