import { ReleaseChannel, get_allowed_origin } from '@online-adventur.es/api-interface'

import {
	APIGatewayEvent,
	NetlifyContext,
	Response,
} from '../types'
import { HTTP_STATUS_CODE } from '../consts'
import { create_error } from '../utils'
import { XSoftExecutionContext } from './types'

////////////////////////////////////

export default async function handle_cors(
	SEC: XSoftExecutionContext,
	event: Readonly<APIGatewayEvent>,
	context: Readonly<NetlifyContext>,
	response: Response,
	next: Function
): Promise<void> {
	await SEC.xPromiseTry('handle_cors()', async ({ SEC, logger, CHANNEL }) => {
		const advertised_origin = event.headers.origin
		const method = event.httpMethod.toUpperCase()
		let expected_origin = get_allowed_origin(CHANNEL as ReleaseChannel)
		logger.log(`handling CORS…`, { path: event.path, method, origin: advertised_origin, expected_origin })

		if (advertised_origin) { // from headers, not always here
			// DEV if we are expecting localhost and origin is indeed localhost accept any port of origin
			if (expected_origin.startsWith('http://localhost:') && advertised_origin.startsWith('http://localhost:')) {
				expected_origin = advertised_origin
			}
			if (advertised_origin !== expected_origin) {
				logger.warn('rejecting due to wrong advertised_origin', { expected_origin, origin: advertised_origin })
				throw create_error(HTTP_STATUS_CODE.error.client.forbidden, {
					advertised_origin,
					expected_origin,
					origin: advertised_origin,
				}, SEC)
			}
		}

		if (method === 'OPTIONS') {
			logger.log(`handling CORS preflight for ${event.path}…`, { headers: event.headers })

			response.statusCode = 200
			response.body = JSON.stringify('OK')
		}
		else {
			await next()
		}

		response.headers['Access-Control-Allow-Headers'] = [ // not sure but seems always needed
			// allowed headers:
			'authorization', // used by Netlify Auth
			'content-type', // we use it, even when not mandatory
		].join(',')
		response.headers['Access-Control-Allow-Origin'] = expected_origin // always needed
	})
}
