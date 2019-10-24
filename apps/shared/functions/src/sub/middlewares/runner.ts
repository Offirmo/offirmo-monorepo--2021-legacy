import assert from 'tiny-invariant'
import { get_UTC_timestamp_ms } from '@offirmo-private/timestamps'

import {
	APIGatewayEvent,
	Context,
	NetlifyContext,
	Response,
} from '../types'

import { XError, SEC, XSECEventDataMap } from '../services/sec'
import { on_error as report_to_sentry } from '../services/sentry'
import { CHANNEL } from '../services/channel'
import { MiddleWare} from './types'
import {create_error} from "../utils";


const MARGIN_AND_SENTRY_BUDGET_MS = CHANNEL === 'dev' ? 5000 : 1000


function err_to_response(err: XError): Response {
	const statusCode = err.statusCode || 500
	const body = err.res || `[Error] ${err.message || 'Unknown error!'}`

	return {
		statusCode,
		body,
	}
}


export function use_middlewares_with_error_safety_net(
	event: APIGatewayEvent,
	badly_typed_context: Context,
	middlewares: MiddleWare[],
): Promise<Response> {
	console.log('\n\n → → → → → → → → → → → → → → → → → → → → →')
	const SESSION_START_TIME = get_UTC_timestamp_ms()

	return new Promise<Response>((resolve) => {
		const context: NetlifyContext = badly_typed_context as any

		// overwrite to match handling
		SEC.injectDependencies({ SESSION_START_TIME })

		///////////////////// Setup /////////////////////
		SEC.xTry('MW1', ({SEC, logger}) => {
			logger.log('Starting handling: ' + event.path + '…', {time: get_UTC_timestamp_ms()})
			// TODO breadcrumb

			assert(middlewares.length >= 1, 'please provide some middlewares!')

			let timeout_id: ReturnType<typeof setTimeout> | null = null
			let is_emitter_waiting = false
			function clean() {
				if (timeout_id) {
					clearTimeout(timeout_id)
					timeout_id = null
				}
				if (is_emitter_waiting) {
					SEC.emitter.off('final-error', on_final_error_h)
					is_emitter_waiting = false
				}
			}

			async function on_final_error(err: XError) {
				clean()

				logger.fatal('⚰️ Final error:', err)

				if (CHANNEL === 'dev') {
					logger.info('(not reported since dev)')
				} else {
					logger.info('(this error will be reported)')
					try {
						await report_to_sentry(err)
					} catch (err) {
						console.error('XXX huge error in the error handler itself! XXX')
					}
				}

				// note: once resolved, the code will be frozen by AWS lambda
				// so this must be last
				const response = err_to_response(err)
				logger.info('FYI resolving with:', {status: response.statusCode})
				resolve(response)
			}

			async function on_final_error_h({err}: XSECEventDataMap['final-error']) {
				logger.trace('on_final_error_h')
				is_emitter_waiting = false
				await on_final_error(err)
			}
			SEC.emitter.once('final-error').then(on_final_error_h)
			is_emitter_waiting = true

			context.callbackWaitsForEmptyEventLoop = false // cf. https://httptoolkit.tech/blog/netlify-function-error-reporting-with-sentry/

			const remaining_time_ms = context.getRemainingTimeInMillis ? context.getRemainingTimeInMillis() : 10_000
			const time_budget_ms = Math.max(remaining_time_ms - MARGIN_AND_SENTRY_BUDGET_MS, 0)
			logger.info('Setting timeout...', {time_budget_ms})
			timeout_id = setTimeout(() => {
				timeout_id = null
				SEC.xTryCatch('timeout', ({logger}) => {
					logger.fatal('⏰ timeout!')
					throw new Error('Timeout handling this request!')
				})
			}, time_budget_ms)

			///////////////////// invoke /////////////////////

			SEC.xPromiseTry<Response>('MW2', async ({SEC, logger}) => {
					logger.trace('Invoking MW(s)_')

					const response: Response = {
						statusCode: 500,
						body: 'Bad handler: response unmodified!'
					}

					async function next(index: number): Promise<void> {
						if (index >= middlewares.length)
							return

						return middlewares[index](SEC, event, context, response, next.bind(null, index + 1))
					}

					try {
						await next(0)
					}
					catch (err) {
						logger.error('FYI MW rejected with:', err)
						throw err
					}

					let { statusCode, body } = response
					if (!statusCode || Math.trunc(Number(statusCode)) !== statusCode)
						throw new Error('The middleware(s) returned an invalid response (statusCode)!')

					if (!body)
						throw new Error('The middleware(s) returned an invalid response (body)!')

					logger.trace('FYI MW resolved with:', {status: statusCode, body_type: typeof body})

					let pseudo_err: XError | null = null
					if (statusCode >= 400) {
						const is_body_err_message = typeof body === 'string' && body.toLowerCase().includes('error')
						pseudo_err = create_error(is_body_err_message ? body : statusCode, { statusCode })
					}

					// as a convenience, stringify the body automatically
					try {
						try {
							if (typeof body !== 'string')
								throw new Error('Internal')
							else
								JSON.parse(body)
						}
						catch {
							body = JSON.stringify(body) // TODO stable
						}
					}
					catch {
						throw new Error('The middleware(s) returned a non-JSON-stringified body and it couldn’t be fixed automatically!')
					}

					if (pseudo_err)
						throw pseudo_err // so that it get consistently reported

					return {
						statusCode,
						body,
					}
				})
				.then((response: Response) => {
					// success!
					clean()

					// must be last,
					resolve(response)
				})
				.catch(on_final_error)
		})
	})
	.then((response: any) => {
		console.log('FYI Overall promise resolved with:', response)
		return response
	})
	.catch(err => {
		console.error('FYI Overall promise rejected with:', err)
		throw err
	})
	.finally(() => {
		console.log(`FYI processed in ${(get_UTC_timestamp_ms() - SESSION_START_TIME) / 1000.}s`)
	})
}
