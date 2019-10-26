import { Logger, LoggerCreationParams, BaseSinkOptions } from '@offirmo/practical-logger-types'
import { createLogger as createLoggerCore } from '@offirmo/practical-logger-core'

import { SinkOptions } from './types'
import createSink from './sinks/to-console'

const ORIGINAL_CONSOLE = console



function createLogger(p: Readonly<LoggerCreationParams<SinkOptions>> = {}): Logger {
	return {
		...createLoggerCore(p, p.sinkOptions?.sink || createSink(p.sinkOptions)),
		group(groupTitle?: string): void {
			ORIGINAL_CONSOLE.group(groupTitle)
		},
		groupCollapsed(groupTitle?: string): void {
			ORIGINAL_CONSOLE.groupCollapsed(groupTitle)
		},
		groupEnd(): void {
			ORIGINAL_CONSOLE.groupEnd()
		}
	}
}

export {
	Logger,
	LoggerCreationParams,
	createLogger,
}
