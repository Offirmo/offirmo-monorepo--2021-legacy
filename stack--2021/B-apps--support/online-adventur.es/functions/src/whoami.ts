//process.env.UDA_OVERRIDE__LOGGER__UDA_INTERNAL_LOGLEVEL = '"silly"'
//process.env.UDA_OVERRIDE__LOGGER_UDA_LOGLEVEL = '"silly"'
import { normalizeError } from '@offirmo/error-utils'

process.env.UDA_OVERRIDE__LOGGER_OA_DB_LOGLEVEL = '"silly"'
process.env.UDA_OVERRIDE__LOGGER_OA_API_LOGLEVEL = '"silly"'
process.env.UDA_OVERRIDE__KNEX_DEBUG = 'true'
import '@offirmo/universal-debug-api-node'

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

////////////////////////////////////

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

		const { p_user, user } = SEC.getInjectedDependencies()
		who_am_i['3-DB_result'] = p_user
		who_am_i['4-final_result'] = user
	} catch (_err) {
		const err = normalizeError(_err)
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
