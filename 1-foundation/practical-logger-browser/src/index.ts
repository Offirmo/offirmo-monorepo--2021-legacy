import { LogSink, Logger, LoggerCreationParams, LogPayload } from '@offirmo/practical-logger-types'
import { createLogger as createLoggerCore, LOG_LEVEL_TO_INTEGER } from '@offirmo/practical-logger-core'

import { SinkOptions } from './types'
import sink_firefox from './sinks/advanced/firefox'
import sink_chromium from './sinks/advanced/chromium'
import sink_safari from './sinks/advanced/safari'
import { create } from './sinks/advanced'

const ORIGINAL_CONSOLE = console

function createLogger(p: Readonly<LoggerCreationParams<SinkOptions>> = {}): Logger {
	const sink0: LogSink = (p as any).sink || create() /// XXX declare sink?

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

	// specific
	sink_firefox,
	sink_chromium,
	sink_safari,
}
export * from '@offirmo/practical-logger-types'
