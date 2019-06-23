import { Logger, LoggerCreationParams } from '@offirmo/practical-logger-interface'
import { createLogger as createLoggerCore } from '@offirmo/practical-logger-core'

import { sink } from './sink'

const ORIGINAL_CONSOLE = console

function createLogger(p: Readonly<LoggerCreationParams>): Logger {
	return {
		...createLoggerCore(p, sink),
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
