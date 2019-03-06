import { WebDebugApi } from '@offirmo/universal-debug-api-interface'
import { Logger, LoggerCreationParams, createLogger } from '@offirmo/practical-logger-browser'


export function create(): WebDebugApi {
	const loggers: { [name: string]: Logger } = {}
	const debugCommands: { [name: string]: () => void } = {}

	return {
		getLogger(p: Readonly<LoggerCreationParams>) {
			p = {
				name: '',
				...p
			}
			loggers[name] = loggers[name] || createLogger(p)
			return loggers[name]
		},
		addDebugCommand(name: string, callback: () => void) {
			debugCommands[name] = callback
			// TODO attach to window
		},
	}
}
