import env from "env-var";
import { writeFileSync } from "fs";
import * as psn from 'psn-api'
import { GameDataForReadme } from "./types";

export async function getPsnGameData (): Promise<GameDataForReadme[]> {
  const PSN_NPSSO_TOKEN = env.get('PSN_NPSSO_TOKEN').required().asString()

  const accessCode = await psn.exchangeNpssoForCode(PSN_NPSSO_TOKEN)
  const authorization = await psn.exchangeCodeForAccessToken(accessCode)

  const { data: { gameLibraryTitlesRetrieve: recentlyPlayedGames } } = await psn.getRecentlyPlayedGames(
    { accessToken: authorization.accessToken }
  )

  const trophies = await psn.getUserTitles(
    { accessToken: authorization.accessToken },
    'me'
  )

  return recentlyPlayedGames.games
    // Some games are marked as UNKNOWN. It appears that these are games 
    // downloaded or played by another user on the same console
    .filter(g => g.platform !== 'UNKNOWN')
    .slice(0, 5)
    .map(game => {
      // This is a kludgy method for matching a recently played title with ist
      // corresponding trophy data. The game list often has an extended name,
      // e.g "CRISIS CORE –FINAL FANTASY VII– REUNION" vs "CRISIS CORE –FINAL FANTASY VII– REUNION　PS4 & PS5"
      // Might need to be replaced with some approximate string matching algo
      const trophiesForGame = trophies.trophyTitles.find(t => game.name.includes(t.trophyTitleName))
      let progress!: number

      if (trophiesForGame) {
        const totalTrophies = Object.values(trophiesForGame.definedTrophies).reduce((total, current) => total + current)
        const earnedTrophies = Object.values(trophiesForGame.earnedTrophies).reduce((total, current) => total + current)

        progress = Math.round((earnedTrophies / totalTrophies) * 100)
      }

      return {
        iconUrl: game.image.url,
        platform: game.platform,
        name: game.name,
        progress,
        lastPlayed: new Date(game.lastPlayedDateTime).getTime()
      }
  })
}