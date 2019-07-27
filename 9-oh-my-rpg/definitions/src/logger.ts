import { getLogger } from '@offirmo/universal-debug-api-minimal-noop'

import { PRODUCT } from './consts'

export function get_logger() {
	return getLogger({
		name: PRODUCT,
	})
}
