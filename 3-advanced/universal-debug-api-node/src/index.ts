import { getGlobalThis } from '@offirmo/globalthis-ponyfill'
import { DebugApiRoot, DebugApi } from '@offirmo/universal-debug-api-interface'

import createV1 from './v1'

// ensure the root is present
const globalThis = getGlobalThis()
globalThis._debug = globalThis._debug || {} as DebugApiRoot

// install globally if no other implementation already present
// TODO do a minor version check?
// TODO always override since final?
globalThis._debug.v1 = globalThis._debug.v1 || createV1()

// expose the current implementation
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

	createV1, // special cases
}

// types
export * from '@offirmo/universal-debug-api-interface'
