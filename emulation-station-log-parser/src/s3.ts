import { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsCommand, S3ServiceException, NoSuchKey } from "@aws-sdk/client-s3";
import { ApplicationConfig } from "./config";
import { GameHistory } from "./types";
import log from 'barelog'

export async function updateGameHistory (config: ApplicationConfig, latestHistory: GameHistory ) {
  const { S3_BUCKET_NAME: Bucket, S3_FILE_NAME: Key, S3_REGION: region } = config
  
  const s3 = new S3Client({ region });

  // Get existing history, and merge with the latest. The more recent history takes precedence
  const existingRecords = await getExistingGameHistory(s3, { Bucket, Key })
  const updatedRecords = { ...existingRecords, ...latestHistory }

  log('Updating game history in S3. New history is:', JSON.stringify(updatedRecords, null, 2))

  await s3.send(new PutObjectCommand({
    Bucket,
    Key,
    Body: JSON.stringify(updatedRecords)
  }))
}

async function getExistingGameHistory (s3: S3Client, params: { Bucket: string, Key: string }): Promise<GameHistory> {
  try {
    const existingHistory = await s3.send(new GetObjectCommand(params))
    
    if (existingHistory.Body) {
      const data = await existingHistory.Body.transformToString()
  
      return JSON.parse(data) as GameHistory
    } else {
      // If there's no existing history, just return an empty record
      return {}
    }
  } catch (e) {
    if (e instanceof NoSuchKey) {
      log(`S3 bucket did not contain ${params.Key}. Returning empty dictionary for existing history.`)
      return {}
    } else {
      throw e
    }
  }

}