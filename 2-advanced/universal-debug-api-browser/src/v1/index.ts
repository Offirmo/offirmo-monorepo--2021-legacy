import { DebugApiV1 } from '@offirmo/universal-debug-api-interface'
import {
	LogLevel,
	DEFAULT_LOG_LEVEL,
	DEFAULT_LOGGER_KEY,
	Logger,
	LoggerCreationParams,
	createLogger,
} from '@offirmo/practical-logger-browser'

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

export default function create(): DebugApiV1 {

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
		// TODO make the level adjustable?
		return createLogger({ name, suggestedLevel: 'fatal' })
	})()

	function _getOverrideRequestedSJson(ovKey: string): null | string {
		try {
			const LSKey = getLSKeyForOverride(ovKey)
			//console.log(`LSKey = "${LSKey}"`)
			const rawValue = localStorage.getItem(LSKey)
			//console.log(`LSKey content = "${value}"`)
			return rawValue
		}
		catch (err) {
			_ownLogger.warn(`🔴 error reading LS for override "${ovKey}"!`, { err })
			return null
		}
	}

	const forcedLevel = _getOverrideRequestedSJson('_UWDA_internal')
	if (forcedLevel)
		_ownLogger.setLevel(forcedLevel as LogLevel)

	function _getOverride(key: string): OverrideStatus {
		if (!overrides[key]) {
			// we only read the LS once for speed reason
			overrides[key] = {
				// so far:
				isOn: false,
				value: undefined,
			}

			const rawValue = _getOverrideRequestedSJson(key)
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

		return overrides[key]
	}

	////////////////////////////////////

	const api: DebugApiV1 = {
		getLogger,
		exposeInternal,
		overrideHook,
		addDebugCommand,

		_: {
			exposed,
			overrides,
		},
	}

	////////////////////////////////////

	function overrideHook<T>(key: string, defaultValue: T): T {
		try {
			const status = _getOverride(key)
			if (status.isOn)
				return status.value as T
		}
		catch (err) {
			// should never happen because _getOverride() already catch
			// TODO check!
			_ownLogger.error('overrideHook(): error retrieving override!', { key, err })
		}

		return defaultValue
	}

	function getLogger(p: Readonly<LoggerCreationParams> = {}) {
		const name = p.name || DEFAULT_LOGGER_KEY // we need a name immediately

		if (!loggers[name]) {
			try {
				const ovKey = getOverrideKeyForLogger(name)
				if (!p.forcedLevel && _getOverrideRequestedSJson(ovKey)) {
					p = {
						...p,
						forcedLevel: overrideHook(ovKey, p.suggestedLevel || DEFAULT_LOG_LEVEL),
					}
				}
			}
			catch (err) {
				// this warning should appear only once on creation ✔
				_ownLogger.error('getLogger(): error overriding the level!', { name, err })
			}

			loggers[name] = createLogger(p)
		}

		return loggers[name]
	}

	function exposeInternal(path: string, value: any): void {
		try {
			const pathParts = path.split('.') // TODO switch to / ?
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
			_ownLogger.error(`[${LIB}] exposeInternal(): error exposing!`, { path, err })
		}
	}

	function addDebugCommand(commandName: string, callback: () => void) {
		// TODO
		// TODO try catch
		debugCommands[commandName] = callback
	}

	return api
}
