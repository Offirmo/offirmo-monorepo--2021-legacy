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

	createV1, // just in case

	globalThis, // for convenience
}

// for convenience
// TODO how about versions?
export * from '@offirmo/universal-debug-api-interface'

// TS declaration
// XXX to check, how does it works with minimal to void?
// XXX should be cross-env declared by root interface?
// XXX is it even needed?
/*
declare global {
	interface Window {
		_debug: DebugApiRoot
	}
}
*/
