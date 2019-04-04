import { WebDebugApiV1 } from '@offirmo/universal-debug-api-interface'
import { Logger, LoggerCreationParams, createLogger } from '@offirmo/practical-logger-browser'
//import { list as listExperiments } from '@atlassian/log-experiment-to-console-browser'

//import { attach } from './attach-listeners-to-debug-command'


export default function create(root: any): WebDebugApiV1 {
	const loggers: { [name: string]: Logger } = {}
	const debugCommands: { [name: string]: () => void } = {}

	//attach(debugCommands)

	const exposed: any = {}
	const overrides: { [k: string]: any } = {}

	function getLogger(p: Readonly<LoggerCreationParams> = {}) {
		p = {
			name: '', // we need a name immediately
			...p
		}
		loggers[p.name!] = loggers[p.name!] || createLogger(p) // TODO weakmap ?
		return loggers[p.name!]
	}

	function exposeInternal(path: string, value: any): void {
		const pathParts = path.split('.')
		const lastIndex = pathParts.length - 1
		let root: any = exposed
		pathParts.forEach((p: string, index: number) => {
			root[p] = root[p] || (
				index === lastIndex
					? value
					: {}
			)
			root = root[p]
		})
	}

	function overrideHook<T>(key: string, defaultValue: T): T {
		if (overrides.hasOwnProperty(key))
			return overrides[key] as T

		return defaultValue
	}

	function addDebugCommand(commandName: string, callback: () => void) {
		// TODO
		debugCommands[commandName] = callback
	}

	const api: WebDebugApiV1 = {
		getLogger,
		exposeInternal,
		overrideHook,
		addDebugCommand,

		_: {
			exposed,
			overrides,
		}
	}

	/*
	api.addDebugCommand('list', () => {
		console.log((window as any)._experiments)
		//listExperiments((window as any)._experiments)
	})
*/

	return api
}
