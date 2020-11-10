import { ReleaseChannel, get_allowed_origin } from '@online-adventur.es/functions-interface'

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
		logger.log(`handling CORS for ${event.path}…`)

		const origin = event.headers.origin
		const expected_origin = get_allowed_origin(CHANNEL as ReleaseChannel)
		if (origin !== expected_origin && !expected_origin.startsWith('http://localhost')) {
			logger.warn('rejecting due to wrong origin', {expected_origin, origin})
			throw create_error(HTTP_STATUS_CODE.error.client.forbidden, {
				expected_origin,
				origin,
			}, SEC)
		}

		if (event.httpMethod.toUpperCase() === 'OPTIONS') {
			logger.log(`handling CORS preflight for ${event.path}…`, { headers: event.headers })

			response.statusCode = 200
			response.headers['Access-Control-Allow-Headers'] = [
				'authorization', // needed by our Netlify setup
				'content-type', // we use it even when not mandatory
			].join(',')
			response.body = JSON.stringify('OK')
		}
		else {
			await next()
		}

		response.headers['Access-Control-Allow-Origin'] = expected_origin // always needed
	})
}
