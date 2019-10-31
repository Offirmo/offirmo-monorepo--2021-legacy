import tiny_singleton from '@offirmo/tiny-singleton'
import { LogSink, Logger, LoggerCreationParams } from '@offirmo/practical-logger-types'
import { createLogger as createLoggerCore } from '@offirmo/practical-logger-core'

import { SinkOptions } from './types'
import { create } from './sinks'
import improve_console_groups from './better-console-groups/practical-logger'

const ORIGINAL_CONSOLE = console

const install_groups_or_not_once_for_all = tiny_singleton((active: boolean) => { if (active) improve_console_groups() })

function createLogger(p: Readonly<LoggerCreationParams<SinkOptions>> = {}): Logger {
	install_groups_or_not_once_for_all(p.sinkOptions?.betterGroups !== false)

	const sink: LogSink = p.sinkOptions?.sink || create(p.sinkOptions)

	const { group, groupCollapsed, groupEnd } = ORIGINAL_CONSOLE
	return {
		...createLoggerCore(p, sink),
		group,
		groupCollapsed,
		groupEnd,
	}
}


export {
	createLogger,
}
export * from '@offirmo/practical-logger-types'
