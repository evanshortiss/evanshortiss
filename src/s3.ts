import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getConfig } from "./config";
import { GameHistory } from "../emulation-station-log-parser/src/types";
import log from 'barelog'

export async function getRetroGameHistory (): Promise<GameHistory<string>> {
  const { S3_BUCKET_NAME: Bucket, S3_FILE_NAME: Key, S3_REGION: region } = getConfig(process.env)
  const s3 = new S3Client({ region });

  log(`Reading EmulationStation game history from file ${Key} S3 Bucket ${Bucket}`)
  
  try {
    const s3GetResponse = await s3.send(new GetObjectCommand({
      Bucket,
      Key
    }))

    const retroGameHistory = await s3GetResponse.Body?.transformToString()
    
    log('Fetched game history:', retroGameHistory)
    if (!retroGameHistory) {
      return {}
    } else {
      return JSON.parse(retroGameHistory) as GameHistory<string>
    }
  } catch (e) {
    log('Error fetching EmulationStation game history')
    log(e)

    return {}
  }

}
