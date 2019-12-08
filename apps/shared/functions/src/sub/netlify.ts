import { Users } from '@offirmo-private/db'

import {
	NetlifyContext,
	NetlifyClientContext,
} from './types'
import { CHANNEL } from './services/channel'
import { create_error } from './utils'

export function ensure_netlify_logged_in(context: Readonly<NetlifyContext>) {
	if (!context.clientContext)
		throw create_error('No/bad/outdated token [1]! (not logged in?)', { statusCode: 401 })

	if (!context.clientContext.user)
		throw create_error('No/bad/outdated token [2]! (not logged in?)', { statusCode: 401 })
}

export type NetlifyUserData = Users.NetlifyUser

export const TEST_CLIENT_CONTEXT_USER: Readonly<NonNullable<NetlifyClientContext['user']>> = {
	email: 'dev@online-adventur.es',
	sub: 'fake-netlify-id',
	app_metadata: {
		provider: 'test',
		roles: [ 'test'],
	},
	user_metadata: {
		avatar_url: undefined,
		full_name: 'Fake User For Dev',
	},
	exp: -1,
}


export function get_netlify_user_data(context: NetlifyContext): NetlifyUserData {
	try {
		ensure_netlify_logged_in(context)
	}
	catch (err ) {
		if (err.message.includes('No/bad/outdated token') && CHANNEL === 'dev') {
			// pretend
			context.clientContext.user = TEST_CLIENT_CONTEXT_USER
		}
		else
			throw err
	}

	const {
		email,
		sub: netlify_id,
		app_metadata: { provider, roles },
		user_metadata: { avatar_url, full_name },
	} = context.clientContext.user!;

	return {
		netlify_id,
		email,
		provider,
		roles: roles || [],
		avatar_url,
		full_name,
	}
}
