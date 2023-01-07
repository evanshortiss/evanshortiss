import { getPsnGameData } from "./psn"
import { getSteamGameData } from "./steam"

async function generateRecentGameHtml () {
  const { markdownTable } = await import('markdown-table')
  const gameData = await Promise.all([
    getPsnGameData(),
    getSteamGameData()
  ])
  
  const games = gameData[0].concat(gameData[1])
    .sort((a, b) => {
      return new Date(a.lastPlayed) > new Date(b.lastPlayed) ? -1 : 1
    })

  return markdownTable(
    [
      ['Game', 'Platform', 'Achievements', 'Last Played']
    ]
    .concat(games.map(game => {
      return [game.name, game.platform, `${game.progress}%`, formatLastPlayed(game.lastPlayed)]
    })),
    {align: ['l', 'l', 'l', 'r']}
  )
}

function formatLastPlayed (datetime: number) {
  const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;
  const now = Date.now()

  if (now - datetime <= ONE_WEEK) {
    return 'This week'
  } else {
    const date = new Date(datetime)
    return `${date.getMonth() + 1}/${date.getFullYear()}`
  }
}

export default async function generateReadme () {
  const recentGamesHtml = await generateRecentGameHtml()


  return `
  # 🖖 Hi! I'm Evan.

  I work as a Developer Advocate at Red Hat. I live in Los Angeles 🇺🇸, though I was born and raised in Ireland 🇮🇪. 

  ### 🎮 What I'm Playing 

  Here's an autogenerated list of games I've been playing recently, along with the respective percentage of trophies/achievements I've collected in that game.

  ${recentGamesHtml}

  ⏰ Last updated: ${new Date().toISOString()}
  `
}