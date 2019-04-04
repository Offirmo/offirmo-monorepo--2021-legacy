import { WebDebugApiV1 } from '@offirmo/universal-debug-api-interface'
import { createLogger } from '@offirmo/practical-logger-minimal-noop'


export function create(): WebDebugApiV1 {
	const NO_OP = () => {}
	const NO_OP_LOGGER = createLogger()

	return {
		getLogger: () => NO_OP_LOGGER,
		exposeInternal: NO_OP,
		overrideHook: (k, v) => v,
		addDebugCommand: NO_OP,
	}
}
