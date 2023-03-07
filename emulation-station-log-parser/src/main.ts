import log from 'barelog'
import { getConfig } from "./config";
import { getGameHistory } from './es-game-history'
import { updateGameHistory } from "./s3";

async function main () {
  const config = getConfig(process.env)
  const history = getGameHistory(config.ES_LOG_FILEPATH)

  log('Game history parsed from EmulationStation logs:', JSON.stringify(history, null, 2))

  try {
    await updateGameHistory(config, history)
  } catch (e) {
    log('Error updating game history in S3. Error was:')
    log(e)
  }
}

main()