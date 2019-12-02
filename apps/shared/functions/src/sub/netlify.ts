import {
	NetlifyContext,
} from './types'
import { CHANNEL } from './services/channel'
import { Users } from '@offirmo-private/db'

export function ensure_netlify_logged_in(context: Readonly<NetlifyContext>) {
	if (!context.clientContext)
		throw new Error('No/bad/outdated token [1]! (not logged in?)')

	if (!context.clientContext.user) {
		throw new Error('No/bad/outdated token [2]! (not logged in?)')
	}
}

export type NetlifyUserData = Users.NetlifyUser

export function get_netlify_user_data(context: NetlifyContext): NetlifyUserData {
	try {
		ensure_netlify_logged_in(context)
	}
	catch (err ) {
		if (err.message.includes('No/bad/outdated token') && CHANNEL === 'dev') {
			// pretend
			context.clientContext.user = {
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
			}
		}
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
