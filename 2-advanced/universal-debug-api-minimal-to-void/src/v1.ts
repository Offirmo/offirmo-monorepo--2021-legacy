import { WebDebugApiV1 } from '@offirmo-private/universal-debug-api-interface'
import { createLogger } from '@offirmo-private/practical-logger-minimal-to-void'


export default function create(): WebDebugApiV1 {
	const NO_OP = () => {}
	const NO_OP_LOGGER = createLogger()

	return {
		getLogger: () => NO_OP_LOGGER,
		addDebugCommand: NO_OP,
	}
}
