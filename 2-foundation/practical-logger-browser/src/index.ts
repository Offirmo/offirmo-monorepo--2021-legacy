import tiny_singleton from '@offirmo/tiny-singleton'
import { LogSink, Logger, LoggerCreationParams } from '@offirmo/practical-logger-types'
import { createLogger as createLoggerCore } from '@offirmo/practical-logger-core'

import { SinkOptions } from './types'
import { create } from './sinks'
import improve_console_groups from './better-console-groups/practical-logger'

const ORIGINAL_CONSOLE = console


const _install_groups_or_not_once_for_all = tiny_singleton((active: boolean) => { if (active) improve_console_groups() })

export function createLogger(p: Readonly<LoggerCreationParams<SinkOptions>> = {}): Logger {
	_install_groups_or_not_once_for_all(p.sinkOptions?.betterGroups !== false)

	const sink: LogSink = p.sinkOptions?.sink || create(p.sinkOptions)

	const { group, groupCollapsed, groupEnd } = ORIGINAL_CONSOLE
	return {
		...createLoggerCore(p, sink),
		group,
		groupCollapsed,
		groupEnd,
	}
}

export * from '@offirmo/practical-logger-types'
export { DEFAULT_LOG_LEVEL, DEFAULT_LOGGER_KEY } from '@offirmo/practical-logger-core'
