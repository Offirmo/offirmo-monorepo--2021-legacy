import { Immutable } from '@offirmo-private/ts-types'
import { normalizeError } from '@offirmo/error-utils'
import { get_db, Users, get_connection_string } from '@offirmo-private/db'

import { HEADER_IMPERSONATE } from '@online-adventur.es/api-interface'

import { HTTP_STATUS_CODE } from '../consts'
import { get_netlify_user_data } from '../services/netlify'
import { create_error } from '../utils'
import {
	XSoftExecutionContext,
	MiddleWare,
	APIGatewayEvent,
	NetlifyContext,
	Response,
} from './types'

////////////////////////////////////

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
					logger.trace('calling…')
					let p_user: Immutable<Users.PUser> = await Users.ensure_user_through_netlify(netlify_user_data, trx)
					//logger.log('user found', p_user)

					const impersonation_target = event.headers[HEADER_IMPERSONATE]
					if (impersonation_target) {
						if (!p_user.roles.includes('admin')) {
							throw create_error('Illegal impersonation attempt!', { statusCode: HTTP_STATUS_CODE.error.client.forbidden }, SEC)
						}
						else {
							logger.info('Admin attempt to impersonate', { impersonation_target })
							const impersonated_p_user = await Users.get_by_email(impersonation_target, trx)
							if (!impersonated_p_user)
								throw new Error('Can’t find the impersonation target!')
							p_user = impersonated_p_user
						}
					}

					CSEC.injectDependencies({
						p_user,
						user: Users.infer_defaults_from_persisted(p_user),
					})
				})
			)

			await next()
		}
		catch (_err) {
			const err = normalizeError(_err)
			if (err.message.includes('Knex: Timeout acquiring a connection')) {
				err.statusCode = err.statusCode || 500
				logger.error('Can’t reach the db?!', { connection: get_connection_string() })
			}
			else {
				err.statusCode = err.statusCode || HTTP_STATUS_CODE.error.client.forbidden
			}
			throw err
		}
	})
}
const _require_authenticated: MiddleWare = require_authenticated // test check


export default require_authenticated
