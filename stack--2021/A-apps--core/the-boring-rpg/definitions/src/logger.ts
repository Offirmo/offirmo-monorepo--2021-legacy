import { getLogger } from '@offirmo/universal-debug-api-placeholder'

import { PRODUCT } from './consts'

export function get_logger() {
	return getLogger({
		name: PRODUCT,
	})
}
