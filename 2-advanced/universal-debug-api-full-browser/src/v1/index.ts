import { WebDebugApiV1 } from '@offirmo/universal-debug-api-interface'
import { Logger, LoggerCreationParams, createLogger } from '@offirmo/practical-logger-browser'
import { DEFAULT_LOG_LEVEL, DEFAULT_LOGGER_KEY } from '@offirmo/practical-logger-core/src/consts-base'
import { WebDebugApiRoot } from '@offirmo/universal-debug-api-interface'

import { LS_ROOT, getOverrideKeyForLogger, getLSKeyForOverride } from './keys'

////////////////////////////////////

interface OverrideStatus {
	isOn: boolean
	value: any
}

interface Overrides {
	[k: string]: OverrideStatus
}

////////////////////////////////////

const LIB = LS_ROOT

////////////////////////////////////

export default function create(root: WebDebugApiRoot): WebDebugApiV1 {

	////////////////////////////////////

	const loggers: { [name: string]: Logger } = {} // to avoid creating duplicates
	const debugCommands: { [name: string]: () => void } = {} // TODO check
	const exposed: any = {}
	const overrides: Overrides = {} // we'll expose them for clarity

	////////////////////////////////////

	// TODO override?
	// TODO allow off?
	const _ownLogger: Logger = (() => {
		const name = LIB
		// TODO make the level adjustabl?
		return createLogger({ name, suggestedLevel: 'silly' })
	})()

	function _getOverride(key: string): OverrideStatus {
		if (!overrides[key]) {
			// we only read the LS once for speed reason
			overrides[key] = {
				// so far:
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
						overrides[key].isOn = true
						// we allow the non-JSON "undefined"
						const value = rawValue === 'undefined' ? undefined : JSON.parse(rawValue)
						overrides[key].value = value
						_ownLogger.log(` 🔵 overriden "${key}"`, { value })
					} catch (err) {
						// TODO only complain once
						// TODO seen crash, to check again
						_ownLogger.warn(`🔴 failed to override "${key}"!`, { badValue: rawValue, err })
					}
				}
			}
			catch (err) {
				_ownLogger.warn(`🔴 failed to setup override "${key}"!`, { err })
			}
		}

		return overrides[key]
	}

	////////////////////////////////////

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

	////////////////////////////////////

	function overrideHook<T>(key: string, defaultValue: T): T {
		try {
			const status = _getOverride(key)
			if (status.isOn)
				return status.value as T
		}
		catch (err) {
			// TODO warn once?
			// should never happen?
			// TODO not use the own logger???
			_ownLogger.warn(`overrideHook(): error retrieving override!`, { key, err })
		}

		return defaultValue
	}

	function getLogger(p: Readonly<LoggerCreationParams> = {}) {
		const name = p.name || DEFAULT_LOGGER_KEY // we need a name immediately

		if (!loggers[name]) {
			loggers[name] = createLogger(p)
			try {
				const overridenLevel = (root.v1 || api).overrideHook(getOverrideKeyForLogger(name), p.suggestedLevel || DEFAULT_LOG_LEVEL)
				if (overridenLevel)
					loggers[name].setLevel(overridenLevel)
			}
			catch (err) {
				// this warning should appear only once on creation ✔
				_ownLogger.warn(`getLogger(): error overriding the level!`, { name, err })
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
			_ownLogger.warn(`[${LIB}] exposeInternal(): error exposing!`, { path, err })
		}
	}

	function addDebugCommand(commandName: string, callback: () => void) {
		// TODO
		// TODO try catch
		debugCommands[commandName] = callback
	}

	/* TODO ping
	api.addDebugCommand('list', () => {
		console.log((window as any)._experiments)
		//listExperiments((window as any)._experiments)
	})
*/

	return api
}
