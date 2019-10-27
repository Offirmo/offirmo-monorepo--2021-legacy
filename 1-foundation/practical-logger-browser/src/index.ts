import { LogSink, Logger, LoggerCreationParams, LogPayload } from '@offirmo/practical-logger-types'
import { createLogger as createLoggerCore, LOG_LEVEL_TO_INTEGER } from '@offirmo/practical-logger-core'

import { SinkOptions } from './types'
import { create } from './sinks'

const ORIGINAL_CONSOLE = console

function createLogger(p: Readonly<LoggerCreationParams<SinkOptions>> = {}): Logger {
	const sink0: LogSink = p.sinkOptions?.sink || create(p.sinkOptions)

	let groupDepth = 0;
	function sink1(payload: LogPayload): void {
		const shouldEscapeFromGroupCollapsedToMakeTheErrorVisible = LOG_LEVEL_TO_INTEGER[payload.level] <= 40 && groupDepth > 0
		if (shouldEscapeFromGroupCollapsedToMakeTheErrorVisible) {
			while(groupDepth > 0) {
				ORIGINAL_CONSOLE.groupEnd()
				groupDepth--
			}
		}
		return sink0(payload)
	}

	return {
		...createLoggerCore(p, sink1),
		group(groupTitle?: string): void {
			ORIGINAL_CONSOLE.group(groupTitle)
			groupDepth++
		},
		groupCollapsed(groupTitle?: string): void {
			ORIGINAL_CONSOLE.groupCollapsed(groupTitle)
			groupDepth++
		},
		groupEnd(): void {
			ORIGINAL_CONSOLE.groupEnd()
			groupDepth = Math.max(0, groupDepth - 1)
		}
	}
}


export {
	createLogger,
}
export * from '@offirmo/practical-logger-types'
