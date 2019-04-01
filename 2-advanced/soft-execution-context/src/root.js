import { getGlobalThis } from '@offirmo/globalthis-ponyfill'

import { LIB } from './consts'
import { createSEC } from './core'

/////////////////////

const GLOBAL_VAR_NAME = '__global_root_sec'
function getRootSEC() {
	const global_this = getGlobalThis()

	if (!global_this[GLOBAL_VAR_NAME]) {
		console.log(`[${LIB}: Creating root SEC…]`) // XXX
		global_this[GLOBAL_VAR_NAME] = createSEC()
	}

	return global_this[GLOBAL_VAR_NAME]
}

/////////////////////

export {
	getRootSEC,
}
