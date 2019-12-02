import {
	APIGatewayEvent,
	Context,
	NetlifyContext,
	Response,
	NetlifyHandler,
} from './sub/types'

import { use_middlewares_with_error_safety_net } from './sub/middlewares/runner'
import { XSoftExecutionContext } from './sub/services/sec'
import { create_error } from './sub/utils'
import {
	get_netlify_user_data,
} from './sub/netlify'
import { require_http_method, HttpMethod } from "./sub/middlewares/require-http-method"
import { get_db, Users } from "@offirmo-private/db"


async function require_authenticated(
	SEC: XSoftExecutionContext,
	event: Readonly<APIGatewayEvent>,
	context: Readonly<NetlifyContext>,
	response: Response,
	next: Function
): Promise<void> {
	const who_am_i: any = {}
	try {
		who_am_i['1-netlify_client_context'] = context.clientContext

		const netlify_user_data = get_netlify_user_data(context)
		who_am_i['2-extracted_from_context'] = netlify_user_data

		await get_db().transaction(async trx => {
			const user_p = await Users.ensure_through_netlify(netlify_user_data, trx)
			who_am_i['3-DB_result'] = Users.infer_defaults_from_persisted(user_p)
			SEC.injectDependencies({
				user_p,
				user:  Users.infer_defaults_from_persisted(user_p),
			})
		})
			.then(
				() => {
					console.log('transaction success')
				},
				async err => {
					console.log('transaction failure', { err })
					throw err
				},
			)
	}
	catch (err) {
		who_am_i.err = {
			message: err.message,
			stack: err.stack,
		}
	}

	console.log(who_am_i)

	response.statusCode = 200
	response.body = who_am_i

	await next()
}

async function _handler(
	SEC: XSoftExecutionContext,
	event: Readonly<APIGatewayEvent>,
	context: Readonly<NetlifyContext>,
	response: Response,
	next: Function
): Promise<void> {
	//response.statusCode = 200
	//response.body = 'Test ok!'

	await next()
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
			require_authenticated,
			_handler,
		]
	)
}

export { handler }
