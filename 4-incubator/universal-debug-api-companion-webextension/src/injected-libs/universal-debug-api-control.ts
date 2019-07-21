import { LoggerCreationParams } from '@offirmo/universal-debug-api-interface'
import { getOverrideKeyForLogger, getLSKeyForOverride } from '@offirmo-private/universal-debug-api-full-browser/src/v1/keys'
import { OverrideReport, Report, create_msg_report_debug_api_usage } from '../common/messages/report-usage'

////////////////////////////////////

const original_v1 = (window as any)._debug.v1

const overrides: { [k: string]: string | null } = {}
const queue: Report[] = []

// "in flight" provides:
// - a crude throttle/bulking system
// - avoid hogging the current execution chunk, which may be the initial load
let sync_in_flight = false
function schedule_sync() {
	console.log(`schedule_sync`, {
		last_queued: queue.slice(-1)[0],
		queue_size: queue.length,
		in_flight: sync_in_flight,
	})

	if (sync_in_flight)
		return

	sync_in_flight = true
	setTimeout(() => {
		window.postMessage(
			create_msg_report_debug_api_usage(queue),
			'*',
		)
		queue.length = 0
		sync_in_flight = false
	})
}

////////////////////////////////////

function overrideHook<T>(key: string, default_value: T): T {
	if (!overrides.hasOwnProperty(key)) {
		const LSKey = getLSKeyForOverride(key)
		const existing_override_json = localStorage.getItem(LSKey)
		console.log('overrideHook()', {key, default_value, LSKey, existing_override_json})

		queue.push({
			type: 'override',
			key,
			default_value_sjson: JSON.stringify(default_value),
			existing_override_json,
		})
		schedule_sync()
		overrides[key] = existing_override_json
	}

	return original_v1.overrideHook(key, default_value)
}

function getLogger(p: Readonly<LoggerCreationParams> = {}) {
	const name = p.name || 'root'
	console.log('getLogger()', {name})

	/*const LSKey = getLSKeyForOverride(getOverrideKeyForLogger(name))
	queue.push({
		type: 'logger',
		name,
		default_level: p.suggestedLevel,
		overriden_value: localStorage.getItem(LSKey),
	})
	console.log({LSKey})*/
	//console.log({queue})
	return original_v1.getLogger(p)
}

function exposeInternal(path: string, value: any): void {
	console.log('exposeInternal()', {path})
	return original_v1.exposeInternal(path, value)
}

function addDebugCommand(commandName: string, callback: () => void) {
	console.log('addDebugCommand()', {commandName})
	return original_v1.addDebugCommand(commandName, callback)
}

// TODO check if this replacement is really compatible with the browser version, incl. getLogger
// replace with the wrapped version
(window as any)._debug.v1 = {
	...original_v1,
	overrideHook,
	getLogger,
	exposeInternal,
	addDebugCommand,
}

console.log('Wrapped ✅')
////////////////////////////////////
