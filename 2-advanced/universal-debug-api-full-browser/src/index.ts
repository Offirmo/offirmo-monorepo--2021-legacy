import { getGlobalThis } from '@offirmo/globalthis-ponyfill'
import { WebDebugApiRoot, WebDebugApi } from '@offirmo/universal-debug-api-interface'

import createV1 from './v1'

// ensure the root is present
const globalThis = getGlobalThis()
globalThis._debug = globalThis._debug || {}
const root: WebDebugApiRoot = globalThis._debug

// install globally if no other implementation already present
root.v1 = root.v1 || createV1()

// expose the latest implementation known to this lib
const instance: WebDebugApi = root.v1

const {
	getLogger,
	addDebugCommand,
} = instance

export {
	getLogger,
	addDebugCommand,

	createV1,

	globalThis,
}

// for convenience
export * from '@offirmo/universal-debug-api-interface'


// TS declaration
// XXX to check, how does it works with minimal to void?
// XXX should be cross-env declared by root interface?
// XXX is it even needed?
declare global {
	interface Window {
		_debug: WebDebugApiRoot
	}
}
