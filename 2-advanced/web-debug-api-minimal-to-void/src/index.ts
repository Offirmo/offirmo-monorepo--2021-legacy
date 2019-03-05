import { WebDebugApi } from '@offirmo/web-debug-api-interface'
import { createLogger } from '@offirmo/practical-logger-minimal-to-void'


function create(): WebDebugApi {
	const NO_OP = () => {}
	const NO_OP_LOGGER = createLogger()

	return {
		getLogger: () => NO_OP_LOGGER,
		addDebugCommand: NO_OP,
	}
}

window._debug = window._debug || create()
const instance: WebDebugApi = window._debug

const {
	getLogger,
	addDebugCommand,
} = instance

export {
	getLogger,
	addDebugCommand,
}
