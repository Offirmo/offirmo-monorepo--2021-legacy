import { Enum } from 'typescript-string-enums'

import { create_error } from '../utils'
import {
	MiddleWare,
	APIGatewayEvent,
	XSoftExecutionContext,
	NetlifyContext,
	Response,
} from './types'


export const HttpMethod = Enum(
	'GET',
	'PUT',
	'POST',
	'PATCH',
	'OPTIONS'
)
export type HttpMethod = Enum<typeof HttpMethod> // eslint-disable-line no-redeclare



export function require_http_method(allowed_methods: HttpMethod[]): MiddleWare {
	const _require_http_method = async (
		SEC: XSoftExecutionContext,
		event: Readonly<APIGatewayEvent>,
		context: Readonly<NetlifyContext>,
		response: Response,
		next: () => Promise<void>
	): Promise<void> => {
		await SEC.xTry('require_http_method()', async ({ SEC, logger }) => {
			let http_method = event.httpMethod.toUpperCase() as HttpMethod
			let is_preflight = http_method === HttpMethod.OPTIONS

			if (is_preflight) {
				http_method = event.headers['access-control-request-method'].toUpperCase() as HttpMethod
				//console.log('require_http_method(): handling a preflight…', http_method)
			}

			if (!allowed_methods.includes(http_method)) {
				throw create_error(SEC, 405, {
					expected: allowed_methods.join(','),
					received: http_method,
				})
			}

			if (is_preflight) {
				// not the job of this MW to handle the preflight itself
				// however we help preparing it
				response.headers['Access-Control-Allow-Methods'] = allowed_methods.join(', ')
			}

			await next()
		})
	}
	//mw.name = 'require_http_method:' + allowed_methods.join(',')
	return _require_http_method
}
