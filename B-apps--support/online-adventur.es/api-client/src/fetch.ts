import fetch_ponyfill from 'fetch-ponyfill'
import { XXError, createError } from '@offirmo/error-utils'
import { getRootSEC, SoftExecutionContext } from '@offirmo-private/soft-execution-context'
import { Immutable, enforce_immutability } from '@offirmo-private/state-utils'

import {
	ReleaseChannel,
	OAServerResponseBody,
	OAResponse,
	get_api_base_url,
} from '@online-adventur.es/api-interface'

/////////////////////////////////////////////////

const { fetch, Response: ResponseV, Headers: HeadersV } = fetch_ponyfill()
export { HeadersV }
export type FetchHeaders = typeof HeadersV
type FetchResponse = typeof ResponseV

/////////////////////////////////////////////////

const _state = { // TODO improve
	request_count: 0, // for logging
	error_count: 0, // circuit breaker to avoid killing Netlify free tier
}

export async function fetch_oa<Req, Res>({
	SEC = getRootSEC(),

	url,
	method = 'GET',
	headers = {},
	body,

	timeout_ms = 10_000,
}: {
	SEC?: SoftExecutionContext

	// like fetch:
	method?: string
	url?: string
	headers?: Immutable<FetchHeaders>
	body?: Immutable<Req>

	// extras
	timeout_ms?: number
} = {}): Promise<Immutable<OAResponse<Res>>> {
	return SEC.xPromiseTry('fetch_oa', async ({ SEC, logger, CHANNEL }) => {
		const request_id = ++_state.request_count
		const channel: ReleaseChannel = CHANNEL as any
		logger.trace(`fetch_oa() #${request_id}…`, { method, url, body, headers })
		const headers_from_SEC = (SEC.getInjectedDependencies() as any).shared_fetch_headers || {}

		if (_state.error_count > 25)
			throw new Error(`fetch_oa(): too many errors in the past, circuit breaker!`) // TODO improve with debounce

		url = [ get_api_base_url(channel), url ].join('/')
		headers = {
			...headers_from_SEC,
			...headers,
			'Content-Type': 'application/json',
		}
		let fetch_response: undefined | FetchResponse = undefined
		let response_for_logging: undefined | FetchResponse | OAServerResponseBody<Res> | OAResponse<Res>
		let candidate_error: XXError | null = null

		return Promise.race([
				new Promise((resolve, reject) => setTimeout(() => {
					reject(new Error('Timeout!'))
				}, timeout_ms)),
				fetch(url, {
					method,
					headers,
					body: JSON.stringify(body),
				}),
			])
			.then((response: FetchResponse) => {
				logger.trace(`fetch_oa() #${request_id}: got fetch response`, { method, url, ok: response.ok, response })
				response_for_logging = fetch_response = response.clone()

				// reminder: we can't destructure response because .json() needs a binding to response

				if (!response.ok) {
					candidate_error = createError(`HTTP error ${response.status} "${response.statusText}"!`, {
						statusCode: response.status
					})
				}
				// even if the response has an error status, we still need to attempt decoding the json
				// since it can hold error data
				if (response.status === 404) {
					// no way to have an OA response if there is no answering endpoint
					return
				}
				else {
					return response
						.json()
						.then(
							(response: OAServerResponseBody<Res>) => response,
							(err: Error) => {
								// failure in decoding
								candidate_error = candidate_error || err
								return // will pick the candidate error
							}
						)
				}
			})
			.then((response: OAServerResponseBody<Res>) => {
				logger.trace(`fetch_oa() #${request_id}: got json body`, { method, url, response })
				response_for_logging = response

				if (!response)
					throw candidate_error || new Error('No response data!')

				const { v, error, data, side = {}, meta = {} } = response
				if (!v)
					throw new Error('body doesnt have the expected OA response format!')
				if (v !== 1)
					throw new Error('Invalid OA response format version!')
				if (error) {
					throw createError('', error)
				}
				// now that we handled the possible error in body, we can fall back to the auto one
				if (!fetch_response.ok) {
					throw candidate_error
				}

				logger.trace(`fetch_oa() #${request_id}: got OA response body`, { method, url, v, error, data, side, meta })

				if (!data) {
					throw new Error('No response data!')
				}

				return enforce_immutability<OAResponse<Res>>({ data, side })
			})
			.catch((err: Error) => {
				logger.warn(`fetch_oa() #${request_id} ended with an error!`, { method, url, response: response_for_logging, err, err_message: err.message})
				_state.error_count++
				throw err
			})
	})
}


