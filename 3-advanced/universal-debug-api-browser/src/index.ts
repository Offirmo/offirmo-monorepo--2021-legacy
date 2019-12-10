import { getGlobalThis } from '@offirmo/globalthis-ponyfill'

import { DebugApiRoot, DebugApi } from '@offirmo/universal-debug-api-interface'

import createV1 from './v1'

const globalThis = getGlobalThis()

// ensure the root is present
// TODO root should be a const?
globalThis._debug = globalThis._debug || {}

const root: DebugApiRoot = globalThis._debug

//////////// v1 ////////////

// install globally if no other implementation already present
// TODO do a minor version check?
// TODO always override since final?
root.v1 = root.v1 || createV1()

//////////// latest ////////////

// directly expose the latest implementation known to this lib
const instance: DebugApi = root.v1

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
