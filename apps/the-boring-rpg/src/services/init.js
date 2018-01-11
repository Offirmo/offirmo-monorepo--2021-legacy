"use strict";

import * as soft_execution_context from '@offirmo/soft-execution-context-browser'
import { migrate_to_latest, reseed } from '@oh-my-rpg/state-the-boring-rpg'
const { createLogger } = require('@offirmo/practical-logger-browser')
import { DEFAULT_SEED } from '@oh-my-rpg/state-prng'

import { LS_KEYS } from './consts'

/////////////////////////////////////////////////

const logger = createLogger({
	name: 'the-boring-rpg',
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
	module: 'the-boring-rpg',
	onError,
	context: {
		logger,
	}
})
soft_execution_context.setRoot(SEC)

SEC.listenToAll()
//SEC.listenToUnhandledRejections()
logger.trace('Soft Execution Context initialized.')

function get_SEC() {
	return SEC
}

/////////////////////////////////////////////////

function init_savegame() {
	return SEC.xTry('init_savegame', ({logger}) => {
		logger.verbose(`Storage key: "${LS_KEYS.savegame}"`)

		const lscontent = localStorage.getItem(LS_KEYS.savegame)
		let state = null
		try {
			if (lscontent)
				state = JSON.parse(lscontent)
		}
		catch (err) {
			// no need
		}
		const was_empty_state = !state

		logger.trace('loaded state:', {state})
		state = migrate_to_latest(SEC, state)

		if (was_empty_state) {
			logger.verbose('Clean savegame created from scratch:', {state})
		}
		else {
			logger.trace('migrated state:', {state})
		}

		if (state.prng.seed === DEFAULT_SEED) {
			logger.verbose('State reseeded:', {state})
			state = reseed(state)
		}

		if (state.prng.seed === DEFAULT_SEED)
			throw new Error('Reseeding expected!')

		localStorage.setItem(LS_KEYS.savegame, JSON.stringify(state))

		return state
	})
}

/////////////////////////////////////////////////

export {
	SEC,
	init_savegame,
}
