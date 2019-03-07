
export {
	LogLevel,
	LogDetails,
	Logger,
} from '@offirmo/practical-logger-interface'

export {
	ALL_LOG_LEVELS,
	LEVEL_TO_INTEGER as LOG_LEVEL_TO_INTEGER,
	LEVEL_TO_HUMAN as LOG_LEVEL_TO_HUMAN,
	DEFAULT_LOG_LEVEL,
	DEFAULT_LOGGER_KEY,
} from './consts'

export { checkLevel } from './core'

import { create as createLogger } from './core'
export { createLogger }
