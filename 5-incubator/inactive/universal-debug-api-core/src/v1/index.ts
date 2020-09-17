import { DebugApiV1 } from '@offirmo/universal-debug-api-interface'
import { Logger, LoggerCreationParams, createLogger } from '@offirmo/practical-logger-node'
import { LogLevel, DEFAULT_LOG_LEVEL, DEFAULT_LOGGER_KEY } from '@offirmo/practical-logger-core'

import { ENV_ROOT, getOverrideKeyForLogger, getEnvKeyForOverride } from './keys'

////////////////////////////////////

interface OverrideStatus {
	isOn: boolean
	value: any
}

interface Overrides {
	[k: string]: OverrideStatus
}

////////////////////////////////////

export const OWN_LOGGER_NAME = ENV_ROOT
const REVISION = 1

////////////////////////////////////

export default function create(): DebugApiV1 {
	//console.log('[UDA-node installed]') // XX

	////////////////////////////////////

	const loggers: { [name: string]: Logger } = {} // to avoid creating duplicates
	const debugCommands: { [name: string]: () => void } = {} // TODO check
	const exposed: any = {}
	const overrides: Overrides = {} // we'll expose them for clarity

	////////////////////////////////////

	// TODO override?
	// TODO allow off?
	const _ownLogger: Logger = createLogger({
			name: OWN_LOGGER_NAME,
			suggestedLevel: 'fatal', // level adjustable, see below
		})

	function _getOverrideRequestedSJson(ovKey: string): null | string {
		try {
			const EnvKey = getEnvKeyForOverride(ovKey)
			//console.log(`EnvKey = "${EnvKey}"`)
			const rawValue = process.env[EnvKey] || null
			//console.log(`EnvKey "${EnvKey}" content = "${rawValue}"`)
			return rawValue
		}
		catch (err) {
			_ownLogger.warn(`🔴 error reading ENV for override "${ovKey}"!`, { err })
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
			// we only read the env once for speed reason
			overrides[key] = {
				// so far:
				isOn: false,
				value: undefined,
			}

			const rawValue = _getOverrideRequestedSJson(key)
			if (rawValue) {
				overrides[key].isOn = true
				// for the node version where escaping is hard, as a convenience, we auto-type common cases
				const value = (() => {
					// we allow the non-JSON "undefined"
					if (rawValue === 'undefined')
						return undefined

					if (String(Number(rawValue)) === rawValue)
						return Number(rawValue)

					try {
						return JSON.parse(rawValue)
					}
					catch {
						return rawValue // as a string
					}
				})()

				overrides[key].value = value
				_ownLogger.log(` 🔵 overriden "${key}"`, { value })
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
			source: 'node-lib',
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
			_ownLogger.warn('overrideHook(): error retrieving override!', { key, err })
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
				_ownLogger.warn('getLogger(): error overriding the level!', { name, err })
			}

			loggers[name] = createLogger(p)
		}

		return loggers[name]
	}

	function exposeInternal(path: string, value: any): void {
		_ownLogger.warn(`exposeInternal(): alpha, not documented!`)
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
			_ownLogger.warn(`exposeInternal(): error exposing!`, { path, err })
		}
	}

	function addDebugCommand(commandName: string, callback: () => void) {
		// TODO
		_ownLogger.warn(`addDebugCommand(): alpha, not documented!`)
		// TODO try catch
		debugCommands[commandName] = callback
	}

	return api
}
