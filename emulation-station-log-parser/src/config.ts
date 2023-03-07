import { from } from 'env-var'

export type ApplicationConfig = {
  S3_BUCKET_NAME: string
  S3_FILE_NAME: string
  ES_LOG_FILEPATH: string
  S3_REGION: string
}

export function getConfig (variables: NodeJS.ProcessEnv): ApplicationConfig {
  const { get } = from(variables) 

  return {
    ES_LOG_FILEPATH: get('ES_LOG_FILEPATH').default('/var/lib/.emulationstation/es_log.txt').asString(),

    S3_BUCKET_NAME: get('S3_BUCKET_NAME').default('emulation-station-records').asString(),
    S3_FILE_NAME: get('S3_FILE_NAME').default('game-history.json').asString(),
    S3_REGION: get('S3_REGION').default('us-west-1').asString()
  }
}