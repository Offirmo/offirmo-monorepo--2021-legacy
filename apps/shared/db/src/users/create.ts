import Knex from 'knex'
import assert from 'tiny-invariant'

import get_db from '../db'
import { WithoutTimestamps } from '../types'
import { BaseUser, User, NetlifyUser } from './types'


export async function create_user(data: Readonly<BaseUser>, trx: ReturnType<typeof get_db> = get_db()): Promise<User['id']> {
	const [ id ] = await trx('users')
		.insert(data)
		.returning('id')

	assert(id >= 0, 'created user id')

	return id
}

export async function create_netlify_user(data: Readonly<WithoutTimestamps<NetlifyUser>>, trx: ReturnType<typeof get_db> = get_db()): Promise<void> {
	await trx('users__netlify')
		.insert(data)
}


export async function create_user_through_netlify(netlify_id: NetlifyUser['own_id'], base_data: Readonly<BaseUser>): Promise<void> {
	return get_db().transaction(async (trx) => {
		const user_id = await create_user(base_data, trx)
		const netlify_user: WithoutTimestamps<NetlifyUser> = {
			user_id,
			own_id: netlify_id,
		}

		return create_netlify_user(netlify_user, trx)
			.then(trx.commit)
			.then(() => {})
			.catch(err => {
				trx.rollback(err)
				throw err // TODO ensure needed
			})
	})
}
