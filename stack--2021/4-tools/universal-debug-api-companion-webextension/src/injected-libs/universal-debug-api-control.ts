// by contract, injected in order = #2
import { LogLevel } from '@offirmo/practical-logger-types'
import { LoggerCreationParams } from '@offirmo/universal-debug-api-interface'
import { DEFAULT_LOG_LEVEL, DEFAULT_LOGGER_KEY } from '@offirmo/practical-logger-core/src/consts-base'
import { getOverrideKeyForLogger, getLSKeyForOverride } from '@offirmo/universal-debug-api-browser/src/v1/keys'
import { asap_but_out_of_current_event_loop } from '@offirmo-private/async-utils'

import { Report, create_msg_report_debug_api_usage, OverrideReport } from '../common/messages/report-usage'
import { StringifiedJSON, sjson_stringify } from '../common/utils/stringified-json'

////////////////////////////////////

let DEBUG = false
try { // defensive!
	DEBUG = DEBUG || !!window.localStorage.getItem('🧩UWDTi.context.debug')
} catch { /* swallow */ }

// get the "normal" v1 installed by a previous injection (by design)
// and store it.
// We'll proxy it at the end of this file.
const original_v1 = (window as any)._debug.v1

const overrides: { [k: string]: null | StringifiedJSON } = {}
const queue: Report[] = []

// "in flight" provides:
// - a crude throttle/bulking system
// - avoid hogging the current execution chunk, which may be the initial load
let sync_in_flight = false
function schedule_sync() {
	if (DEBUG) console.log('🧩UWDTi: schedule_sync', {
		last_queued: queue.slice(-1)[0],
		queue_size: queue.length,
		in_flight: sync_in_flight,
	})

	if (sync_in_flight)
		return

	sync_in_flight = true
	asap_but_out_of_current_event_loop(() => {
		if (DEBUG) console.log('🧩UWDTi: posting create_msg_report_debug_api_usage...')
		try {
			window.postMessage(
				create_msg_report_debug_api_usage(queue),
				'*',
			)
		}
		catch (err) {
			if (DEBUG) console.error('🧩UWDTi: error when syncing!', err)
		}
		queue.length = 0
		sync_in_flight = false
	})
}

////////////////////////////////////

function _getOverrideRequestedSJson(ovKey: string): null | StringifiedJSON {
	try {
		const LSKey = getLSKeyForOverride(ovKey)
		//console.log(`LSKey = "${LSKey}"`)
		const rawValue = localStorage.getItem(LSKey)
		//console.log(`LSKey content = "${rawValue}"`)
		return rawValue
	}
	catch (err) {
		// will be logged elsewhere
		return null
	}
}

function overrideHook<T>(key: string, default_value: T): T {
	if (!overrides.hasOwnProperty(key)) {
		// reminder: default_value === undefined is allowed, bc JSON doesn't encode undefined
		// however we turn that into a special value
		const default_value_sjson = sjson_stringify(default_value)
		if (DEBUG) console.log('🧩UWDTi: overrideHook()', {key, default_value, default_value_sjson})
		const existing_override_sjson = _getOverrideRequestedSJson(key)
		queue.push({
			type: 'override',
			key,
			default_value_sjson,
			existing_override_sjson,
		} as OverrideReport)
		schedule_sync()
		overrides[key] = existing_override_sjson
	}

	return original_v1.overrideHook(key, default_value)
}

function getLogger(p: Readonly<LoggerCreationParams> = {}) {
	const name = p.name || DEFAULT_LOGGER_KEY

	const ovKey = getOverrideKeyForLogger(name)
	const ovDefaultLevel = p.suggestedLevel || DEFAULT_LOG_LEVEL

	if (DEBUG) console.log('🧩UWDTi: getLogger()', {params: p, name, ovDefaultLevel, DEFAULT_LOG_LEVEL})

	// systematically call overrideHook on creation to declare the override!
	const ovForcedLevel = overrideHook<LogLevel>(
		ovKey,
		ovDefaultLevel,
	)
	if (!p.forcedLevel && _getOverrideRequestedSJson(ovKey)) {
		p = {
			...p,
			forcedLevel: ovForcedLevel,
		}
	}

	return original_v1.getLogger(p)
}

function exposeInternal(path: string, value: any): void {
	if (DEBUG) console.log('🧩UWDTi: exposeInternal()', {path})
	// TODO report to the UI
	return original_v1.exposeInternal(path, value)
}

function addDebugCommand(commandName: string, callback: () => void) {
	if (DEBUG) console.log('🧩UWDTi: addDebugCommand()', {commandName})
	// TODO report to the UI
	return original_v1.addDebugCommand(commandName, callback)
}

// replace with our wrapped version
(window as any)._debug.v1 = {
	...original_v1,
	overrideHook,
	getLogger,
	exposeInternal,
	addDebugCommand,
}

if (DEBUG) console.log('🧩UWDTi: all set up ✅')
////////////////////////////////////
