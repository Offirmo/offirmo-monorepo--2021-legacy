import { normalizeError } from '@offirmo/error-utils'
import { Users } from '@offirmo-private/db'

import {
	NetlifyContext,
	NetlifyClientContext,
} from '../types'
import { HTTP_STATUS_CODE } from '../consts'
import { CHANNEL } from './channel'

/////////////////////////////////////////////////

function _ensure_netlify_logged_in(context: Readonly<NetlifyContext>) {
	if (!context.clientContext)
		throw new Error('No/bad/outdated token [1]! (not logged in?)')

	if (!context.clientContext.user)
		throw new Error('No/bad/outdated token [2]! (not logged in?)')
}

export type NetlifyUserData = Users.NetlifyUser

export const DEV_MOCK_NETLIFY_USER: Readonly<NonNullable<NetlifyClientContext['user']>> = {
	email: 'dev@online-adventur.es',
	sub: 'fake-netlify-id',
	app_metadata: {
		provider: 'test',
		roles: [
			'test',
			'admin',
		],
	},
	user_metadata: {
		avatar_url: undefined,
		full_name: 'Fake User For Dev',
	},
	exp: -1,
}

export function get_netlify_user_data(context: NetlifyContext): NetlifyUserData {
	try {
		_ensure_netlify_logged_in(context)
	}
	catch (_err) {
		const err = normalizeError(_err)
		err.statusCode = HTTP_STATUS_CODE.error.client.unauthorized
		if (err.message.includes('No/bad/outdated token') && CHANNEL === 'dev') {
			// pretend
			context.clientContext.user = DEV_MOCK_NETLIFY_USER
			;(context.clientContext as any).xxx = "WAS FAKED FOR DEV!"
		}
		else
			throw err
	}

	const {
		email,
		sub: netlify_id,
		app_metadata: { provider, roles },
		user_metadata: { avatar_url, full_name },
	} = context.clientContext.user!

	return {
		netlify_id,
		email,
		provider,
		roles: roles || [],
		avatar_url,
		full_name,
	}
}
