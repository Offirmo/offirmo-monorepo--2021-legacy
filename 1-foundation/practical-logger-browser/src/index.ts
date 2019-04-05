import { Logger, LoggerCreationParams } from '@offirmo/practical-logger-interface'
import { createLogger as createLoggerCore } from '@offirmo/practical-logger-core'

import sink_firefox from './sinks/advanced/firefox'
import sink_chromium from './sinks/advanced/chromium'
import sink_safari from './sinks/advanced/safari'
import { create } from './sinks/advanced'


function createLogger(p: Readonly<LoggerCreationParams>): Logger {
	const sink = (p as any).sink || create()
	return createLoggerCore(p, sink)
}


export {
	Logger,
	LoggerCreationParams,
	createLogger,
	sink_firefox,
	sink_chromium,
	sink_safari,
}
