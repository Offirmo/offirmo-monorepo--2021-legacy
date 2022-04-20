'use strict'

import { getLogger } from '@offirmo/universal-debug-api-browser'

import { LIB } from '../consts'

/////////////////////////////////////////////////

const logger = getLogger({
	name: LIB,
	suggestedLevel: 'silly',
	//suggestedLevel: 'error',
})

logger.verbose(`Hello from "${LIB}"! Logger up with level = "${logger.getLevel()}" ✔`)

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
