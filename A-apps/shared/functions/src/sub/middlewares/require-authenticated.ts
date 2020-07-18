import { get_db, Users } from "@offirmo-private/db"

import { XSoftExecutionContext } from '../services/sec'
import { get_netlify_user_data } from '../netlify'

import {
	MiddleWare,
	APIGatewayEvent,
	NetlifyContext,
	Response,
} from './types'


export async function require_authenticated(
	SEC: XSoftExecutionContext,
	event: Readonly<APIGatewayEvent>,
	context: Readonly<NetlifyContext>,
	response: Response,
	next: () => Promise<void>
): Promise<void> {
	try {
		const netlify_user_data = get_netlify_user_data(context)

		await SEC.xPromiseTry('ensure_user_through_netlify', () =>
			get_db().transaction(async trx => {
				const user_p = await Users.ensure_user_through_netlify(netlify_user_data, trx)
				SEC.injectDependencies({
					user_p,
					user: Users.infer_defaults_from_persisted(user_p),
				})
			})
		)

		await next()
	}
	catch (err) {
		err.statusCode = err.statusCode || 401
		throw err
	}
}
const _require_authenticated: MiddleWare = require_authenticated // test check


export default require_authenticated
