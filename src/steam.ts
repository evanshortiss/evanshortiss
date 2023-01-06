import * as qs from 'node:querystring'
import env from 'env-var'
import { GameDataForReadme } from './types'

const STEAM_API_KEY = env.get('STEAM_API_KEY').required().asString()
const STEAM_ID = env.get('STEAM_ID').required().asString()

export type SteamPlayerOwnedGames = {
  response: {
    game_count: number
    games: {
      appid: number
      playtime_forever: number
      playtime_windows_forever: number
      playtime_mac_forever: number
      playtime_linux_forever: number
      rtime_last_played: number
    }[]
  }
}

export type SteamGameAchievementsDetails = { 
  playerstats: {
    gameName: string
    achievements: {
      achieved: number
    }[]
  }
}

function getImageUrlForAppId (appid: number) {
  // https://gaming.stackexchange.com/a/359643
  return `https://steamcdn-a.akamaihd.net/steam/apps/${appid}/library_600x900.jpg`
}

export async function getSteamGameData (): Promise<GameDataForReadme[]> {
  const allOwnedGames = await fetchFromSteam<SteamPlayerOwnedGames>('/IPlayerService/GetOwnedGames/v1', {
    steamid: STEAM_ID,
  })

  const recentGames = allOwnedGames.response.games
    .sort((a, b) => {
      return a.rtime_last_played > b.rtime_last_played ? -1 : 1
    })
    .slice(0, 5)

  const gameDetails: GameDataForReadme[] = []

  for (let i = 0; i < recentGames.length; i++) {
    const game = recentGames[i]

    const achievements = await fetchFromSteam<SteamGameAchievementsDetails>('/ISteamUserStats/GetPlayerAchievements/v1', {
      appid: game.appid,
      steamid: STEAM_ID
    })

    const achievedCount = achievements.playerstats.achievements.reduce((total, current) => {
      // Achieved is a boolean represented using 0 or 1. Could 
      return current.achieved !== 0 ? total + 1 : total;
    }, 0)

    gameDetails.push({
      name: achievements.playerstats.gameName,
      iconUrl: getImageUrlForAppId(game.appid),
      platform: 'PC',
      progress: Math.round((achievedCount / achievements.playerstats.achievements.length) * 100),
      lastPlayed: new Date(game.rtime_last_played * 1000).toLocaleDateString()
    }) 
  }

  return gameDetails
}

async function fetchFromSteam<ApiResponseType>(url: string, queryparams: Record<string, string|number>) {
  const urlWithParams = `${url}/?${qs.encode({...queryparams, key: STEAM_API_KEY})}`
  const response = await fetch(
    new URL(
      urlWithParams,
      'https://api.steampowered.com'
    )
  )

  return response.json() as ApiResponseType
}
