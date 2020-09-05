/*
process.env.UDA_OVERRIDE__LOGGER__UDA_INTERNAL_LOGLEVEL = '"silly"'
process.env.UDA_OVERRIDE__LOGGER_UDA_LOGLEVEL = '"silly"'
process.env.UDA_OVERRIDE__LOGGER_OA_DB_LOGLEVEL = '"silly"'
process.env.UDA_OVERRIDE__LOGGER_OA_API_LOGLEVEL = '"silly"'
process.env.UDA_OVERRIDE__KNEX_DEBUG = 'true'
*/
import '@offirmo/universal-debug-api-node'

import {
	APIGatewayEvent,
	Context,
	NetlifyContext,
	Response,
	NetlifyHandler,
} from './sub/types'
import { use_middlewares_with_error_safety_net, DEFAULT_RESPONSE_BODY } from './sub/middlewares/runner'
import { XSoftExecutionContext } from './sub/services/sec'
import { require_http_method, HttpMethod } from './sub/middlewares/require-http-method'
import { test_failure } from './sub/middlewares/test-failure'

////////////////////////////////////

async function _handler(
	SEC: XSoftExecutionContext,
	event: Readonly<APIGatewayEvent>,
	context: Readonly<NetlifyContext>,
	response: Response,
	next: Function
): Promise<void> {
	response.statusCode = 200
	if (response.body === DEFAULT_RESPONSE_BODY)
		response.body = JSON.stringify('Test error handling default response (no error)!')
}


const handler: NetlifyHandler = (
	event: APIGatewayEvent,
	badly_typed_context: Context,
): Promise<Response> => {
	return use_middlewares_with_error_safety_net(
		event,
		badly_typed_context,
		[
			require_http_method([ HttpMethod.GET ]),
			test_failure,
			_handler,
		]
	)
}

export { handler }
