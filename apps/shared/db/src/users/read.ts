import get_db from '../db'

import { User, NetlifyUser, MergedUser } from './types'
import { TABLE_USERS, DEFAULT_CALLED, DEFAULT_ROLES } from './consts'
import { normalize_email } from '../utils/email'
import logger from '../utils/logger'


export async function get_user_by_email(
	email: string,
	trx: ReturnType<typeof get_db> = get_db()
): Promise<null | User> {
	const raw_result = await trx(TABLE_USERS)
		.select()
		.where('email', normalize_email(email))

	return raw_result[0]
}

// returns null bc one should use "ensure user…" in actual code
export async function get_full_user_through_netlify(
	netlify_id: NetlifyUser['own_id'],
	trx: ReturnType<typeof get_db> = get_db()
): Promise<null | MergedUser> {
	const raw_result = await trx
		.select(trx.raw('row_to_json("users__netlify".*) AS "netlify_user", row_to_json("users".*) AS "user"'))
		.from(TABLE_USERS)
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
		called: raw_u.called || DEFAULT_CALLED,
		email: raw_u.email,
		avatar_url: raw_u.avatar_url,
		roles: Array.from(new Set([...raw_u.roles, ...DEFAULT_ROLES])),
		_: {
			user: raw_result[0].user
		}
	}

	return merged
}
