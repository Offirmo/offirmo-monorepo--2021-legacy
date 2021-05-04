//process.env.UDA_OVERRIDE__LOGGER__UDA_INTERNAL_LOGLEVEL = '"silly"'
//process.env.UDA_OVERRIDE__LOGGER_UDA_LOGLEVEL = '"silly"'
process.env.UDA_OVERRIDE__LOGGER_OA_DB_LOGLEVEL = '"silly"'
process.env.UDA_OVERRIDE__LOGGER_OA_API_LOGLEVEL = '"silly"'
process.env.UDA_OVERRIDE__KNEX_DEBUG = 'true'
import '@offirmo/universal-debug-api-node'

import { get_db, KVs } from '@offirmo-private/db'
import {
	OAServerResponseBody,
	create_server_response_body__data,
	create_server_response_body__error,
} from '@online-adventur.es/api-interface'

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
import enrich_side_infos from './sub/middlewares/enrich_side_infos'
import { XSoftExecutionContext } from './sub/services/sec'
import { require_http_method, HttpMethod } from './sub/middlewares/require-http-method'
import { create_error, get_key_from_path } from './sub/utils'
import { HTTP_STATUS_CODE } from './sub/consts'

////////////////////////////////////

async function _handler(
	SEC: XSoftExecutionContext,
	event: Readonly<APIGatewayEvent>,
	context: Readonly<NetlifyContext>,
	response: Response,
	next: Function
): Promise<void> {
	const { p_user } = SEC.getInjectedDependencies()
	const key = get_key_from_path(event)

	const body: OAServerResponseBody<any> = response.body as any

	switch(event.httpMethod) {

		case HttpMethod.GET:
			body.data = await KVs.get_value({
				user_id: p_user!.id,
				key,
			})
			response.statusCode = 200 // never 404 since there is no "existence"
			break

		case HttpMethod.PATCH:
			if (!event.body)
				throw create_error('Missing body!', { statusCode: HTTP_STATUS_CODE.error.client.bad_request}, SEC)

			body.data = await KVs.sync_kv_entry({
				user_id: p_user!.id,
				key,
				value: JSON.parse(event.body),
			})
			response.statusCode = 200 // always succeed
			break

		default:
			// should never happen due to prior validation
			throw create_error(HTTP_STATUS_CODE.error.server.internal, {}, SEC)
	}

	await next()
}


const handler: NetlifyHandler = (
	event: APIGatewayEvent,
	badly_typed_context: Context,
): Promise<Response> => {
	return use_middlewares_with_error_safety_net(event, badly_typed_context,[
		// TODO require no extraneous params: queryparams, etc.
		// TODO ensure content type? "content-type": "application/json",
		require_http_method([ HttpMethod.GET, HttpMethod.PATCH ]),
		handle_cors,
		enrich_side_infos,
		require_authenticated,
		_handler,
	])
}

export { handler }
