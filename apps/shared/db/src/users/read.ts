import assert from 'tiny-invariant'

import get_db from '../db'

import { NetlifyUser, PUser } from './types'
import { TABLE_USERS } from './consts'
import { normalize_email_full} from '../utils/email'
import { sanitize_persisted } from './common'

import logger from '../utils/logger'

////////////////////////////////////

export async function get_user_by_email(
	email: string,
	trx: ReturnType<typeof get_db> = get_db()
): Promise<null | PUser> {
	const raw_result = await trx(TABLE_USERS)
		.select()
		.where('normalized_email', normalize_email_full(email))

	if (!raw_result[0])
		return null

	return  sanitize_persisted(raw_result[0] as PUser)
}

// returns null bc one should use "ensure user…" in actual code
export async function get_user_by_netlify(
	data: Partial<NetlifyUser>, // partial as a convenience TODO review
	trx: ReturnType<typeof get_db> = get_db()
): Promise<null | PUser> {
	assert(data.netlify_id, 'get_user_by_netlify: Netlify Id is mandatory!') // can this be typed?

	// TODO improve?
	const raw_result = await trx
		.select(trx.raw('row_to_json("users__netlify".*) AS "netlify_user", row_to_json("users".*) AS "user"'))
		.from(TABLE_USERS)
		.fullOuterJoin('users__netlify', {'users.id': 'users__netlify.user_id'})
		.where('users__netlify.own_id', data.netlify_id)
	console.log(`get_user_by_netlify(${data.netlify_id}): outer join raw result:`, raw_result)

	if (!raw_result || !raw_result.length) {
		// don't check by email
		return null
	}

	const raw_user = raw_result[0].user as PUser

	// merge with netlify data TODO?
	//const raw_nu = raw_result[0].netlify_user

	return sanitize_persisted(raw_user)
}
