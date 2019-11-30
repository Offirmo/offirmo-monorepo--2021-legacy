import { getLogger } from '@offirmo/universal-debug-api-placeholder'

import { LIB } from '../consts'

////////////////////////////////////

export const logger = getLogger({
	name: LIB,
	suggestedLevel: 'warn',
})
logger.silly('Hello!')

export default logger
