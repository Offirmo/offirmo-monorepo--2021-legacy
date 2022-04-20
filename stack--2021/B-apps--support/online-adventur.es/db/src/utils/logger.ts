import { getLogger } from '@offirmo/universal-debug-api-placeholder'

import { LIB } from '../consts'

////////////////////////////////////

export const logger = getLogger({
	name: LIB,
	//suggestedLevel: 'silly',
	//suggestedLevel: 'log',
	//suggestedLevel: 'warn',
})
logger.info('@offirmo-private/db loaded', { logger_level: logger.getLevel() })

export default logger
