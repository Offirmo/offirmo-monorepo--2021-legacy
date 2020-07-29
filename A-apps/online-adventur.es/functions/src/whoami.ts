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
import { get_netlify_user_data } from './sub/netlify'
import { require_http_method, HttpMethod } from "./sub/middlewares/require-http-method"




async function _handler(
	SEC: XSoftExecutionContext,
	event: Readonly<APIGatewayEvent>,
	context: Readonly<NetlifyContext>,
	response: Response,
	next: Function
): Promise<void> {
	const who_am_i: any = {}

	try {
		who_am_i['1-netlify_client_context'] = context.clientContext

		who_am_i['2-extracted_from_context'] = get_netlify_user_data(context)

		const { user_p, user } = SEC.getInjectedDependencies()
		who_am_i['3-DB_result'] = user_p
		who_am_i['4-final_result'] = user
	} catch (err) {
		who_am_i.err = {
			message: err.message,
			stack: err.stack,
		}
	}

	console.log('will return:', who_am_i)
	response.statusCode = 200
	response.body = who_am_i

	await next()
}


const handler: NetlifyHandler = (
	event: APIGatewayEvent,
	badly_typed_context: Context,
): Promise<Response> => {
	return use_middlewares_with_error_safety_net(event, badly_typed_context,[
		require_http_method([ HttpMethod.GET ]),
		handle_cors,
		require_authenticated,
		_handler,
	])
}

export { handler }
