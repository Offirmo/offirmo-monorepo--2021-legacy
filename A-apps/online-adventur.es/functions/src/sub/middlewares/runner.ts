import '../services/sec'

import assert from 'tiny-invariant'
import stable_stringify from 'json-stable-stringify'
import { get_UTC_timestamp_ms } from '@offirmo-private/timestamps'
import { getRootSEC, SoftExecutionContext, OperationParams } from '@offirmo-private/soft-execution-context'
import { XXError } from '@offirmo-private/error-utils'
import {
	OAServerResponseBody,
	create_server_response_body__data,
	create_server_response_body__error,
} from '@online-adventur.es/functions-interface'

import {
	APIGatewayEvent,
	Context,
	NetlifyContext,
	Response,
} from '../types'
import { LXXError, XSECEventDataMap, Injections } from '../services/sec'
import { on_error as report_to_sentry } from '../services/sentry'
import { CHANNEL } from '../services/channel'
import { create_error, loosely_get_clean_path } from '../utils'
import { MiddleWare, XSoftExecutionContext } from './types'

////////////////////////////////////

// note: deducted from the overall running budget
const MARGIN_AND_SENTRY_BUDGET_MS = CHANNEL === 'dev' ? -5000 : -1000

////////////////////////////////////

function _get_response_from_error(err: LXXError): Response {
	const statusCode = err?.statusCode || 500
	const body = err?.res || `[Error] ${err?.message || 'Unknown error!'}`

	return {
		statusCode,
		headers: {},
		body,
	}
}

interface LocalLSInjections extends Injections {
	local_mutable: {
		last_invoked_mw: string
	}
}
type LSoftExecutionContext = SoftExecutionContext<LocalLSInjections>
type LOperationParams = OperationParams<LocalLSInjections>

////////////////////////////////////

export function use_middlewares_with_error_safety_net(
	event: APIGatewayEvent,
	badly_typed_context: Context,
	middlewares: MiddleWare[],
	SEC: XSoftExecutionContext = getRootSEC(),
): Promise<Response> {
	console.log('\n\n\n\n' +Array.from({length: 100}, () => '→').join(' '))

	const SESSION_START_TIME_MS = get_UTC_timestamp_ms()

	return SEC.xTry('MWRunner', ({SEC, logger}) => {
		const context: NetlifyContext = badly_typed_context as any

		// overwrite to match handling
		SEC.injectDependencies({ SESSION_START_TIME_MS })

		///////////////////// Setup /////////////////////
		return _run_with_safety_net(
			SEC,
			event, context, middlewares,
		)
	})
	.then(
		(response: Response) => { console.log('FYI MWRunner promise resolved with:', response); return response },
		(err: Error) => { console.warn('FYI MWRunner promise rejected with:', err); throw err },
	)
	.then((response: Response) => {
		assert(response.statusCode >= 200)
		assert(response.statusCode < 300)

		response.body = create_server_response_body__data(JSON.parse(response.body)) as any // temporarily passing as string

		return response
	})
	.catch((err: XXError) => {
		const response: Response = {
			statusCode: err.statusCode || 500,
			headers: {},
			body: create_server_response_body__error(err) as any // temporarily passing as string
		}

		return response
	})
	.then((response: Response) => {
		const body: OAServerResponseBody<any> = response.body as any

		// add side infos TODO
		body.side.latest_news = body.side.latest_news || []

		// add meta
		body.meta.processing_time_ms = get_UTC_timestamp_ms() - SESSION_START_TIME_MS
		body.meta.request_summary = `${event.httpMethod.toUpperCase()}:${event.path}`

		// finally stringify
		response.body = JSON.stringify(body)

		return response
	})
	.then(
		(response: Response) => { console.log('FYI Overall promise resolved with:', response); return response },
		(err: Error) => { console.warn('FYI Overall promise rejected with:', err); throw err },
	)
	.finally(() => {
		console.log(`FYI processed in ${(get_UTC_timestamp_ms() - SESSION_START_TIME_MS) / 1000.}s`)
	})
}

function _run_with_safety_net(
	SEC: SoftExecutionContext,
	event: APIGatewayEvent,
	context: NetlifyContext,
	middlewares: MiddleWare[],
): Promise<Response> {
	return SEC.xPromiseTry((event?.httpMethod?.toUpperCase() || '???') + '/' + (loosely_get_clean_path(event) || '???'), ({SEC}) =>
		SEC.xNewPromise('⓵ ', ({SEC, logger}, resolve) => {
			const PREFIX = 'MR1'
			logger.log(`[${PREFIX}] Starting handling: ${event.httpMethod.toUpperCase()} ${event.path}…`, {time: get_UTC_timestamp_ms(), mw_count: middlewares.length})

			assert(middlewares.length >= 1, `[${PREFIX}] please provide some middlewares!`)

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

			async function on_final_error(err: LXXError) {
				clean()

				logger.fatal(`⚰️ [${PREFIX}] Final error:`, err)

				if (CHANNEL === 'dev') {
					logger.info(`([${PREFIX}] error not reported to sentry since dev)`)
				} else {
					logger.info(`([${PREFIX}] this error will be reported to sentry)`)
					try {
						await report_to_sentry(err)
					} catch (err) {
						console.error(`XXX [${PREFIX}] huge error in the error handler itself! XXX`)
					}
				}

				// note: once resolved, the code will be frozen by AWS lambda
				// so this must be last
				const response = _get_response_from_error(err)
				logger.info(`[${PREFIX}] FYI resolving with:`, {status: response.statusCode})
				resolve(response)
			}

			async function on_final_error_h({err}: XSECEventDataMap['final-error']) {
				logger.trace(`[${PREFIX}] on_final_error_h`)
				is_emitter_waiting = false
				await on_final_error(err)
			}
			SEC.emitter.once('final-error').then(on_final_error_h)
			is_emitter_waiting = true

			context.callbackWaitsForEmptyEventLoop = false // cf. https://httptoolkit.tech/blog/netlify-function-error-reporting-with-sentry/

			const LSEC = SEC as any as LSoftExecutionContext
			LSEC.injectDependencies({
				local_mutable: {
					last_invoked_mw: '(none yet)'
				}
			})
			const remaining_time_ms = context.getRemainingTimeInMillis ? context.getRemainingTimeInMillis() : 10_000
			const time_budget_ms = Math.max(remaining_time_ms + MARGIN_AND_SENTRY_BUDGET_MS, 0)
			logger.info(`[${PREFIX}] Setting timeout…`, {time_budget_ms})
			timeout_id = setTimeout(() => {
				timeout_id = null
				LSEC.xTryCatch('timeout', ({logger}) => {
					const { local_mutable } = LSEC.getInjectedDependencies()
					logger.fatal(`⏰ [${PREFIX}] timeout!`, local_mutable)
					throw new Error(`[${PREFIX}] Timeout handling this request! (mw=${local_mutable.last_invoked_mw})`)
				})
			}, time_budget_ms)

			///////////////////// invoke /////////////////////
			logger.trace(`[${PREFIX}] Invoking the middleware chain…`)

			void LSEC.xPromiseTry<Response>('⓶ ', async params => _run_mw_chain(
					params,
					event, context, middlewares,
				))
				.then((response: Response) => {
					// success!
					clean()

					// must be last,
					resolve(response)
				})
				.catch(on_final_error)
		})
	)
}

async function _run_mw_chain(
	{ SEC, logger }: LOperationParams,
	event: APIGatewayEvent,
	context: NetlifyContext,
	middlewares: MiddleWare[],
): Promise<Response> {
	const PREFIX = 'MR2'
	const STATUS_CODE_NOT_SET_DETECTOR = -1
	const DEFAULT_RESPONSE_BODY = `[${PREFIX}] Bad middleware chain: no response set!`
	const DEFAULT_MW_NAME = 'anonymous'

	logger.trace(`[${PREFIX}] Invoking a chain of ${middlewares.length} middlewares…`)

	const response: Response = {
		statusCode: STATUS_CODE_NOT_SET_DETECTOR,
		headers: {},
		body: DEFAULT_RESPONSE_BODY,
	}

	////////////////////////////////////

	let last_manual_error_call_SEC: LSoftExecutionContext | null = null
	let _previous_status_code: Response['statusCode'] = response.statusCode
	let _previous_body: Response['body'] = response.body
	function _check_response(SEC: LSoftExecutionContext, mw_index: number, stage: 'in' | 'out') {
		const { logger } = SEC.getInjectedDependencies()
		assert(mw_index >= 0 && mw_index < middlewares.length, 'mw_index')
		let { statusCode, body } = response
		const current_mw_name = middlewares[mw_index].name || DEFAULT_MW_NAME
		let mw_debug_id = current_mw_name
		if (mw_index < middlewares.length)
			mw_debug_id += '(' + stage + ')'
		//console.log('_check_response', {mw_index, mw_debug_id}, '\nfrom SEC:', SEC.getLogicalStack(), '\n', SEC.getShortLogicalStack())

		if (statusCode !== _previous_status_code) {
			logger.trace(`[${PREFIX}] FYI The middleware "${mw_debug_id}" set the statusCode:`, { statusCode })
			if (!statusCode || Math.trunc(Number(statusCode)) !== statusCode)
				throw new Error(`[${PREFIX}] The middleware "${mw_debug_id}" set an invalid statusCode!`)
			if (statusCode >= 400) {
				logger.warn(`[${PREFIX}] FYI The middleware "${mw_debug_id}" set an error statusCode:`, {statusCode})
				last_manual_error_call_SEC = SEC
			}

			_previous_status_code = statusCode
		}

		if (body !== _previous_body) {
			logger.trace(`[${PREFIX}] FYI The middleware "${mw_debug_id}" set the body:`, { body })
			if (!body)
				throw new Error(`[${PREFIX}] The middleware "${mw_debug_id}" set an invalid empty body!`)
			if (statusCode < 400) {
				if (typeof body === 'string') {
					try {
						JSON.parse(body) // check if it's correct json
					} catch (err) {
						throw new Error(`[${PREFIX}] The middleware "${mw_debug_id}" set an non-json body!`)
					}
				} else {
					try {
						stable_stringify(body)
						// TODO deep compare to check for un-stringifiable stufff??
					} catch {
						throw new Error(`[${PREFIX}] The middleware "${mw_debug_id}" set a non-JSON-stringified body that can’t be fixed automatically!`)
					}
				}
			}

			_previous_body = body
		}
	}

	////////////////////////////////////

	let _last_SEC: LSoftExecutionContext = SEC
	let _last_reported_err_msg: LXXError['message'] | null = null
	async function next(SEC: LSoftExecutionContext, index: number): Promise<void> {
		if (index > 0) {
			_check_response(_last_SEC, index - 1, 'in')
		}

		if (index >= middlewares.length)
			return

		const current_mw_name = middlewares[index].name || DEFAULT_MW_NAME
		await SEC.xPromiseTry('mw:' + current_mw_name, async ({ SEC }) => {
				_last_SEC = SEC
				//console.log('_last_SEC now =', SEC.getLogicalStack(), '\n', SEC.getShortLogicalStack())
				logger.trace(`[${PREFIX}] invoking middleware ${index+1}/${middlewares.length} "${current_mw_name}"…`)
				const { local_mutable } = SEC.getInjectedDependencies()
				local_mutable.last_invoked_mw = current_mw_name
				await middlewares[index](SEC as XSoftExecutionContext, event, context, response, next.bind(null, SEC, index + 1))
				logger.trace(`[${PREFIX}] returned from middleware ${index+1}/${middlewares.length} "${current_mw_name}"…`)
				_check_response(SEC, index, 'out')
			})
			.catch(err => {
				if (err.message === _last_reported_err_msg) {
					logger.info(`[${PREFIX}] FYI MW "${current_mw_name}" propagated the error.`)
				}
				else {
					logger.error(`[${PREFIX}] FYI MW "${current_mw_name}" rejected with:`, err)
					_last_reported_err_msg = err.message
				}
				throw err
			})

	}

	// launch the chain
	await next(SEC, 0)

	////////////////////////////////////

	let { statusCode, body } = response

	if (response.body === DEFAULT_RESPONSE_BODY)
		throw new Error(DEFAULT_RESPONSE_BODY)

	if (response.statusCode === STATUS_CODE_NOT_SET_DETECTOR) {
		throw new Error('Status code not set!')
	}

	let pseudo_err: LXXError | null = null
	if (statusCode >= 400) {
		assert(last_manual_error_call_SEC, 'error status should have caused a corresponding SEC to be memorized')
		// todo enhance non-stringified?
		const is_body_err_message = typeof body === 'string' && body.toLowerCase().includes('error')
		pseudo_err = create_error(is_body_err_message ? body : statusCode, { statusCode }, last_manual_error_call_SEC)
	}

	if (pseudo_err)
		throw pseudo_err // so that it get consistently reported

	// as a convenience, stringify the body automatically
	// no need to retest, was validated before
	if (typeof body !== 'string') {
		logger.log(`[${PREFIX}] stringifying automatically…`)
		body = stable_stringify(body)
	}

	await new Promise(resolve => setTimeout(resolve, 0)) // to give time to unhandled to be detected. not 100% of course.

	return {
		statusCode,
		headers: {},
		body,
	}
}
