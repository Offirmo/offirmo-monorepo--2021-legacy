"use strict";

import * as soft_execution_context from '@offirmo/soft-execution-context-browser'
const { createLogger } = require('@offirmo/practical-logger-browser')

import { LIB } from './consts'

/////////////////////////////////////////////////

const logger = createLogger({
	name: LIB,
	level: 'silly',
})
logger.trace(`Logger up with level "${logger.getLevel()}".`)

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
	].forEach(level => logger[level]({level}))
	console.groupEnd()
}

function onError(err) {
	logger.fatal('error!', {err})
}

// TODO report sentry
const SEC = soft_execution_context.browser.create({
	module: LIB,
	onError,
	context: {
		logger,
	}
})
soft_execution_context.setRoot(SEC)

SEC.listenToAll()
//SEC.listenToUnhandledRejections()
logger.trace('Soft Execution Context initialized.')

/////////////////////////////////////////////////

export default SEC
