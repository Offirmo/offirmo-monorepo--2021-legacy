"use strict";

const Conf = require('conf')

const soft_execution_context = require('@offirmo/soft-execution-context-node')
const { compatibleLoggerToConsole } = require('@offirmo/loggers-types-and-stubs')
const { migrate_to_latest, reseed } = require('@oh-my-rpg/state-the-boring-rpg')
const { createLogger } = require('@offirmo/practical-logger-node')
const { DEFAULT_SEED } = require( '@oh-my-rpg/state-prng')

const { prettify_json_for_debug } = require('./utils/debug')

/////////////////////////////////////////////////

const logger = createLogger({
	name: 'the-npm-rpg',
	level: 'warn',
})

// test
/*
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
*/

function onError(err) {
	logger.fatal('error!', {err})
}

// TODO report sentry
const SEC = soft_execution_context.node.create({
	module: 'the-npm-rpg',
	onError,
	context: {
		logger,
	}
})
soft_execution_context.setRoot(SEC)

SEC.listenToUncaughtErrors()
SEC.listenToUnhandledRejections()
logger.trace('Soft Execution Context initialized.')

/////////////////////////////////////////////////

module.exports = {
	SEC,
}
