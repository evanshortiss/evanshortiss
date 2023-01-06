import env from "env-var";
import * as psn from 'psn-api'
import { GameDataForReadme } from "./types";

export async function getPsnGameData (): Promise<GameDataForReadme[]> {
  const PSN_NPSSO_TOKEN = env.get('PSN_NPSSO_TOKEN').required().asString()

  const accessCode = await psn.exchangeNpssoForCode(PSN_NPSSO_TOKEN)
  const authorization = await psn.exchangeCodeForAccessToken(accessCode)

  const trophies = await psn.getUserTitles(
    { accessToken: authorization.accessToken },
    'me'
  );

  return trophies.trophyTitles.slice(0, 5).map(game => {
    const totalTrophies = Object.values(game.definedTrophies).reduce((total, current) => total + current)
    const earnedTrophies = Object.values(game.earnedTrophies).reduce((total, current) => total + current)

    return {
      iconUrl: game.trophyTitleIconUrl,
      platform: game.trophyTitlePlatform,
      name: game.trophyTitleName,
      progress: Math.round((earnedTrophies / totalTrophies) * 100),
      lastPlayed: new Date(game.lastUpdatedDateTime).toLocaleDateString()
    }
  })
}