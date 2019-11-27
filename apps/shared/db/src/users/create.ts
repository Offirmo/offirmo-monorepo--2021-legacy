import Knex from 'knex'
import assert from 'tiny-invariant'

import { WithoutTimestamps } from '../types'
import { normalize_email, get_gravatar_url } from '../utils/email'
import get_db from '../db'
import { BaseUser, User, NetlifyUser } from './types'
import logger from '../utils/logger'



export async function create_user(
	data: Readonly<BaseUser>,
	trx: ReturnType<typeof get_db> = get_db()
): Promise<User['id']> {
	data = {
		...data,
		email: normalize_email(data.email),
		avatar_url: data.avatar_url || get_gravatar_url(data.email),
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
	data: Readonly<WithoutTimestamps<NetlifyUser>>,
	trx: ReturnType<typeof get_db> = get_db()
): Promise<Readonly<WithoutTimestamps<NetlifyUser>>> {
	logger.log('creating Netlify user...', { data })

	await trx('users__netlify')
		.insert(data)
		// no auto id, the id is provided by Netlify itself

	const { own_id, user_id } = data
	logger.log('created Netlify user ✔', { own_id, user_id })

	return { own_id, user_id }
}

export async function create_user_through_netlify(
	netlify_id: NetlifyUser['own_id'],
	data: Readonly<BaseUser>,
	trx: ReturnType<typeof get_db>
): Promise<Readonly<WithoutTimestamps<NetlifyUser>>> {
	logger.log('creating user through Netlify...', { netlify_id, data })

	const user_id = await create_user(data, trx)
	const netlify_user: WithoutTimestamps<NetlifyUser> = {
		user_id,
		own_id: netlify_id,
	}

	const res = await create_netlify_user(netlify_user, trx)
	logger.log('created user through Netlify ✔', res)
	return res
}
