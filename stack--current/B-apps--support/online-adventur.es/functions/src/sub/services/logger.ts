import { getLogger } from '@offirmo/universal-debug-api-node'

import { APP } from '../consts'
import { CHANNEL } from './channel'

/////////////////////////////////////////////////

const logger = getLogger({
	name: APP,
	suggestedLevel: CHANNEL === 'dev' ? 'silly' : 'warning',
})

console.log('\n\n')
logger.info(`❄️ Cold start of "${APP}"`, { logger_level: logger.getLevel(), CHANNEL, __filename })
//logger.info('ENV', process.env)

export default logger
