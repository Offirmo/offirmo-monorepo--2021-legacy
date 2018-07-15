import { normalizeError } from '@offirmo/normalize-error'
import { promiseTry } from '@offirmo/promise-try'
import { get_UTC_timestamp_ms } from '@offirmo/timestamps'


import { INTERNAL_PROP } from '../../constants'
import { flattenToOwn } from '../../utils'
import * as State from './state'
import { createCatcher } from './catch-factory'
import { PLUGIN_ID as ID_DI } from '../dependency-injection/index'
import * as TopState from '../../state'

const PLUGIN_ID = 'error_handling'

function cleanTemp(err) {
	delete err._temp
	return err
}

const PLUGIN = {
	id: PLUGIN_ID,
	state: State,
	augment: prototype => {

		prototype._handleError = function handleError({SEC, debugId = '?', shouldRethrow = true}, err) {
			createCatcher({
				debugId,
				decorators: [
					normalizeError,
					err => SEC._decorateErrorWithLogicalStack(err),
					err => SEC._decorateErrorWithDetails(err),
				],
				onError: shouldRethrow
					? null
					: err => SEC.emitter.emit('final-error', { SEC, err: cleanTemp(err) }),
			})(err)
		}

		prototype.throwNewError = function throwNewError(message, details) {
			const SEC = this
			const err = new Error(message)
			err.details = details
			SEC._handleError({
				SEC,
				shouldRethrow: true,
			})
		}


		prototype._decorateErrorWithDetails = function _decorateErrorWithDetails(err) {
			const SEC = this
			const state = SEC[INTERNAL_PROP]
			const now = get_UTC_timestamp_ms()

			const autoDetails = {
				ENV: state.plugins[ID_DI].context.ENV,
				TIME: now,
				SESSION_DURATION_MS: now - state.plugins[ID_DI].context.SESSION_START_TIME,
			}
			const userDetails = flattenToOwn(state.plugins[PLUGIN_ID].details)
			err.details = {
				...autoDetails,
				...userDetails,
				...(err.details || {}),
			}

			return err
		}

		prototype.setErrorReportDetails = function setErrorReportDetails(details) {
			const SEC = this
			let root_state = SEC[INTERNAL_PROP]

			root_state = TopState.reduce_plugin(root_state, PLUGIN_ID, plugin_state => {
				Object.entries(details).forEach(([key, value]) => {
					plugin_state = State.addDetail(plugin_state, key, value)
				})
				return plugin_state
			})

			this[INTERNAL_PROP] = root_state

			return SEC // for chaining
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
				SEC._handleError({
					SEC,
					debugId: 'xTry',
					shouldRethrow: true,
				}, err)
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
				SEC._handleError({
					SEC,
					debugId: 'xTryCatch',
					shouldRethrow: false,
				}, err)
			}
		}

		prototype.xPromiseCatch = function xPromiseCatch(operation, promise) {
			const SEC = this
				.createChild()
				.setLogicalStack({operation})

			return promise
				.catch(err => {
					SEC._handleError({
						SEC,
						debugId: 'xPromiseCatch',
						shouldRethrow: false,
					}, err)
				})
		}

		prototype.xPromiseTry = function xPromiseTry(operation, fn) {
			const SEC = this
				.createChild()
				.setLogicalStack({operation})

			const params = SEC[INTERNAL_PROP].plugins[ID_DI].context

			return promiseTry(() => fn(params))
				.catch(err => {
					SEC._handleError({
						SEC,
						debugId: 'xPromiseTry',
						shouldRethrow: true,
					}, err)
				})
		}

		prototype.xPromiseTryCatch = function xPromiseTryCatch(operation, fn) {
			const SEC = this
				.createChild()
				.setLogicalStack({operation})

			const params = SEC[INTERNAL_PROP].plugins[ID_DI].context

			return promiseTry(() => fn(params))
				.catch(err => {
					SEC._handleError({
						SEC,
						debugId: 'xPromiseTryCatch',
						shouldRethrow: false,
					}, err)
				})
		}
	}
}

export {
	PLUGIN,
}
