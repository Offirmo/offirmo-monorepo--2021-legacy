import { normalizeError } from '@offirmo/normalize-error'
import { promiseTry } from '@offirmo/promise-try'

import { INTERNAL_PROP } from '../../constants'
import { flattenToOwn } from '../../utils'
import * as State from './state'
import { createCatcher } from './catch-factory'
import { ID as ID_DI } from '../dependency-injection/index'

const PLUGIN_ID = 'error_handling'

function cleanTemp(err) {
	delete err._temp
	return err
}

const PLUGIN = {
	id: PLUGIN_ID,
	state: State,
	augment: prototype => {

		prototype._decorateErrorWithDetails = function _decorateErrorWithDetails(err) {
			const SEC = this
			const state = SEC[INTERNAL_PROP]

			const autoDetails = {
				ENV: state.plugins[ID_DI].context.ENV,
			}
			const userDetails = flattenToOwn(state.plugins[PLUGIN_ID].details)
			err.details = {
				...autoDetails,
				...userDetails,
				...(err.details || {}),
			}

			return err
		}

		prototype.xTry = function xTry(operation, fn) {
			const SEC = this
				.createChild()
				.setLogicalStack({operation})

			const params = SEC[INTERNAL_PROP].plugins[ID_DI].context

			try {
				return fn(params)
			}
			catch (err) {
				createCatcher({
					debugId: 'xTry',
					decorators: [
						normalizeError,
						err => SEC._decorateErrorWithLogicalStack(err),
						err => SEC._decorateErrorWithDetails(err),
					],
					onError: null, //< note: will cause rethrow
				})(err)
			}
		}

		prototype.xTryCatch = function xTryCatch(operation, fn) {
			const SEC = this
				.createChild()
				.setLogicalStack({operation})

			const params = SEC[INTERNAL_PROP].plugins[ID_DI].context

			try {
				return fn(params)
			}
			catch (err) {
				createCatcher({
					debugId: 'xTryCatch',
					decorators: [
						normalizeError,
						err => SEC._decorateErrorWithLogicalStack(err),
						err => SEC._decorateErrorWithDetails(err),
					],
					onError: err => SEC.emitter.emit('final-error', { SEC, err: cleanTemp(err) }),
				})(err)
			}
		}

		prototype.xPromiseCatch = function xPromiseCatch(operation, promise) {
			const SEC = this
				.createChild()
				.setLogicalStack({operation})

			return promise
				.catch(err => {
					createCatcher({
						debugId: 'xPromiseCatch',
						decorators: [
							normalizeError,
							err => SEC._decorateErrorWithLogicalStack(err),
							err => SEC._decorateErrorWithDetails(err),
						],
						onError: err => SEC.emitter.emit('final-error', { SEC, err: cleanTemp(err) }),
					})(err)
				})
		}

		prototype.xPromiseTry = function xPromiseTry(operation, fn) {
			const SEC = this
				.createChild()
				.setLogicalStack({operation})

			const params = SEC[INTERNAL_PROP].plugins[ID_DI].context

			return promiseTry(() => fn(params))
				.catch(err => {
					createCatcher({
						debugId: 'xPromiseTry',
						decorators: [
							normalizeError,
							err => SEC._decorateErrorWithLogicalStack(err),
							err => SEC._decorateErrorWithDetails(err),
						],
						onError: null, //< note: will cause rethrow
					})(err)
				})
		}

		prototype.xPromiseTryCatch = function xPromiseTryCatch(operation, fn) {
			const SEC = this
				.createChild()
				.setLogicalStack({operation})

			const params = SEC[INTERNAL_PROP].plugins[ID_DI].context

			return promiseTry(() => fn(params))
				.catch(createCatcher({
					debugId: 'xPromiseTryCatch',
					decorators: [
						normalizeError,
						err => SEC._decorateErrorWithLogicalStack(err),
						err => SEC._decorateErrorWithDetails(err),
					],
					onError: err => SEC.emitter.emit('final-error', { SEC, err: cleanTemp(err) }),
				}))
		}
	}
}

export {
	PLUGIN,
}
