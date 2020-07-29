import assert from 'tiny-invariant'

import { NORMALIZERS } from '@offirmo-private/normalize-string'

import get_db from '../db'
import { BaseUser, NetlifyUser, PUser } from './types'
import { TABLE_USERS } from './consts'
import { sanitize_persisted, extract_base } from './common'
import { get_base_user_from_netlify_user, create_netlify_user, create_user_through_netlify } from './create'
import { get_by_email, get_by_netlify } from './read'
import { logger, deep_equals } from '../utils'

////////////////////////////////////

function get_updated_base(
	existing: Readonly<BaseUser>,
	candidate: Readonly<BaseUser>,
): BaseUser {
	existing = sanitize_persisted(existing)
	candidate = sanitize_persisted(candidate)
	//console.log('get_updated_base', { existing, candidate })

	assert(
		Object.keys(candidate).length === Object.keys(existing).length,
		'get_updated_base: can’t compare, fields not matching!'
	)

	return extract_base({
		...existing,
		...candidate,

		// those fields can be set but not replaced once set
		called: existing.called || candidate.called,
		raw_email: existing.raw_email || candidate.raw_email,
		avatar_url: existing.avatar_url || candidate.avatar_url,

		// this one is merged
		roles: Array.from(new Set([...existing.roles, ...candidate.roles])),
	})
}

async function ensure_up_to_date(
	existing_p: Readonly<PUser>,
	candidate: Readonly<BaseUser>,
	trx: ReturnType<typeof get_db>,
): Promise<PUser> {
	const existing = extract_base(existing_p)
	//console.log('ensure_up_to_date', { existing, candidate })

	candidate = get_updated_base(existing, candidate)

	if (deep_equals(existing, candidate)) {
		//console.log('ensure_up_to_date: all good ✔')
		return existing_p
	}

	await trx(TABLE_USERS)
		.where({ id: existing_p.id })
		.update(candidate)

	return {
		...existing_p,
		...candidate,
	}
}

export async function ensure_user_through_netlify(
	data: Readonly<NetlifyUser>,
	trx: ReturnType<typeof get_db>
): Promise<PUser> {
	logger.log('ensuring user from its netlify data...', { data })

	let user: PUser | null = await get_by_netlify(data, trx)
	logger.log('ensure_user_through_netlify #1 / get_by_netlify', {user})

	if (!user) {
		// 1st time OR new login with a different system
		user = await get_by_email(data.email, trx)
		logger.log('ensure_user_through_netlify #2 / get_by_email', {user})

		if (!user?.id) {
			logger.log('nothing found, creating everything...')

			const { user_id } = await create_user_through_netlify(data, trx)
			return {
				...get_base_user_from_netlify_user(data),
				id: user_id,
				created_at: (new Date()).toISOString(),
				updated_at: (new Date()).toISOString(),
				normalized_email: NORMALIZERS.normalize_email_full(data.email),
			}
		}

		// user already exists, just link to it
		logger.log('linking to an existing user...')
		await create_netlify_user({
			user_id: user.id,
			own_id: data.netlify_id,
		}, trx)
	}

	return ensure_up_to_date(user, get_base_user_from_netlify_user(data), trx)
}
