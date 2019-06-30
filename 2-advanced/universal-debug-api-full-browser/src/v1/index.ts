import { WebDebugApiV1 } from '@offirmo/universal-debug-api-interface'
import { Logger, LoggerCreationParams, createLogger } from '@offirmo/practical-logger-browser'

import { getOverrideKeyForLogger, getLSKeyForOverride } from './keys'
const LIB = 'UDAB'

interface OverrideStatus {
	isOn: boolean
	value: any
}

interface Overrides {
	[k: string]: OverrideStatus
}


export default function create(root: any): WebDebugApiV1 {
	// TODO weakmap ?
	const loggers: { [name: string]: Logger } = {}
	const debugCommands: { [name: string]: () => void } = {}
	const ownLogger = createLogger({ name: LIB, suggestedLevel: 'silly' })

	//attach(debugCommands)

	const exposed: any = {}
	const overrides: Overrides = {}

	function ensureOverride(key: string): OverrideStatus {
		if (!overrides[key]) {
			overrides[key] = {
				isOn: false,
				value: undefined,
			}

			try {
				const LSKey = getLSKeyForOverride(key)
				//console.log(`LSKey = "${LSKey}"`)
				const rawValue = localStorage.getItem(LSKey)
				//console.log(`LSKey content = "${value}"`)
				if (rawValue) {
					try {
						const value = rawValue === 'undefined' ? undefined : JSON.parse(rawValue)
						overrides[key].value = value
						overrides[key].isOn = true
						ownLogger.log(` 🔵 overriden "${key}"`, { value })
					} catch (err) {
						ownLogger.warn(`🔴 failed to override "${key}"!`, { badValue: rawValue, err })
					}
				}
			}
			catch (err) {
				ownLogger.warn(`🔴 failed to setup override "${key}"!`, { err })
			}
		}

		return overrides[key]
	}

	function overrideHook<T>(key: string, defaultValue: T): T {
		try {
			const status = ensureOverride(key)
			if (status.isOn)
				return status.value as T
		}
		catch (err) {
			ownLogger.warn(`overrideHook(): error retrieving override!`, { key, err })
		}

		return defaultValue
	}

	function getLogger(p: Readonly<LoggerCreationParams> = {}) {
		const name = p.name || 'root' // we need a name immediately

		if (!loggers[name]) {
			loggers[name] = createLogger(p)
			try {
				const overridenLevel = overrideHook(getOverrideKeyForLogger(name), p.suggestedLevel || null)
				if (overridenLevel)
					loggers[name].setLevel(overridenLevel)
			}
			catch (err) {
				ownLogger.warn(`getLogger(): error overriding the level!`, { name, err })
			}
		}

		return loggers[name]
	}

	function exposeInternal(path: string, value: any): void {
		try {
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
		catch (err) {
			ownLogger.warn(`[${LIB}] exposeInternal(): error exposing!`, { path, err })
		}
	}

	function addDebugCommand(commandName: string, callback: () => void) {
		// TODO
		// TODO try catch
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
