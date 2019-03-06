import { WebDebugApi } from '@offirmo/universal-debug-api-interface'
import { createLogger } from '@offirmo/practical-logger-minimal-to-void'


export function create(): WebDebugApi {
	const NO_OP = () => {}
	const NO_OP_LOGGER = createLogger()

	return {
		getLogger: () => NO_OP_LOGGER,
		addDebugCommand: NO_OP,
	}
}
