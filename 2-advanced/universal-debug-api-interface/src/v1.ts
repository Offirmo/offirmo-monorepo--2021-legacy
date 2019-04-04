import { Logger, LoggerCreationParams } from '@offirmo/practical-logger-interface'

interface WebDebugApi {
	getLogger: (p?: Readonly<LoggerCreationParams>) => Logger

	exposeInternal: (path: string, value: any) => void

	overrideHook: <T>(key: string, defaultValue: T) => T

	addDebugCommand: (name: string, callback: ( /* todo common libs as params ? */ ) => void) => void

	_?: {
		exposed: any
		overrides: { [k: string]: any }
	}
}

export {
	Logger,
	LoggerCreationParams,
	WebDebugApi,
}
