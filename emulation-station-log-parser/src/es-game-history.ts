import { readFileSync } from "fs"
import log from 'barelog'
import { DataIndexes, EmulationStationMonthString, GameHistory, MonthIndexesMap, Platform, PlatformMap } from "./types"

export function getGameHistory (filepath: string): GameHistory {

  log(`Reading EmulationStation logs from: ${filepath}`)

  const logContents = readFileSync(filepath, 'utf8')
  const gameLaunchLines = logContents
    .split('\n')
    .filter(line => line.match(/runcommand.sh/))


  const games = gameLaunchLines.map((line) => {
    const parts = line.split(' ')
    const now = new Date()
    
    const monthIdx = MonthIndexesMap[parts[DataIndexes.DateMonth] as EmulationStationMonthString]
    const hms = parts[DataIndexes.DateTime].split(':').map(s => parseInt(s))
    const date = new Date(Date.UTC(now.getFullYear(), monthIdx, parseInt(parts[DataIndexes.DateDate]), hms[0], hms[1], hms[2]))
    
    // The platform ID, e.g "psx" or "gbc"
    const platform = parts[DataIndexes.Platform]

    // Disgustingly lazy code to change "/home/pi/RetroPie/roms/psx/Metal\ Gear\ Solid\ \(USA\)\ \(Disc\ 2\).chd"
    // to a cleanly formatted "Metal Gear Solid"
    const game = parts
      .splice(DataIndexes.GameStart, parts.length - 1)
      .join(' ')
      .split(platform)[1]
      .split('(')[0]
      .replace('/', '')
      .replaceAll('\\', '')
      .trim()

      return {
        date,
        game,
        platform: platform as Platform,
      }
  })

  // Detect if an entry is from the prior year, and correct it. This is necessary
  // because logs don't contain the year! This assumes logs don't span more than
  // two years...so enable a cleanup cron for this file
  games.forEach((game, idx) => {
    const prevGame = games[idx - 1]

    // If the prior month index is larger than the current, then assume the
    // latest record is this year, and the previous is from the prior year.
    // e.g prior index is 11 (Dec) and this entry is 1 (Feb)
    if (idx !== 0 && game.date.getMonth() < prevGame.date.getMonth()) {
      prevGame.date.setFullYear(prevGame.date.getFullYear() - 1)
    }
  })

  return games.reduce((result, g) => {
    const { game, date, platform } = g

    result[`[${platform}] ${game}`] = date

    return result
  }, {} as GameHistory)
}

