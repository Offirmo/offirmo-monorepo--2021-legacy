import { getLogger } from '@offirmo/universal-debug-api-minimal-noop'

export function get_logger() {
	return getLogger({
		name: '@tbrpg',
	})
}
