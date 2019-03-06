import { WebDebugApi } from '@offirmo/web-debug-api-interface'
import { Logger, createLogger } from '@offirmo/practical-logger-browser'


function create(): WebDebugApi {
	const loggers: { [name: string]: Logger } = {}
	const debugCommands: { [name: string]: () => void } = {}

	return {
		getLogger(name: string = '') {
			loggers[name] = loggers[name] || createLogger({ name })
			return loggers[name]
		},
		addDebugCommand(name: string, callback: () => void) {
			debugCommands[name] = callback
			// TODO attach to window
		},
	}
}

window._debug = window._debug || create()
const instance: WebDebugApi = window._debug

const {
	getLogger,
	addDebugCommand,
} = instance

export {
	getLogger,
	addDebugCommand,
}
