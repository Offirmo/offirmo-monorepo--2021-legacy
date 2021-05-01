const { deepStrictEqual: assertDeepStrictEqual } = require('assert').strict
const { isDeepStrictEqual } = require('util')

import assert from 'tiny-invariant'
import { createError } from '@offirmo/error-utils'
import { fluid_select } from '@offirmo-private/state-utils'

import { WithoutTimestamps } from '../types'
import get_db from '../db'
import { PUser } from '../users'
import { logger } from '../utils'
import { PKeyValue } from './types'
import { TABLE__KEY_VALUES } from './consts'
import { get } from './read'

////////////////////////////////////


export async function upsert_kv_entry<T>(
	params: {
		user_id: PUser['id'],
		key: string,
		value: Readonly<T>,
		bkp__recent?: any
		bkp__old?: any
		bkp__older?: any
	},
	trx: ReturnType<typeof get_db> = get_db()
): Promise<void> {
	logger.log('⭆ upserting a KV entry...', { params })

	const { user_id, key } = params

	// TODO validate JSON
	const data: WithoutTimestamps<PKeyValue<T>> = {
		user_id,
		key,
		value: params.value,
		bkp__recent: params.bkp__recent || null,
		bkp__old:    params.bkp__old    || null,
		bkp__older:  params.bkp__older  || null,
	}

	// inspired by
	// https://github.com/ratson/knex-upsert
	// https://dev.to/vvo/upserts-in-knex-js-1h4o
	const keys = [ 'user_id', 'key' ]
	const insert = trx.table(TABLE__KEY_VALUES).insert(data)
	const update_query = trx.queryBuilder().update(data)

	const keyPlaceholders = new Array(keys.length).fill('??').join(',')

	await trx.raw(`? ON CONFLICT (${keyPlaceholders}) DO ? RETURNING *`, [insert, ...keys, update_query])

	logger.log('⭅ upserted a KV entry ✔')
}


const SPECIAL_ERROR_ATTRIBUTE__LATEST_FROM_DB = 'latest_from_db'


export async function set_kv_entry_intelligently<T>(
	params: {
		user_id: PUser['id'],
		key: string,
		value: Readonly<T>,
		existing_hint?: PKeyValue<T>,
	},
	trx: ReturnType<typeof get_db> = get_db()
): Promise<void> {
	logger.log('⭆ intelligently setting a KV entry...', { params })

	try {
		const { user_id, key, value } = params
		let bkp__recent: PKeyValue<T>['bkp__recent'] = null
		let previous_major_versions: any[] = []

		// TODO validate JSON

		let existing: PKeyValue<T> | null = params.existing_hint || null
		existing = existing || await get<T>({ user_id, key }, trx)
		if (existing) {
			if (isDeepStrictEqual(value, existing.value)) {
				logger.log('⭅ intelligently set a KV entry = no change ✔')
				return
			}

			const is_client_up_to_date = fluid_select(value).has_higher_or_equal_schema_version_than(existing.value)
			if (!is_client_up_to_date) {
				// since the client is online, it should update itself first!
				// TODO review: or should we always succeed?
				throw createError(`Old schema version, please update your client first!`, { statusCode: 426 }) // upgrade required
			}

			const should_candidate_replace_existing = fluid_select(value).has_higher_investment_than(existing.value)
			if (!should_candidate_replace_existing) {
				// that's how a lagging client will get the newest/most invested in data
				throw createError(`[internal] existing has precedence!`, { [SPECIAL_ERROR_ATTRIBUTE__LATEST_FROM_DB]: existing.value })
			}

			// EXPECTED: calls to this function are expected from the oldest to the newest!
			function enqueue_in_bkp_pipeline(old_val: any) {
				if (!old_val) return

				const is_major_update = fluid_select(value).has_higher_schema_version_than(old_val)
				if (is_major_update) {
					enqueue_in_major_bkp_pipeline(old_val)
				} else {
					bkp__recent = old_val
				}
			}

			// EXPECTED: values are presented from the oldest to the newest!
			function enqueue_in_major_bkp_pipeline(old_val: any) {
				const most_recent_previous_major_version = previous_major_versions[0]
				const has_previous_major_version = !!most_recent_previous_major_version
				if (!has_previous_major_version)
					previous_major_versions.unshift(old_val)
				else {
					const is_major_update = fluid_select(old_val).has_higher_schema_version_than(most_recent_previous_major_version)
					if (is_major_update) {
						previous_major_versions.unshift(old_val)
					}
					else {
						previous_major_versions[0] = old_val
					}
				}
			}

			// IMPORTANT should enqueue from oldest to newest
			enqueue_in_bkp_pipeline(existing.bkp__older)
			enqueue_in_bkp_pipeline(existing.bkp__old)
			enqueue_in_bkp_pipeline(existing.bkp__recent)
			enqueue_in_bkp_pipeline(existing.value)
		}

		const data: WithoutTimestamps<PKeyValue<T>> = {
			user_id,
			key,
			value: params.value,
			bkp__recent,
			bkp__old: previous_major_versions[0] || null,
			bkp__older: previous_major_versions[1] || null,
		}

		await upsert_kv_entry(data, trx)

		logger.log('⭅ intelligently set a KV entry ✔', data)
	}
	catch (err) {
		logger.error('⭅ intelligently set a KV entry ❌ ERROR', { err })
		throw err
	}
}


export async function sync_kv_entry<T>(
	params: {
		user_id: PUser['id'],
		key: string,
		value: Readonly<T>,
		existing_hint?: PKeyValue<T>,
	},
	trx: ReturnType<typeof get_db> = get_db()
): Promise<T> {
	try {
		await set_kv_entry_intelligently(params, trx)
		return params.value
	}
	catch (err) {
		if (err[SPECIAL_ERROR_ATTRIBUTE__LATEST_FROM_DB]) {
			return err[SPECIAL_ERROR_ATTRIBUTE__LATEST_FROM_DB]
		}
		throw err
	}
}
