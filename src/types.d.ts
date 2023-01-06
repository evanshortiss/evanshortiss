declare global {
  var fetch: typeof import('undici').fetch
}

export type GameDataForReadme = {
  iconUrl: string,
  platform: string,
  name: string,
  progress: number,
  lastPlayed: string
}