declare module 'npmtotal' {
  export type NpmTotalResult = {
    stats: [string, number][]
    sum: number
  }

  export default function (author: string, options?: { startDate?: string, endDate?: string }): Promise<NpmTotalResult>
}
