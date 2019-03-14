import { getGlobalThis } from '@offirmo/globalthis-ponyfill'
import { WebDebugApi, Logger } from '@offirmo/universal-debug-api-interface'

import { create } from './create'


// install globally if no other implementation already present
const globalThis = getGlobalThis()
globalThis._debug = globalThis._debug || {}
globalThis._debug.v1 = globalThis._debug.v1 || create()


// expose the current implementation
const instance: WebDebugApi = globalThis._debug.v1

const {
	getLogger,
	addDebugCommand,
} = instance

export {
	getLogger,
	addDebugCommand,
}

export { WebDebugApi, Logger } // for convenience

// TS declaration
// XXX to check, how does it works with minimal to void?
// should be cross-env declared by root interface
declare global {
	interface Window {
		_debug: {
			v1: WebDebugApi
		}
	}
}
