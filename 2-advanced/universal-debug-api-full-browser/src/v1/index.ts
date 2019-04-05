import { WebDebugApiV1 } from '@offirmo/universal-debug-api-interface'
import { Logger, LoggerCreationParams, createLogger } from '@offirmo/practical-logger-browser'
//import { list as listExperiments } from '@atlassian/log-experiment-to-console-browser'

//import { attach } from './attach-listeners-to-debug-command'

interface OverrideStatus {
	isSet: boolean
	isLSQueried: boolean
	value: any
}

interface Overrides {
	[k: string]: OverrideStatus
}

function ensureOverride(key: string, overrides: Overrides, publicOverrides: { [k: string]: any }): OverrideStatus {
	overrides[key] = overrides[key] || {
		isSet: false,
		isLSQueried: false,
		value: undefined,
	}

	const status: OverrideStatus = overrides[key]

	if (!status.isLSQueried) {
		try {
			const LSKey = `_debug.override.${key}`
			//console.log(`LSKey = "${LSKey}"`)
			const value = localStorage.getItem(LSKey)
			//console.log(`LSKey content = "${value}"`)
			if (value) {
				try {
					status.value = value === 'undefined' ? undefined : JSON.parse(value)
					//console.log(`LSKey content parsed = "${status.value}"`)
					status.isSet = true
					publicOverrides[key] = status.value
				} catch (err) {
					console.warn(`bad override for "${LSKey}"!`)
				}
			}
		}
		catch { /* ignore */ }
		status.isLSQueried = true
	}

	return status
}

export default function create(root: any): WebDebugApiV1 {
	const loggers: { [name: string]: Logger } = {}
	const debugCommands: { [name: string]: () => void } = {}

	//attach(debugCommands)

	const exposed: any = {}
	const overrides: Overrides = {}
	const publicOverrides: { [k: string]: any } = {}

	function overrideHook<T>(key: string, defaultValue: T): T {
		const status = ensureOverride(key, overrides, publicOverrides)
		if (status.isSet)
			return status.value as T

		return defaultValue
	}

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
			overrides: publicOverrides,
			xx: overrides, // TODO remove
		} as WebDebugApiV1['_']
	}

	/*
	api.addDebugCommand('list', () => {
		console.log((window as any)._experiments)
		//listExperiments((window as any)._experiments)
	})
*/

	return api
}
