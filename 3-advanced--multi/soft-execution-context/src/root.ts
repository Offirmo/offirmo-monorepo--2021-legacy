import { getGlobalThis } from '@offirmo/globalthis-ponyfill'

import { SoftExecutionContext } from './types'
import { LIB } from './consts'
import { createSEC } from './core'

/////////////////////

const GLOBAL_VAR_NAME = '__global_root_sec'

function getRootSEC<Injections = {}, AnalyticsDetails = {}, ErrorDetails = {}>(): SoftExecutionContext<Injections, AnalyticsDetails, ErrorDetails> {
	const global_this = getGlobalThis()

	if (!global_this[GLOBAL_VAR_NAME]) {
		//console.log(`[${LIB}] Creating root context…`)
		global_this[GLOBAL_VAR_NAME] = createSEC()
	}

	return global_this[GLOBAL_VAR_NAME]
}

/////////////////////

export {
	getRootSEC,
}
