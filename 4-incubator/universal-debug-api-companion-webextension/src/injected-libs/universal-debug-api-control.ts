import { LoggerCreationParams } from '@offirmo/universal-debug-api-interface'
import { getOverrideKeyForLogger, getLSKeyForOverride } from '@offirmo-private/universal-debug-api-full-browser/src/v1/keys'

const original_v1 = (window as any)._debug.v1

const loggers = new Set()
const overrides = new Set()
const queue = []

function overrideHook<T>(key: string, default_value: T): T {
	const LSKey = getLSKeyForOverride(key)
	queue.push({
		type: 'override',
		key,
		default_value,
		overriden_value: localStorage.getItem(LSKey),
	})
	console.log({LSKey})
	//console.log({queue})
	return original_v1.overrideHook(key, default_value)
}

function getLogger(p: Readonly<LoggerCreationParams> = {}) {
	const name = p.name || 'root'
	const LSKey = getLSKeyForOverride(getOverrideKeyForLogger(name))
	queue.push({
		type: 'logger',
		name,
		default_level: p.suggestedLevel,
		overriden_value: localStorage.getItem(LSKey),
	})
	console.log({LSKey})
	//console.log({queue})
	return original_v1.getLogger(p)
}

function exposeInternal(path: string, value: any): void {
	return original_v1.exposeInternal(path, value)
}

function addDebugCommand(commandName: string, callback: () => void) {
	return original_v1.addDebugCommand(commandName, callback)
}

(window as any)._debug.v1 = {
	...original_v1,
	overrideHook,
	getLogger,
	exposeInternal,
	addDebugCommand,
}
