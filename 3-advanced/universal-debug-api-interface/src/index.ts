import { DebugApi as DebugApiV1 } from './v1'

interface DebugApiRoot {
	v1: DebugApiV1,
}

type DebugApi = DebugApiV1

export {
	DebugApiV1,

	// v latest
	DebugApi,
	DebugApiRoot,
}

// for convenience
export { Logger, LoggerCreationParams } from '@offirmo/practical-logger-types'
