import {
	NetlifyContext,
} from '../sub/types'


export function ensure_netlify_logged_in(context: NetlifyContext) {
	if (!context.clientContext)
		throw new Error('No/bad/outdated token [1]! (not logged in?)')

	if (!context.clientContext.user)
		throw new Error('No/bad/outdated token [2]! (not logged in?)')
}

export interface NetlifyUserData {
	netlify_id: string
	email: string
	provider: string
	roles: string[]
	avatar_url: undefined | string
	full_name: string
}

export function get_netlify_user_data(context: NetlifyContext): NetlifyUserData {
	ensure_netlify_logged_in(context)

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
