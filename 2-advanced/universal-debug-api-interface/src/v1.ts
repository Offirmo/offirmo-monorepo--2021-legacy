import { Logger, LoggerCreationParams } from '@offirmo/practical-logger-interface'

interface WebDebugApi {
	getLogger: (p?: Readonly<LoggerCreationParams>) => Logger
	addDebugCommand: (name: string, callback: () => void) => void
}

export {
	Logger,
	LoggerCreationParams,
	WebDebugApi,
}
