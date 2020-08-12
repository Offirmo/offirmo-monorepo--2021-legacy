const { deepStrictEqual } = require('assert').strict

import Knex from 'knex'
import assert from 'tiny-invariant'

import { WithoutTimestamps } from '../types'
import get_db from '../db'
import { PUser } from '../users'
import { logger } from '../utils'
import { PKeyValue } from './types'
import { TABLE__KEY_VALUES } from './consts'

////////////////////////////////////

export async function upsert_kv_entry<T>(
	params: {
		user_id: PUser['id'],
		key: string,
		value: Readonly<T>,
		bkp?: any
		'v-1'?: any
		'v-2'?: any
	},
	trx: ReturnType<typeof get_db> = get_db()
): Promise<void> {
	logger.log('upserting a KV entry...', { params })

	const { user_id, key } = params

	// TODO validate JSON
	const data: WithoutTimestamps<PKeyValue<T>> = {
		user_id,
		key,
		value: params.value,
		bkp: params.bkp || null,
		'v-1': params['v-1'] || null,
		'v-2': params['v-2'] || null,
	}

	// inspired by
	// https://github.com/ratson/knex-upsert
	// https://dev.to/vvo/upserts-in-knex-js-1h4o
	const keys = [ 'user_id', 'key' ]
	const insert = trx.table(TABLE__KEY_VALUES).insert(data)
	const update_query = trx.queryBuilder().update(data)

	const keyPlaceholders = new Array(keys.length).fill('??').join(',')

	await trx.raw(`? ON CONFLICT (${keyPlaceholders}) DO ? RETURNING *`, [insert, ...keys, update_query])

	logger.log('upserted a KV entry ✔')
}

export async function set_kv_entry<T>(
	params: {
		user_id: PUser['id'],
		key: string,
		value: Readonly<T>,
	},
	trx: ReturnType<typeof get_db> = get_db()
): Promise<void> {
	logger.log('intelligently setting a KV entry...', { params })

	const { user_id, key } = params

	// TODO validate JSON
	const data: WithoutTimestamps<PKeyValue<T>> = {
		user_id,
		key,
		value: params.value,
		bkp: null,
		'v-1': null,
		'v-2': null,
	}

	// inspired by
	// https://github.com/ratson/knex-upsert
	// https://dev.to/vvo/upserts-in-knex-js-1h4o
	const keys = [ 'user_id', 'key' ]
	const insert = trx.table(TABLE__KEY_VALUES).insert(data)
	const read_query = trx.queryBuilder().select().where({ user_id, key })

	const keyPlaceholders = new Array(keys.length).fill('??').join(',')

	console.log({read_query, ts: read_query.toString()})
	const returned = await trx.raw(`? ON CONFLICT (${keyPlaceholders}) DO NOTHING RETURNING *`, [ insert, ...keys /*, read_query, user_id, key*/ ])
	console.log({returned})
	const { rows } = returned
	assert(rows.length === 1, 'set_kv_entry upsert is expected to return 1 entry')
	const { created_at, updated_at, ...current_db_data }: PKeyValue<T> = rows[0]

	try {
		deepStrictEqual(current_db_data.value, params.value)
		logger.log('intelligently set a KV entry = new ✔', current_db_data)
		return
	}
	catch {}
	console.log(current_db_data)

	logger.log('intelligently set a KV entry = new ✔', current_db_data)
	throw new Error('Not implemented!')
}
