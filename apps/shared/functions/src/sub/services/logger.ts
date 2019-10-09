'use strict'

import { createLogger } from '@offirmo/practical-logger-core'

import { APP } from '../consts'

/////////////////////////////////////////////////

const logger = createLogger({
	name: APP,
	suggestedLevel: 'error',
})


logger.notice(`Hello from "${APP}", vTODO! Logger up with level = "${logger.getLevel()}".`)


export default logger
