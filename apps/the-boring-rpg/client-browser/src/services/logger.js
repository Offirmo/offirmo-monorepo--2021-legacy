'use strict'

import { createLogger } from '@offirmo/practical-logger-browser'

import { LIB } from './consts'
import { VERSION, BUILD_DATE } from './build'
/////////////////////////////////////////////////

const logger = createLogger({
	name: LIB,
	level: 'silly',
})


logger.notice(`Hello from "${LIB}", v${VERSION} ${BUILD_DATE}! Logger up with level = "${logger.getLevel()}".`)

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
