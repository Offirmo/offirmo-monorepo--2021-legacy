import assert from 'tiny-invariant'

import get_db from '../db'
import { BaseUser, NetlifyUser, PUser, PNetlifyUser } from './types'
import { TABLE_USERS } from './consts'
import { sanitize_persisted, extract_base_user } from './common'
import { netlify_to_base_user, create_netlify_user, create_user_through_netlify } from './create'
import { get_user_by_email, get_user_by_netlify } from './read'
import { logger, normalize_email_full, deep_equals } from "../utils";

////////////////////////////////////

export function get_updated_user(
	existing: Readonly<BaseUser>,
	candidate: Readonly<BaseUser>,
): BaseUser {
	existing = sanitize_persisted(existing)
	candidate = sanitize_persisted(candidate)
	//console.log('get_updated_user', { existing, candidate })

	assert(
		Object.keys(candidate).length === Object.keys(existing).length,
		'get_updated_user: can’t compare, fields not matching!'
	)

	return extract_base_user({
		...existing,
		...candidate,
		// those fields can be set but not replaced once set
		called: existing.called || candidate.called,
		usual_email: existing.usual_email || candidate.usual_email,
		avatar_url: existing.avatar_url || candidate.avatar_url,
		// this one is merged
		roles: Array.from(new Set([...existing.roles, ...candidate.roles])),
	})
}


export async function ensure_user_up_to_date(
	existing_p: Readonly<PUser>,
	candidate: Readonly<BaseUser>,
	trx: ReturnType<typeof get_db>,
): Promise<PUser> {
	const existing = extract_base_user(existing_p)
	//console.log('ensure_user_up_to_date', { existing, candidate })

	candidate = get_updated_user(existing, candidate)

	if (deep_equals(existing, candidate)) {
		//console.log('ensure_user_up_to_date: all good ✔')
		return existing_p
	}

	await trx(TABLE_USERS)
		.where({ id: existing_p.id })
		.update(candidate)

	return sanitize_persisted({
		...existing_p,
		...candidate,
	})
}

export async function ensure_user_through_netlify(
	data: Readonly<NetlifyUser>,
	trx: ReturnType<typeof get_db>
): Promise<PUser> {
	logger.log('ensuring user from its netlify data...', { data })

	let user: PUser | null = await get_user_by_netlify(data, trx)
	//console.log('ensure_user_through_netlify #1 / get_user_by_netlify', {user})

	if (!user) {
		// 1st time OR new login with a different system
		user = await get_user_by_email(data.email, trx)
		//console.log('ensure_user_through_netlify #2 / get_user_by_email', {user})
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

