import { getLogger } from '@offirmo/universal-debug-api-placeholder'

import { LIB, game_frame } from './consts'

export const logger = getLogger({
	name: LIB,
	suggestedLevel: 'warn',
})
logger.log('Starting the game frame...', game_frame)

export default logger
