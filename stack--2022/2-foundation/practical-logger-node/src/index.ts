import { Logger, LoggerCreationParams, BaseSinkOptions } from '@offirmo/practical-logger-types'
import { createLogger as createLoggerCore } from '@offirmo/practical-logger-core'

import { SinkOptions } from './types'
import createSink from './sinks/to-console'

const ORIGINAL_CONSOLE = console


function createLogger(p: Readonly<LoggerCreationParams<SinkOptions>> = {}): Logger {
	const { group, groupCollapsed, groupEnd } = ORIGINAL_CONSOLE
	return {
		...createLoggerCore(p, p.sinkOptions?.sink || createSink(p.sinkOptions)),
		group,
		groupCollapsed,
		groupEnd,
	}
}


export {
	createLogger,
}

export * from '@offirmo/practical-logger-types'
export { DEFAULT_LOG_LEVEL, DEFAULT_LOGGER_KEY } from '@offirmo/practical-logger-core'
