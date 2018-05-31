"use strict";

const soft_execution_context = require('../../dist/src.es7.cjs')

const LIB = 'GOOD_LIB'

let instance_count = 0

function create({SEC} = {}) {
	instance_count++
	SEC = soft_execution_context.isomorphic.create({parent: SEC, module: LIB})

	// TODO add an id!
	return SEC.xTryCatch(`instantiating#${instance_count}`, ({logger, env}) => {
		logger.trace({env})

		// test
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

		function foo_sync({x} = {}) {
			SEC.xTry(foo_sync.name, () => {
				if (!x) {
					throw new Error('Missing arg x!') // msg will be auto-prefixed :-)
				}
			})

			return 42
		}

		async function foo_async() {
			return SEC.xPromiseTry(foo_async.name, ({logger}) => {
				logger.log('attempting to do X...')
				return new Promise((resolve, reject) => {
					setTimeout(() => reject(new Error('failed to do X in time!')), 100) // msg will be auto-prefixed :-)
				})
			})
		}

		return {
			foo_sync,
			foo_async,
		}
	})
}


module.exports = {
	create,
}
