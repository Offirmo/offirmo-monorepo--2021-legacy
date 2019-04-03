import { getGlobalThis } from '@offirmo/globalthis-ponyfill'
import { WebDebugApiRoot, WebDebugApi } from '@offirmo/universal-debug-api-interface'

import { create as createV1 } from './v1'

// ensure the root is present
const globalThis = getGlobalThis()
globalThis._debug = globalThis._debug || {} as WebDebugApiRoot

// install globally if no other implementation already present
globalThis._debug.v1 = globalThis._debug.v1 || createV1()

// expose the current implementation
const instance: WebDebugApi = globalThis._debug.v1

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
