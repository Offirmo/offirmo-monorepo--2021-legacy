import { WebDebugApiV1 } from '@offirmo-private/universal-debug-api-interface'
import { Logger, LoggerCreationParams, createLogger } from '@offirmo-private/practical-logger-browser'
//import { list as listExperiments } from '@atlassian/log-experiment-to-console-browser'

//import { attach } from './attach-listeners-to-debug-command'


export default function create(): WebDebugApiV1 {
	const loggers: { [name: string]: Logger } = {}
	const debugCommands: { [name: string]: () => void } = {}

	//attach(debugCommands)

	const api: WebDebugApiV1 = {
		getLogger(p: Readonly<LoggerCreationParams> = {}) {
			p = {
				name: '', // we need a name immediately
				...p
			}
			loggers[p.name!] = loggers[p.name!] || createLogger(p)
			return loggers[p.name!]
		},
		addDebugCommand(commandName: string, callback: () => void) {
			// TODO
			debugCommands[commandName] = callback
		},
	}

	/*
	api.addDebugCommand('list', () => {
		console.log((window as any)._experiments)
		//listExperiments((window as any)._experiments)
	})
*/

	return api
}
