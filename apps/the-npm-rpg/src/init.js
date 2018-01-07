"use strict";

const Conf = require('conf')

const soft_execution_context = require('@offirmo/soft-execution-context/dist/src.es7.cjs/soft-execution-context-node')
const { compatibleLoggerToConsole } = require('@offirmo/loggers-types-and-stubs')
const { migrate_to_latest } = require('@oh-my-rpg/state-the-boring-rpg')
const { createLogger } = require('@offirmo/soft-execution-context/dist/src.es7.cjs/universal-logger-node')
const { DEFAULT_SEED } = require( '@oh-my-rpg/state-prng')

//const { displayError } = require('@offirmo/soft-execution-context/dist/src.es7.cjs/display-ansi')

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


function get_SEC() {
	return SEC
}

function init_savegame() {
	return SEC.xTry('init_savegame', ({logger}) => {
		const config = new Conf({
			configName: 'state',
			defaults: {},
		})

		logger.verbose(`config path: "${config.path}"`)
		logger.trace('loaded state:', {state: config.store})

		let state = migrate_to_latest(SEC, config.store)

		const is_new_state = state.prng.use_count === 0 && state.prng.seed === DEFAULT_SEED
		if (is_new_state) {
			state = reseed(state)
			logger.verbose('Clean savegame created from scratch + reseeded:', {state})
		}
		else {
			logger.trace('migrated state:', {state})
		}

		if (state.prng.seed === DEFAULT_SEED)
			throw new Error('Reseeding expected!')

		config.clear()
		config.set(state)

		return config
	})
}

/////////////////////////////////////////////////

module.exports = {
	SEC,
	init_savegame,
}
