'use strict'

import { getLogger } from '@offirmo-private/universal-debug-api-full-browser'

import { LIB } from './consts'
import { ENGINE_VERSION, BUILD_DATE } from '@tbrpg/flux'

/////////////////////////////////////////////////

const logger = getLogger({
	name: LIB,
	suggestedLevel: 'error',
})


logger.notice(`Hello from "${LIB}", v${ENGINE_VERSION} ${BUILD_DATE}! Logger up with level = "${logger.getLevel()}".`)

// test
if (false) {
	console.group('Testing log levels...')
	;[
		'fatal',
		'emerg',
		'alert',
		'crit',
		'error',
		'warning',
		'warn',
		'notice',
		'info',
		'verbose',
		'log',
		'debug',
		'trace',
		'silly',
	].forEach(level => {
		console.log(`logger demo with level "${level}":`)
		logger[level](`logger demo with level "${level}"`, {level})
	})
	console.groupEnd()
}

export default logger
