import assert from 'tiny-invariant'
import stable_stringify from 'json-stable-stringify'

import get_db from '../db'
import { BaseUser, User, NetlifyUser, MergedUser } from './types'
import { TABLE_USERS } from './consts'
import { create_user_through_netlify } from './create'
import { get_full_user_through_netlify } from './read'
import logger from '../utils/logger'
import {WithoutTimestamps} from "../types";


export async function ensure_user_up_to_date(
	merged_user: Readonly<MergedUser>,
	trx: ReturnType<typeof get_db> = get_db()
): Promise<void> {
	const existing_data: Partial<BaseUser> = (() => {
		const { id, created_at, updated_at, ...fields } = merged_user._.user
		return {
			...fields
		}
	})()

	const candidate_data: Partial<User> = (() => {
		const { id, created_at, updated_at, _, ...fields } = merged_user
		return {
			...fields
		}
	})()

	assert(
		Object.keys(candidate_data).length === Object.keys(existing_data).length,
		'ensure_user_up_to_date: bad comparison!'
	)

	if (stable_stringify(existing_data) !== stable_stringify(candidate_data)) {
		return trx(TABLE_USERS)
			.where({ id: merged_user.id })
			.update(candidate_data)
	}
}

export async function ensure_user_through_netlify(
	netlify_id: NetlifyUser['own_id'],
	data: Readonly<BaseUser>,
	trx: ReturnType<typeof get_db>
): Promise<MergedUser> {
	logger.log('ensuring user from its netlify data...', { netlify_id, data })

	let result: MergedUser | null = null

	result = await get_full_user_through_netlify(netlify_id, trx)
	if (result) console.log('get_full_user_through_netlify #1', {result})

	if (!result) {
		// rare case of 1st time play
		// OR new login with a different system

		// Do we have a matching user already?

		// TODO one day try to hook into an existing player if not using netlify anymore!
		console.log('not found, creating a new user...')
		await create_user_through_netlify(netlify_id, data, trx)

		result = await get_full_user_through_netlify(netlify_id, trx)
		console.log('get_full_user_through_netlify #2', {result})
	}

	assert(result)

	await ensure_user_up_to_date(result!, trx)

	return result!
}
