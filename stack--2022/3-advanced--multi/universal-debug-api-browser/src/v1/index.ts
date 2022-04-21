import { DebugApiV1 } from '@offirmo/universal-debug-api-interface'
import {
	LogLevel,
	DEFAULT_LOG_LEVEL,
	DEFAULT_LOGGER_KEY,
	Logger,
	LoggerCreationParams,
} from '@offirmo/practical-logger-core'
import {
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

export const OWN_LOGGER_NAME = LS_ROOT
const REVISION = 100.

////////////////////////////////////

export default function create(): DebugApiV1 {
	//console.trace('[UDA--browser installing…]')

	////////////////////////////////////

	const loggers: { [name: string]: Logger } = {} // to avoid creating duplicates
	const debugCommands: { [name: string]: () => void } = {} // TODO check
	const exposed: any = {}
	const overrides: Overrides = {} // we'll expose them for clarity

	////////////////////////////////////

	// TODO override?
	// TODO allow off?
	const _ownLogger: Logger = loggers[OWN_LOGGER_NAME] = createLogger({
		name: OWN_LOGGER_NAME,
		suggestedLevel: 'fatal', // level adjustable, see below
	})

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

	const forcedLevel = _getOverrideRequestedSJson(getOverrideKeyForLogger('_UDA_internal'))
	try {
		if (forcedLevel)
			_ownLogger.setLevel(JSON.parse(forcedLevel) as LogLevel)
	}
	catch (err) {
		_ownLogger.fatal(`🔴 error setting internal logger forced level: "${forcedLevel}"!`)
	}
	_ownLogger.debug(`Instantiated. (revision: ${REVISION})`)

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
			minor: REVISION,
			source: 'browser-lib',
			create,
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
		_ownLogger.warn('exposeInternal(): alpha, not documented!')
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
			_ownLogger.error('exposeInternal(): error exposing!', { path, err })
		}
	}

	function addDebugCommand(commandName: string, callback: () => void) {
		// TODO
		_ownLogger.warn('addDebugCommand(): alpha, not documented!')
		// TODO try catch
		debugCommands[commandName] = callback
	}

	return api
}
