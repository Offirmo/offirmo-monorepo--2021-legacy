import { WebDebugApi } from '@offirmo/universal-debug-api-interface'
import { Logger, LoggerCreationParams, createLogger } from '@offirmo/practical-logger-browser'
import { list as listExperiments } from '@atlassian/log-experiment-to-console-browser'

import { attach } from './attach-listeners-to-debug-command'


export function create(): WebDebugApi {
	const loggers: { [name: string]: Logger } = {}
	const debugCommands: { [name: string]: () => void } = {}

	attach(debugCommands)

	const api: WebDebugApi = {
		getLogger(p: Readonly<LoggerCreationParams>) {
			p = {
				name: '',
				...p
			}
			loggers[p.name] = loggers[p.name] || createLogger(p)
			return loggers[p.name]
		},
		addDebugCommand(commandName: string, callback: () => void) {
			debugCommands[commandName] = callback
		},
	}

	api.addDebugCommand('list', () => {
		console.log((window as any)._experiments)
		//listExperiments((window as any)._experiments)
	})

	return api
}
