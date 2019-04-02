import { Logger, LoggerCreationParams } from '@offirmo/practical-logger-interface'
import { createLogger as createLoggerCore } from '@offirmo-private/practical-logger-core'

import { sink } from './sink'

function createLogger(p: Readonly<LoggerCreationParams>): Logger {
	return createLoggerCore(p, sink)
}

export {
	Logger,
	LoggerCreationParams,
	createLogger,
}
