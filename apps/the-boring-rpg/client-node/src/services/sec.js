'use strict'

const { getRootSEC } = require('@offirmo/soft-execution-context')
const {
	listenToUncaughtErrors,
	listenToUnhandledRejections,
	decorateWithDetectedEnv,
} = require('@offirmo/soft-execution-context-node')
const { decorate_SEC } = require('@oh-my-rpg/definitions')
const { createLogger } = require('@offirmo/practical-logger-node')

/////////////////////////////////////////////////

const { APP } = require('../consts')

const logger = createLogger({
	name: APP,
	suggestedLevel: 'silly',
})

// test
/*;[
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
*/

logger.notice(`Hello from ${APP}...`)

/////////////////////////////////////////////////

const SEC = getRootSEC()
	.setLogicalStack({ module: APP })
	.injectDependencies({ logger })

decorate_SEC(SEC)

SEC.emitter.on('final-error', function onError({SEC, err}) {
	// TODO sentry instead
	logger.fatal('error!', {err})
})

SEC.emitter.on('analytics', function onAnalytics({SEC, eventId, details}) {
	// TODO
	console.groupCollapsed(`⚡  Analytics! ⚡  ${eventId}`)
	console.log('details', details)
	console.groupEnd()
})

listenToUncaughtErrors()
listenToUnhandledRejections()
decorateWithDetectedEnv()

/////////////////////////////////////////////////

module.exports = SEC

