import { getLogger } from '@offirmo/universal-debug-api-placeholder'

import { LIB } from '../consts'

////////////////////////////////////

export const logger = getLogger({
	name: LIB,
	suggestedLevel: 'warn',
})
logger.info('@offirmo-private/db loaded, logger level = ' + logger.getLevel())

export default logger
