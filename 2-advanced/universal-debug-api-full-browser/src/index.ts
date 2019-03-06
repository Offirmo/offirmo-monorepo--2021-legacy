import { getGlobalThis } from '@offirmo/globalthis-ponyfill'
import { WebDebugApi, Logger } from '@offirmo/universal-debug-api-interface'

import { create } from './create'


// install globally if no other implementation already present
const globalThis = getGlobalThis()
globalThis._debug = globalThis._debug || create()

// expose the current implementation
const instance: WebDebugApi = globalThis._debug

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
declare global {
	interface Window {
		_debug: WebDebugApi
	}
}
