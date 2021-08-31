import { promiseTry } from '@offirmo-private/promise-try'
import { get_UTC_timestamp_ms } from '@offirmo-private/timestamps'
import { createError as _createError, normalizeError } from '@offirmo/error-utils'


import { INTERNAL_PROP } from '../../consts'
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
					err => normalizeError(err, { alwaysRecreate: true }),
					err => SEC._decorateErrorWithLogicalStack(err),
					err => SEC._decorateErrorWithDetails(err),
				],
				onError: shouldRethrow
					? null
					: err => SEC.emitter.emit('final-error', { SEC, err: cleanTemp(err) }),
			})(err)
		}

		prototype._decorateErrorWithDetails = function _decorateErrorWithDetails(err) {
			const SEC = this
			const state = SEC[INTERNAL_PROP]
			const now = get_UTC_timestamp_ms()

			const autoDetails = {
				ENV: state.plugins[ID_DI].context.ENV,
				TIME: now,
				SESSION_DURATION_MS: now - state.plugins[ID_DI].context.SESSION_START_TIME_MS,
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

		// useful if creating an error later from a saved SEC, ex. from a pipeline
		prototype.createError = function createError(message, details = {}) {
			const SEC = this
			const err = _createError(message, details)
			err.framesToPop = (err.framesToPop || 0) + 1

			return SEC._decorateErrorWithLogicalStack(
				SEC._decorateErrorWithDetails(err)
			)
		}

		// for termination promises
		prototype.handleError = function handleError(err) {
			const SEC = this
			SEC._handleError({
				SEC,
				debugId: 'handleError',
				shouldRethrow: false,
			}, err)
		}

		prototype.xTry = function xTry(operation, fn) {
			console.assert(!!operation)
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
			console.assert(!!operation)
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

		prototype.xNewPromise = function xPromise(operation, resolver_fn) {
			console.assert(!!operation)
			const SEC = this
				.createChild()
				.setLogicalStack({operation})

			const params = SEC[INTERNAL_PROP].plugins[ID_DI].context

			return (new Promise(resolver_fn.bind(undefined, params)))
				.catch(err => {
					SEC._handleError({
						SEC,
						debugId: 'xPromise',
						shouldRethrow: true,
					}, err)
				})
		}

		prototype.xPromiseTry = function xPromiseTry(operation, fn) {
			console.assert(!!operation)
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


	},
}

export {
	PLUGIN,
}
