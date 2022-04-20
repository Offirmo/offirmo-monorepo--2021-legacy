import assert from 'tiny-invariant'
import { Immutable } from '@offirmo-private/ts-types'

import { WithoutTimestamps } from '../types'
import get_db from '../db'
import { NetlifyUser, BaseUser, PUser, PNetlifyUser, } from './types'
import { logger, normalize_email_full } from '../utils'
import { sanitize_persisted } from './common'

////////////////////////////////////

export function get_base_user_from_netlify_user(input: Immutable<NetlifyUser>): Immutable<BaseUser> {
	return sanitize_persisted({
		called: input.full_name,
		raw_email: input.email,
		avatar_url: input.avatar_url,
		roles: input.roles,
	})
}

////////////////////////////////////

export async function create_user(
	data: Immutable<BaseUser>,
	trx: ReturnType<typeof get_db> = get_db()
): Promise<PUser['id']> {
	data = {
		...data,
		//raw_email: normalize_email_safe(data.raw_email),
		normalized_email: normalize_email_full(data.raw_email),
	}
	logger.log('creating user...', { data })

	const [ id ] = await trx('users')
		.insert(data)
		.returning('id')

	assert(id >= 0, 'created user id')

	logger.log('created user ✔', { id })

	return id
}

export async function create_netlify_user(
	data: Immutable<WithoutTimestamps<PNetlifyUser>>,
	trx: ReturnType<typeof get_db> = get_db()
): Promise<Immutable<WithoutTimestamps<PNetlifyUser>>> {
	logger.log('creating Netlify user...', { data })

	await trx('users__netlify')
		.insert(data)
		// no auto id, the id is provided by Netlify itself

	const { own_id, user_id } = data
	logger.log('created Netlify user ✔', { own_id, user_id })

	return { own_id, user_id }
}

export async function create_user_through_netlify(
	data: Immutable<NetlifyUser>,
	trx: ReturnType<typeof get_db>
): Promise<Immutable<WithoutTimestamps<PNetlifyUser>>> {
	logger.log('creating user through Netlify...', { data })
	assert(data.netlify_id, 'create_user_through_netlify: Netlify Id is mandatory!') // can this be typed?

	const user_id = await create_user(get_base_user_from_netlify_user(data), trx)
	const netlify_user: WithoutTimestamps<PNetlifyUser> = {
		user_id,
		own_id: data.netlify_id,
	}

	const res = await create_netlify_user(netlify_user, trx)

	logger.log('created user through Netlify ✔', res)

	return res
}
