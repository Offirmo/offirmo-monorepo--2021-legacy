import { create as createLogger } from './core'
export { createLogger }

export {
	LogLevel,
	LogDetails,
	Logger,
} from '@offirmo/practical-logger-interface'

export {
	ALL_LOG_LEVELS,
	LOG_LEVEL_TO_INTEGER,
	LOG_LEVEL_TO_HUMAN,
	DEFAULT_LOG_LEVEL,
	DEFAULT_LOGGER_KEY,
} from './consts'

export { checkLevel } from './core'
export * from './normalize-args'

