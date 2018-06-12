"use strict";

const Conf = require('conf')

const { createLogger } = require('@offirmo/practical-logger-node')
const { getRootSEC } = require('@offirmo/soft-execution-context')
const {
	listenToUncaughtErrors,
	listenToUnhandledRejections,
	decorateWithDetectedEnv,
} = require('@offirmo/soft-execution-context-node')
const { decorate_SEC } = require('@oh-my-rpg/definitions')
const { migrate_to_latest, reseed } = require('@oh-my-rpg/state-the-boring-rpg')
const { DEFAULT_SEED } = require( '@oh-my-rpg/state-prng')

const { prettify_json_for_debug } = require('./utils/debug')

/////////////////////////////////////////////////

const APP = 'the-npm-rpg'

const logger = createLogger({
	name: APP,
	level: 'warn',
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

const SEC = getRootSEC()
	.setLogicalStack({ module: APP })
	.injectDependencies({ logger })

decorate_SEC(SEC)

SEC.emitter.on('final-error', function onError({SEC, err}) {
	// TODO sentry instead
	logger.fatal('error!', {err})
})

SEC.emitter.on('analytics', function onError({SEC, eventId, details}) {
	console.groupCollapsed(`⚡  Analytics! ⚡  ${eventId}`)
	console.log('details', details)
	console.groupEnd()
})

listenToUncaughtErrors()
listenToUnhandledRejections()
decorateWithDetectedEnv()


logger.trace('Soft Execution Context initialized.')

/////////////////////////////////////////////////

module.exports = {
	SEC,
}
