import assert from 'tiny-invariant'

import get_db from '../db'
import { BaseUser, NetlifyUser, PUser, PNetlifyUser } from './types'
import { TABLE_USERS } from './consts'
import { sanitize_persisted, extract_base_user } from './common'
import { netlify_to_base_user, create_netlify_user, create_user_through_netlify } from './create'
import { get_user_by_email, get_user_by_netlify } from './read'
import { logger, normalize_email_full, deep_equals } from "../utils";

////////////////////////////////////

export async function ensure_user_up_to_date(
	existing_p: Readonly<PUser>,
	candidate: Readonly<BaseUser>,
	trx: ReturnType<typeof get_db>,
): Promise<PUser> {
	const existing = extract_base_user(existing_p)
	candidate = sanitize_persisted(candidate)
	//console.log('ensure_user_up_to_date', { existing, candidate })

	assert(
		Object.keys(candidate).length === Object.keys(existing).length,
		'ensure_user_up_to_date: can’t compare, fields not matching!'
	)

	if (deep_equals(existing, candidate)) {
		//console.log('ensure_user_up_to_date: all good ✔', deep_equals(existing, candidate))
		return existing_p
	}

	//console.log('ensure_user_up_to_date: updating_', { id: existing_p.id, candidate })
	await trx(TABLE_USERS)
		.where({ id: existing_p.id })
		.update(candidate)

	return sanitize_persisted({
		...existing_p,
		...candidate,
		roles: Array.from(new Set([...existing_p.roles, ...candidate.roles])),
	})
}

export async function ensure_user_through_netlify(
	data: Readonly<NetlifyUser>,
	trx: ReturnType<typeof get_db>
): Promise<PUser> {
	logger.log('ensuring user from its netlify data...', { data })

	let user: PUser | null = await get_user_by_netlify(data, trx)
	console.log('get_full_user_through_netlify #1', {user})

	if (!user) {
		// 1st time OR new login with a different system
		user = await get_user_by_email(data.email, trx)
		console.log('get_full_user_through_netlify #2', {user})
	}

	if (!user?.id) {
		console.log('nothing found, creating everything...')

		const { user_id } = await create_user_through_netlify(data, trx)
		return {
			...netlify_to_base_user(data),
			id: user_id,
			created_at: (new Date()).toISOString(),
			updated_at: (new Date()).toISOString(),
			normalized_email: normalize_email_full(data.email),
		}
	}

	// user already exists, link it
	await create_netlify_user({
		user_id: user.id,
		own_id: data.netlify_id,
	}, trx)

	return ensure_user_up_to_date(user, netlify_to_base_user(data), trx)
}

