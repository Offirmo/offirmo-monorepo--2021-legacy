"use strict";

const { createLogger } = require('@offirmo/practical-logger-browser')
const { getRootSEC } = require('@offirmo/soft-execution-context')
const {
	listenToErrorEvents,
	listenToUnhandledRejections,
	decorateWithDetectedEnv,
} = require('@offirmo/soft-execution-context-browser')
const { decorate_SEC } = require('@oh-my-rpg/definitions')

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
	].forEach(level => {
		console.log(`logger demo with level "${level}":`)
		logger[level](`logger demo with level "${level}"`, {level})
	})
}

logger.notice(`Hello from ${LIB}...`)

const SEC = getRootSEC()
	.setLogicalStack({ module: LIB })
	.injectDependencies({ logger })

decorate_SEC(SEC)

SEC.emitter.on('final-error', function onError({SEC, err}) {
	// TODO sentry instead
	logger.fatal('error!', {err})
})

SEC.emitter.on('analytics', function onAnalytics({SEC, eventId, details}) {
	console.groupCollapsed(`⚡  Analytics! ⚡  ${eventId}`)
	console.log('details', details)
	console.groupEnd()
})


/* TODO
listenToErrorEvents()
listenToUnhandledRejections()
*/
decorateWithDetectedEnv()

logger.trace('Soft Execution Context initialized.')

/////////////////////////////////////////////////

export default SEC
