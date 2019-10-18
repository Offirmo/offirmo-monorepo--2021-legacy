import {
	APIGatewayEvent,
	Context,
	NetlifyContext,
	Response,
	NetlifyHandler,
	NetlifyClientContext,
} from './sub/types'

import { XSoftExecutionContext, XError, SEC, XSECEventDataMap } from './sub/services/sec'
import { create_error } from './sub/utils'
import { on_error } from './sub/services/sentry'
import { CHANNEL } from './sub/services/channel'
import {
	ensure_netlify_logged_in,
	get_netlify_user_data,
} from './sub/netlify'
import {get_default_JsonRpc_error} from "./sub/consts";

function err_to_response(err: XError): Response {
	const statusCode = err.statusCode || 500
	const res = err.res || `[Error] ${err.message || 'Unknown error!'}`

	return {
		statusCode,
		body: JSON.stringify(res),
	}
}

async function _handler(
	SEC: XSoftExecutionContext,
	event: APIGatewayEvent,
	context: NetlifyContext,
): Promise<Response> {
	try {
		throw new Error('TEST caught!')
	}
	catch (err) {
		// ignore
	}

	//return { statusCode: 200, body: 'nominal.' }
	//throw new Error('Test sync!')
	//throw create_error('TEST sync!', { statusCode: 555 })
	//new Promise(() => { throw create_error('TEST in uncaught promise!', { statusCode: 555 }) })
	return new Promise<Response>((resolve) => {
		setTimeout(() => {
			throw create_error('TEST in uncaught async!', { statusCode: 555 })
		}, 100)
	})
}


const handler: NetlifyHandler = (
	event: APIGatewayEvent,
	badly_typed_context: Context,
): Promise<Response> => {
	return new Promise((resolve, reject) => {
		const context: NetlifyContext = badly_typed_context as any

		///////////////////// Setup /////////////////////
		SEC.xTry('SEC-MW-1', ({SEC, logger}) => {
			logger.trace('Starting handling…', {path: event.path})

			let timeout_id: ReturnType<typeof setTimeout> | null = null

			async function on_error({SEC, err}: XSECEventDataMap['final-error']) {
				//console.error('on SEC final-error in MW', err.message)
				logger.error('Final error!', err)

				if (CHANNEL === 'dev') {
					logger.fatal('↑ error! (no report since dev)')
				}
				else {
					logger.fatal('↑ this error will be reported')
					/*try {
						await on_error(err)
					}
					catch(err) {
						console.error('XXX huge error in the error handler itself! XXX')
					}*/
				}

				resolve(err_to_response(err))

				if (timeout_id) {
					clearTimeout(timeout_id)
					timeout_id = null
				}
			}
			logger.trace('Listening to errors…')
			SEC.emitter.once('final-error').then(on_error)
			//context.callbackWaitsForEmptyEventLoop = false

			const remaining_time_ms = context.getRemainingTimeInMillis ? context.getRemainingTimeInMillis() : 10_000
			logger.trace('Setting timeout...', {remaining_time_ms})
			timeout_id = setTimeout(() => {
				const err = new Error('Timeout handling this request!')
				logger.fatal('timeout', { err, remaining_time_ms })
				timeout_id = null
				throw err
			}, Math.max(remaining_time_ms - 500, 0))

			///////////////////// invoke /////////////////////

			SEC.xPromiseTryCatch('SEC-MW-2', ({SEC, logger}) => {
					return SEC.xPromiseTry('SEC-MW-handler', () => {
						logger.trace('Invoking_')

						return _handler(SEC, event, context)
					})
						.then((response: any) => {
							logger.trace('FYI _handler resolved with:', { status: response.statusCode})
							return response
						})
						.catch((err: XError) => {
							logger.error('FYI _handler rejected! with:', err)
							throw err
						})
						.then((response: any) => {
							if (!response || !response.statusCode || !response.body)
								throw new Error('Incorrect response returned by the handler!!')

							logger.info('FYI resolving with:', { status: response.statusCode})
							resolve(response)
							if (timeout_id) {
								clearTimeout(timeout_id)
								timeout_id = null
							}
							SEC.emitter.off('final-error', on_error)
						})
				})
				.then((response: any) => {
					logger.trace('FYI MW resolved', response)
					return response
				})
				.catch((err: XError) => {
					logger.error('FYI MW rejected! with:', err)
					throw err
				})
		})
	})
		.then((response: any) => {
			console.error('FYI Overall promise resolved with:', response)
			return response
		})
		.catch(err => {
			console.error('FYI Overall promise rejected with:', err)
			throw err
		})
}

export { handler }
