import { get_UTC_timestamp_ms } from '@offirmo-private/timestamps'

import {
	APIGatewayEvent,
	Context,
	NetlifyContext,
	Response,
	NetlifyHandler,
	NetlifyClientContext,
} from './sub/types'

import { use_middlewares_with_error_safety_net } from './sub/middlewares/runner'
import { XSoftExecutionContext, XError, SEC, XSECEventDataMap } from './sub/services/sec'
import { create_error } from './sub/utils'
import { on_error as report_to_sentry } from './sub/services/sentry'
import { CHANNEL } from './sub/services/channel'
import {
	ensure_netlify_logged_in,
	get_netlify_user_data,
} from './sub/netlify'
import {get_default_JsonRpc_error} from "./sub/consts";
import { require_http_method, HttpMethod } from "./sub/middlewares/require-http-method";
import { test_failure } from "./sub/middlewares/test-failure";


async function _handler(
	SEC: XSoftExecutionContext,
	event: Readonly<APIGatewayEvent>,
	context: Readonly<NetlifyContext>,
	response: Response,
	next: Function
): Promise<void> {
	response.statusCode = 200
	response.body = 'Test ok!'
}


const handler: NetlifyHandler = (
	event: APIGatewayEvent,
	badly_typed_context: Context,
): Promise<Response> => {
	return use_middlewares_with_error_safety_net(
		event,
		badly_typed_context,
		[
			require_http_method(HttpMethod.GET),
			test_failure,
			_handler,
		]
	)
}

export { handler }
