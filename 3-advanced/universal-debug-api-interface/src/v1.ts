import { Logger, LoggerCreationParams } from '@offirmo/practical-logger-types'

interface DebugApi {
	getLogger: (p?: Readonly<LoggerCreationParams>) => Logger

	overrideHook: <T>(key: string, defaultValue: T) => T

	exposeInternal: (path: string, value: any) => void

	addDebugCommand: (name: string, callback: ( /* todo common libs as params ? */ ) => void) => void

	_?: {
		exposed: any
		overrides: { [k: string]: any }
	}
}

export {
	Logger,
	LoggerCreationParams,
	DebugApi,
}
