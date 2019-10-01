import get_db from '../db'

import { BaseUser, User, NetlifyUser, MergedUser } from './types'
import { DEFAULT_CALLED, DEFAULT_ROLES } from './consts'


export async function get_full_user_through_netlify(netlify_id: NetlifyUser['own_id']): Promise<null | MergedUser> {
	const raw_result = await get_db()
		.select(get_db().raw('row_to_json("users__netlify".*) AS "netlify_user", row_to_json("users".*) AS "user"'))
		.from('users')
		.fullOuterJoin('users__netlify', {'users.id': 'users__netlify.user_id'})
		.where('users__netlify.own_id', netlify_id)

	if (!raw_result || !raw_result.length)
		return null

	//console.log('outer join raw result', raw_result)
	const raw_u = raw_result[0].user
	const raw_nu = raw_result[0].netlify_user

	const merged: MergedUser = {
		created_at: raw_u.created_at,
		updated_at: raw_u.updated_at,
		id: raw_u.id,
		called: raw_u.called || raw_nu.called || DEFAULT_CALLED,
		email: raw_u.email || raw_nu.email,
		avatar_url: raw_u.avatar_url || raw_nu.avatar_url,
		roles: Array.from(new Set([...raw_u.roles, ...raw_nu.roles, ...DEFAULT_ROLES])),
	}

	return merged
}
