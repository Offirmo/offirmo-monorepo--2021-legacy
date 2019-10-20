import { createLogger as create_core } from '@offirmo/practical-logger-core'
import { createLogger as create_node } from '@offirmo/practical-logger-node'

import { APP } from '../consts'
import { CHANNEL } from './channel'

/////////////////////////////////////////////////

//const logger = (CHANNEL === 'dev' ? create_node : create_core)({
const logger = create_node({
	name: APP,
	suggestedLevel: CHANNEL === 'dev' ? 'silly' : 'warning',
})

console.log('\n\n')
logger.info(`❄️ Cold start of "${APP}", logger level = ${logger.getLevel()}.`)


export default logger
