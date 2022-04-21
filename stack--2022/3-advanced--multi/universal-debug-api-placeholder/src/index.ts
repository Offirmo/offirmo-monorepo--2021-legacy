import { getGlobalThis } from '@offirmo/globalthis-ponyfill'
import { DebugApiRoot, DebugApi } from '@offirmo/universal-debug-api-interface'

import createV1 from './v1'

const globalThis = getGlobalThis()

// ensure the root is present
globalThis._debug = globalThis._debug || {} as DebugApiRoot

// install globally if no other implementation already present
globalThis._debug.v1 = globalThis._debug.v1 || createV1()

// expose the installed implementation
const instance: DebugApi = globalThis._debug.v1

const {
	getLogger,
	exposeInternal,
	overrideHook,
	addDebugCommand,
} = instance

export {
	getLogger,
	exposeInternal,
	overrideHook,
	addDebugCommand,

	globalThis, // for convenience

	createV1, // for special cases
}

// types & sub-types, for convenience
export * from '@offirmo/universal-debug-api-interface'
