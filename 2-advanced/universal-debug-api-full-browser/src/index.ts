import { getGlobalThis } from '@offirmo/globalthis-ponyfill'

import { WebDebugApiRoot, WebDebugApi } from '@offirmo/universal-debug-api-interface'

import createV1 from './v1'

const globalThis = getGlobalThis()

// ensure the root is present
globalThis._debug = globalThis._debug || {}

const root: WebDebugApiRoot = globalThis._debug

//////////// v1 ////////////

// install globally if no other implementation already present
root.v1 = root.v1 || createV1(root)

//////////// latest ////////////

// expose the latest implementation known to this lib
const instance: WebDebugApi = root.v1

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

	createV1, // needed?

	globalThis, // needed?
}

//////////// for convenience ////////////

export {
	WebDebugApiRoot,
	WebDebugApi,
	WebDebugApiV1,
	Logger,
	LoggerCreationParams,
} from '@offirmo/universal-debug-api-interface'


// TS declaration
// XXX to check, how does it works with minimal to void?
// XXX should be cross-env declared by root interface?
// XXX is it even needed?
/*
declare global {
	interface Window {
		_debug: WebDebugApiRoot
	}
}
*/
