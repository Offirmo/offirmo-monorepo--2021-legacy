import { get_db, Users, get_connection_string } from '@offirmo-private/db'

import { HEADER_IMPERSONATE } from '@offirmo-private/functions-interface'
import { XSoftExecutionContext } from '../services/sec'
import { get_netlify_user_data } from '../netlify'

import {
	MiddleWare,
	APIGatewayEvent,
	NetlifyContext,
	Response,
} from './types'
import { create_error } from '../utils'


export async function require_authenticated(
	SEC: XSoftExecutionContext,
	event: Readonly<APIGatewayEvent>,
	context: Readonly<NetlifyContext>,
	response: Response,
	next: () => Promise<void>
): Promise<void> {
	const CSEC = SEC // TODO fix this ugly thing
	await SEC.xPromiseTry('require_authenticated()', async ({ SEC, logger }) => {
		try {
			const netlify_user_data = get_netlify_user_data(context)

			await SEC.xPromiseTry('ensure_user_through_netlify', ({SEC}) =>
				get_db().transaction(async trx => {
					let user_p: Users.PUser = await Users.ensure_user_through_netlify(netlify_user_data, trx)
					//logger.log('user found', user_p)

					const impersonation_target = event.headers[HEADER_IMPERSONATE]
					if (impersonation_target) {
						if (!user_p.roles.includes('admin')) {
							throw create_error(SEC, 'Illegal impersonation attempt!', { statusCode: 403 })
						}
						else {
							logger.info('Admin attempt to impersonate', { impersonation_target })
							const impersonated_user_p = await Users.get_by_email(impersonation_target, trx)
							if (!impersonated_user_p)
								throw new Error('Can’t find the impersonation target!')
							user_p = impersonated_user_p
						}
					}

					CSEC.injectDependencies({
						user_p,
						user: Users.infer_defaults_from_persisted(user_p),
					})
				})
			)

			await next()
		}
		catch (err) {
			if (err.message.includes('Knex: Timeout acquiring a connection')) {
				err.statusCode = err.statusCode || 500
				logger.error('Can’t reach the db?!', { connection: get_connection_string() })
			}
			else {
				err.statusCode = err.statusCode || 403
			}
			throw err
		}
	})
}
const _require_authenticated: MiddleWare = require_authenticated // test check


export default require_authenticated
