import { Logger } from '@offirmo/practical-logger-interface'

export interface WebDebugApi {
	getLogger: (name?: string) => Logger
	addDebugCommand: (name: string, callback: () => void) => void
}

// yes, we plan to expose that like a Web API
declare global {
	interface Window {
		_debug: WebDebugApi
	}
}
