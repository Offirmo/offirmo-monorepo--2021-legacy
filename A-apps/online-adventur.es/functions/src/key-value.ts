//process.env.UDA_OVERRIDE__LOGGER__UDA_INTERNAL_LOGLEVEL = '"silly"'
//process.env.UDA_OVERRIDE__LOGGER_UDA_LOGLEVEL = '"silly"'
import {create_error} from './sub/utils'

process.env.UDA_OVERRIDE__LOGGER_OA_DB_LOGLEVEL = '"silly"'
process.env.UDA_OVERRIDE__LOGGER_OA_API_LOGLEVEL = '"silly"'
process.env.UDA_OVERRIDE__KNEX_DEBUG = 'true'
import '@offirmo/universal-debug-api-node'

import { get_db, KVs } from '@offirmo-private/db'

import {
	APIGatewayEvent,
	Context,
	NetlifyContext,
	Response,
	NetlifyHandler,
} from './sub/types'
import { use_middlewares_with_error_safety_net } from './sub/middlewares/runner'
import handle_cors from './sub/middlewares/handle_cors'
import require_authenticated from './sub/middlewares/require-authenticated'
import { XSoftExecutionContext } from './sub/services/sec'
import { get_netlify_user_data } from './sub/services/netlify'
import { require_http_method, HttpMethod } from './sub/middlewares/require-http-method'
import { normalize_path } from './sub/middlewares/normalize-path'
//import { create_error } from '../utils'


////////////////////////////////////

async function _handler(
	SEC: XSoftExecutionContext,
	event: Readonly<APIGatewayEvent>,
	context: Readonly<NetlifyContext>,
	response: Response,
	next: Function
): Promise<void> {
	const { p_user } = SEC.getInjectedDependencies()
	const key = event.queryStringParameters!['key']

	switch(event.httpMethod) {
		case HttpMethod.GET:
			response.body = JSON.stringify(await KVs.get_value({
				user_id: p_user.id,
				key,
			}))
			response.statusCode = response.body ? 200 : 404
			break
		case HttpMethod.PATCH:
			throw new Error('NIMP!')
		default:
			// should not happen due to prior validation
			throw create_error(SEC,405)
	}

	await next()
}


const handler: NetlifyHandler = (
	event: APIGatewayEvent,
	badly_typed_context: Context,
): Promise<Response> => {
	return use_middlewares_with_error_safety_net(event, badly_typed_context,[
		require_http_method([ HttpMethod.GET, HttpMethod.PATCH ]),
		handle_cors,
		normalize_path(),
		require_authenticated,
		_handler,
	])
}

export { handler }
