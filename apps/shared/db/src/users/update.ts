import assert from 'tiny-invariant'

import get_db from '../db'

import { BaseUser, NetlifyUser, MergedUser } from './types'
import { create_user_through_netlify } from './create'
import { get_full_user_through_netlify } from './read'


export async function ensure_user_through_netlify(netlify_id: NetlifyUser['own_id'], data: Readonly<BaseUser>): Promise<MergedUser> {
	let result = await get_full_user_through_netlify(netlify_id)
	if (result) console.log('get_full_user_through_netlify #1', {result})

	if (!result) {
		// rare case of 1st time play
		console.log('not found, creating a new user...')
		await create_user_through_netlify(netlify_id, data)

		result = await get_full_user_through_netlify(netlify_id)
		console.log('get_full_user_through_netlify #2', {result})
	}

	assert(result)

	return result!
}
