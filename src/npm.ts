import { writeFileSync } from 'fs'
import npmtotal from 'npmtotal'

export default async function getNpmDownloads () {
  // Get data for the last 5 years
  const startDate = new Date()
  startDate.setFullYear(startDate.getFullYear() - 5)

  const result = await npmtotal('evanshortiss', {
    startDate: startDate.toJSON().slice(0, 10) // e.g 2016-01-01
  })

  writeFileSync('npm-stats.json', JSON.stringify({
    schemaVersion: 1,
    label: 'npm',
    message: `${result.sum.toLocaleString()} Downloads`,
    color: 'orange',
    namedLogo: 'npm'
  }))
}
