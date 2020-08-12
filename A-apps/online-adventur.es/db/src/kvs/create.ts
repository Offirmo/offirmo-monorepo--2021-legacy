import Knex from 'knex'
import assert from 'tiny-invariant'

import { WithoutTimestamps } from '../types'
import get_db from '../db'
import { PUser } from '../users'
import { logger } from '../utils'
import { PKeyValue } from './types'
import { TABLE__KEY_VALUES } from './consts'

////////////////////////////////////

export async function create_kv_entry<T>(
	{ user_id, key, value }: {
		user_id: PUser['id'],
		key: string,
		value: Readonly<T>,
	},
	trx: ReturnType<typeof get_db> = get_db()
): Promise<void> {
	// TODO validate JSON
	const data: WithoutTimestamps<PKeyValue<T>> = {
		user_id,
		key,
		value,
		bkp: null,
		'v-1': null,
		'v-2': null,
	}
	logger.log('creating a KV entry...', { data })

	await trx(TABLE__KEY_VALUES)
		.insert(data)

	logger.log('created a KV entry ✔')
}
