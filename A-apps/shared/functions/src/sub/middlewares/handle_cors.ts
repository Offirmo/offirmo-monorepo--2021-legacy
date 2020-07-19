import { ReleaseChannel, get_allowed_origin } from '@offirmo-private/functions-interface'

import {
	APIGatewayEvent,
	NetlifyContext,
	Response,
} from '../types'
import { create_error } from '../utils'
import { XSoftExecutionContext} from './types'

////////////////////////////////////

export default async function handle_cors(
	SEC: XSoftExecutionContext,
	event: Readonly<APIGatewayEvent>,
	context: Readonly<NetlifyContext>,
	response: Response,
	next: Function
): Promise<void> {
	if (event.httpMethod.toUpperCase() !== 'OPTIONS')
		return next()

	await SEC.xTry('handle_cors()', async ({ SEC, logger, CHANNEL }) => {
		logger.log(`handling CORS preflight for ${event.path}…`)

		const origin = event.headers.origin
		const expected_origin = get_allowed_origin(CHANNEL as ReleaseChannel)
		if (origin !== expected_origin) {
			logger.warn('rejecting preflight', {expected_origin, origin})
			throw create_error(SEC, 405, {
				expected_origin,
				origin,
			})
		}

		response.statusCode = 200
		response.headers['Access-Control-Allow-Origin'] = expected_origin
		response.body = JSON.stringify('OK')
	})
}
