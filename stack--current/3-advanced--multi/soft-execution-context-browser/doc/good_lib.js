/* eslint-disable no-unused-vars */
import { getRootSEC } from '@offirmo-private/soft-execution-context'

const LIB = 'GOOD_LIB'

function get_lib_SEC(parent) {
	return (parent || getRootSEC())
		.createChild()
		.setLogicalStack({module: LIB})
}

let instance_count = 0

function create({SEC} = {}) {
	instance_count++
	SEC = get_lib_SEC(SEC)

	// TODO add an id?
	return SEC.xTryCatch(`instantiating#${instance_count}`, ({logger, ENV}) => {
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

		function foo_sync({x} = {}) {
			SEC.xTry(foo_sync.name, () => {
				if (!x) {
					throw new Error('Missing arg x!') // msg will/should be auto-prefixed :-)
				}
			})

			return 42
		}

		async function foo_async() {
			return SEC.xPromiseTry(foo_async.name, ({logger}) => {
				logger.log('attempting to do X...')
				return new Promise((resolve, reject) => {
					setTimeout(() => reject(new Error('failed to do X in time!')), 100) // msg will/should be auto-prefixed :-)
				})
			})
		}

		return {
			foo_sync,
			foo_async,
		}
	})
}


export {
	create,
}
