import { DebugApiV1 } from '@offirmo/universal-debug-api-interface'
import { createLogger } from '@offirmo/practical-logger-minimal-noop'


export default function create(): DebugApiV1 {
	function NOP () {}
	const NOP_LOGGER = createLogger()

	return {
		getLogger: () => NOP_LOGGER,
		overrideHook: (k, v) => v,
		exposeInternal: NOP,
		addDebugCommand: NOP,
	}
}
