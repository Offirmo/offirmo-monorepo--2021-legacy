import { getLogger } from '@offirmo/universal-debug-api-node'

import { APP } from '../consts'
import { CHANNEL } from './channel'

/////////////////////////////////////////////////

process.env.UDA_OVERRIDE__LOGGER_OA_DB_LOGLEVEL= process.env.UDA_OVERRIDE__LOGGER_OA_DB_LOGLEVEL || "silly"

const logger = getLogger({
	name: APP,
	suggestedLevel: CHANNEL === 'dev' ? 'silly' : 'warning',
})

console.log('\n\n')
logger.info(`❄️ Cold start of "${APP}", logger level = ${logger.getLevel()}.`)
logger.info(`❄️ Cold start of "${APP}", channel = ${CHANNEL}.`)


export default logger
