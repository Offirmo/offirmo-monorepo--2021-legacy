import Knex from 'knex'
import assert from 'tiny-invariant'

import { WithoutTimestamps } from '../types'
import { normalize_email_reasonable, normalize_email_full } from '../utils/email'
import get_db from '../db'
import { NetlifyUser, BaseUser, PUser, PNetlifyUser, } from './types'
import logger from '../utils/logger'
import {sanitize_persisted} from "./common";

////////////////////////////////////

export function netlify_to_base_user(input: Readonly<NetlifyUser>): BaseUser {
	return sanitize_persisted({
		called: input.full_name,
		usual_email: input.email,
		avatar_url: input.avatar_url,
		roles: input.roles,
	})
}

export async function create_user(
	data: Readonly<BaseUser>,
	trx: ReturnType<typeof get_db> = get_db()
): Promise<PUser['id']> {
	data = {
		...data,
		usual_email: normalize_email_reasonable(data.usual_email),
		normalized_email: normalize_email_full(data.usual_email),
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
	data: Readonly<WithoutTimestamps<PNetlifyUser>>,
	trx: ReturnType<typeof get_db> = get_db()
): Promise<Readonly<WithoutTimestamps<PNetlifyUser>>> {
	logger.log('creating Netlify user...', { data })

	await trx('users__netlify')
		.insert(data)
		// no auto id, the id is provided by Netlify itself

	const { own_id, user_id } = data
	logger.log('created Netlify user ✔', { own_id, user_id })

	return { own_id, user_id }
}

export async function create_through_netlify(
	data: Readonly<NetlifyUser>,
	trx: ReturnType<typeof get_db>
): Promise<Readonly<WithoutTimestamps<PNetlifyUser>>> {
	logger.log('creating user through Netlify...', { data })
	assert(data.netlify_id, 'create_through_netlify: Netlify Id is mandatory!') // can this be typed?

	const user_id = await create_user(netlify_to_base_user(data), trx)
	const netlify_user: WithoutTimestamps<PNetlifyUser> = {
		user_id,
		own_id: data.netlify_id,
	}

	const res = await create_netlify_user(netlify_user, trx)

	logger.log('created user through Netlify ✔', res)

	return res
}
