import assert from 'tiny-invariant'
import stable_stringify from 'json-stable-stringify'
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


// note: deducted from the overall running budget
const MARGIN_AND_SENTRY_BUDGET_MS = CHANNEL === 'dev' ? 5000 : 1000


function _get_response_from_error(err: XError): Response {
	const statusCode = err?.statusCode || 500
	const body = err?.res || `[Error] ${err?.message || 'Unknown error!'}`

	return {
		statusCode,
		headers: {},
		body,
	}
}

const DEFAULT_STATUS_CODE = 500
const DEFAULT_RESPONSE_BODY = '[MW2] Bad handler chain: no response set!'
const DEFAULT_MW_NAME = 'anonymous'

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
			logger.log('[MW1] Starting handling: ' + event.path + '…', {time: get_UTC_timestamp_ms()})
			// TODO breadcrumb

			assert(middlewares.length >= 1, '[MW1] please provide some middlewares!')

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

				logger.fatal('⚰️ [MW1] Final error:', err)

				if (CHANNEL === 'dev') {
					logger.info('([MW1] not reported since dev)')
				} else {
					logger.info('([MW1] this error will be reported)')
					try {
						await report_to_sentry(err)
					} catch (err) {
						console.error('XXX [MW1] huge error in the error handler itself! XXX')
					}
				}

				// note: once resolved, the code will be frozen by AWS lambda
				// so this must be last
				const response = _get_response_from_error(err)
				logger.info('[MW1] FYI resolving with:', {status: response.statusCode})
				resolve(response)
			}

			async function on_final_error_h({err}: XSECEventDataMap['final-error']) {
				logger.trace('[MW1] on_final_error_h')
				is_emitter_waiting = false
				await on_final_error(err)
			}
			SEC.emitter.once('final-error').then(on_final_error_h)
			is_emitter_waiting = true

			context.callbackWaitsForEmptyEventLoop = false // cf. https://httptoolkit.tech/blog/netlify-function-error-reporting-with-sentry/

			const remaining_time_ms = context.getRemainingTimeInMillis ? context.getRemainingTimeInMillis() : 10_000
			const time_budget_ms = Math.max(remaining_time_ms - MARGIN_AND_SENTRY_BUDGET_MS, 0)
			logger.info('[MW1] Setting timeout...', {time_budget_ms})
			timeout_id = setTimeout(() => {
				timeout_id = null
				SEC.xTryCatch('timeout', ({logger}) => {
					logger.fatal('⏰ [MW1] timeout!')
					throw new Error('[MW1] Timeout handling this request!')
				})
			}, time_budget_ms)

			///////////////////// invoke /////////////////////

			SEC.xPromiseTry<Response>('MW2', async ({SEC, logger}) => {
				logger.trace(`[MW2] Invoking a chain of ${middlewares.length} middlewares…`)
				const response: Response = {
					statusCode: DEFAULT_STATUS_CODE,
					headers: {},
					body: DEFAULT_RESPONSE_BODY,
				}

				let _previous_status_code: Response["statusCode"] = response.statusCode
				let _previous_body: Response["body"] = response.body
				function _check_response(mw_index: number, stage: 'in' | 'out') {
					assert(mw_index >= 0 && mw_index < middlewares.length, 'mw_index')
					let { statusCode, body } = response
					const current_mw_name = middlewares[mw_index].name || DEFAULT_MW_NAME
					let mw_debug_id = current_mw_name
					if (mw_index < middlewares.length)
						mw_debug_id += '(' + stage + ')'

					if (statusCode !== _previous_status_code) {
						logger.trace(`[MW2] FYI The middleware "${mw_debug_id}" set the statusCode:`, { statusCode })
						if (!statusCode || Math.trunc(Number(statusCode)) !== statusCode)
							throw new Error(`[MW2] The middleware "${mw_debug_id}" set an invalid statusCode!`)
						if (statusCode >= 400)
							logger.warn(`[MW2] FYI The middleware "${mw_debug_id}" set an error statusCode:`, { statusCode })

						_previous_status_code = statusCode
					}

					if (body !== _previous_body) {
						logger.trace(`[MW2] FYI The middleware "${mw_debug_id}" set the body:`, { body })
						if (!body)
							throw new Error(`[MW2] The middleware "${mw_debug_id}" set an invalid empty body!`)
						if (statusCode < 400) {
							if (typeof body === 'string') {
								try {
									JSON.parse(body) // check if it's correct json
								} catch (err) {
									throw new Error(`[MW2] The middleware "${mw_debug_id}" set an non-json body!`)
								}
							} else {
								try {
									stable_stringify(body)
									// TODO deep compare to check for un-stringifiable stufff??
								} catch {
									throw new Error(`[MW2] The middleware "${mw_debug_id}" set a non-JSON-stringified body that can’t be fixed automatically!`)
								}
							}
						}

						_previous_body = body
					}
				}

				let last_reported_error: any = null
				async function next(index: number): Promise<void> {
					if (index > 0) {
						_check_response(index - 1, 'in')
					}

					if (index >= middlewares.length)
						return

					const current_mw_name = middlewares[index].name || DEFAULT_MW_NAME
					try {
						logger.trace(`[MW2] invoking middleware ${index+1}/${middlewares.length} "${current_mw_name}"…`)
						await middlewares[index](SEC, event, context, response, next.bind(null, index + 1))
						logger.trace(`[MW2] returning from middleware ${index+1}/${middlewares.length} "${current_mw_name}"…`)
					}
					catch (err) {
						logger.error(`[MW2] FYI MW "${current_mw_name}" rejected with:`, err)
						throw err
					}

					_check_response(index, 'out')
				}

				// launch the chain
				await next(0)

				let { statusCode, body } = response

				if (response.body === DEFAULT_RESPONSE_BODY)
					throw new Error(DEFAULT_RESPONSE_BODY)

				let pseudo_err: XError | null = null
				if (statusCode >= 400) {
					// todo enhance non-stringified?
					const is_body_err_message = typeof body === 'string' && body.toLowerCase().includes('error')
					pseudo_err = create_error(is_body_err_message ? body : statusCode, { statusCode })
				}

				if (pseudo_err)
					throw pseudo_err // so that it get consistently reported

				// as a convenience, stringify the body automatically
				// no need to retest, was validated before
				if (typeof body !== 'string') {
					logger.log('[MW2] stringifying automatically…')
					body = stable_stringify(body)
				}

				await new Promise(resolve => setTimeout(resolve, 0)) // to give time to unhandled to be detected. not 100% of course.

				return {
					statusCode,
					headers: {},
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
