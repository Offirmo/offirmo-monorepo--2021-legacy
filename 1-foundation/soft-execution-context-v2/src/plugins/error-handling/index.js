import { INTERNAL_PROP } from '../../constants.js'
import * as TopState from '../../state.js'
import * as State from './state.js'
import { createCatcher } from './catch-factory.js'

const ID = 'error_handling'

const PLUGIN = {
	id: ID,
	state: State,
	augment: prototype => {


		function xTry(operation, fn) {
			const sub_SEC = this
				.create_child()
				.set_logical_stack({operation})

			const params = { SEC: sub_SEC }
			try {
				return fn(params)
			}
			catch (err) {
				createCatcher({
					debugId: 'xTry',
					decorators: sub_SEC[INTERNAL_PROP].errDecorators,
					onError: null, //< note this: will cause rethrow
				})(err)
			}
		}

		function xTryCatch(operation, fn) {
			const sub_SEC = SEC.create_child({operation})
			const params = {...sub_SEC[INTERNAL_PROP].DI.context, SEC: sub_SEC}
			try {
				return fn(params)
			}
			catch (err) {
				createCatcher({
					debugId: 'xTryCatch',
					decorators: sub_SEC[INTERNAL_PROP].errDecorators,
					onError,
				})(err)
			}
		}

		function xPromiseCatch(operation, promise) {
			const sub_SEC = SEC.create_child({operation})
			return promise
				.catch(err => {
					createCatcher({
						debugId: 'xPromiseCatch',
						decorators: sub_SEC[INTERNAL_PROP].errDecorators,
						onError,
					})(err)
				})
		}

		function xPromiseTry(operation, fn) {
			const sub_SEC = SEC.create_child({operation})
			const params = {...sub_SEC[INTERNAL_PROP].DI.context, SEC: sub_SEC}
			return promiseTry(() => fn(params))
				.catch(err => {
					createCatcher({
						debugId: 'xPromiseTry',
						decorators: sub_SEC[INTERNAL_PROP].errDecorators,
						onError: null,
					})(err)
				})
		}

		function xPromiseTryCatch(operation, fn) {
			const sub_SEC = SEC.create_child({operation})
			const params = {...sub_SEC[INTERNAL_PROP].DI.context, SEC: sub_SEC}
			return promiseTry(() => fn(params))
				.catch(createCatcher({
					debugId: 'xPromiseTryCatch',
					decorators: sub_SEC[INTERNAL_PROP].errDecorators,
					onError,
				}))
		}

		prototype.xTry = xTry
		/*	xTryCatch,
          xPromiseTry,
          xPromiseCatch,
          xPromiseTryCatch,*/
	}
}

export {
	PLUGIN,
}
