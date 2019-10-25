import { WebDebugApi as WebDebugApiV1 } from './v1'

interface WebDebugApiRoot {
	v1: WebDebugApiV1,
}

type WebDebugApi = WebDebugApiV1

export {
	WebDebugApiV1,

	// v latest
	WebDebugApi,
	WebDebugApiRoot,
}

// for convenience
export { Logger, LoggerCreationParams } from '@offirmo/practical-logger-types'
