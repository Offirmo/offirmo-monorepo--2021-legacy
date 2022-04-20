import { Logger, LoggerCreationParams } from '@offirmo/practical-logger-types'

interface DebugApi {
	getLogger: (p?: Readonly<LoggerCreationParams>) => Logger

	overrideHook: <T>(key: string, defaultValue: T) => T

	exposeInternal: (path: string, value: any) => void

	addDebugCommand: (name: string, callback: ( /* todo common libs as params ? */ ) => void) => void

	// This is internal, undocumented, should not be used!
	// For ex. the placeholder won't feture this
	_?: {
		exposed: any
		overrides: { [k: string]: any }

		// For internal setup debug:
		// TODO review if really useful
		minor: number // minor isolated increment as a number, for trivial INTERNAL semver check (of course <99 required)
		              // this "minor" is specific to an implementation, i.e. browser or node
		source: string // what installed this lib
		create: () => DebugApi // allows re-creating for special purpose (for now, only the browser extension needs it)
	}
}

export {
	Logger,
	LoggerCreationParams,
	DebugApi,
}
