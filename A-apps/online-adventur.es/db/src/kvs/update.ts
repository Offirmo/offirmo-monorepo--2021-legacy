const { deepStrictEqual: assertDeepStrictEqual } = require('assert').strict

import assert from 'tiny-invariant'
import {
	has_versioned_schema,
	is_RootState,
	get_semantic_difference,
	SemanticDifference,
} from '@offirmo-private/state'

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
		bkp__old:    params.bkp__old || null,
		bkp__older:  params.bkp__older || null,
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

const SPECIAL_ERROR_ATTRIBUTE_WHEN_OLDER = 'latest_from_db'

export async function set_kv_entry<T>(
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

		// EXPECTED: values are presented from the oldest to the newest!
		function enqueue_in_bkp_pipeline(old_val: any) {
			if (!old_val) return
			const semantic_difference = get_semantic_difference(value, old_val)
			if (semantic_difference === 'major') {
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
				const semantic_difference = get_semantic_difference(old_val, most_recent_previous_major_version)
				switch (semantic_difference) {
					case 'minor':
						previous_major_versions[0] = old_val
						break
					case 'major':
						previous_major_versions.unshift(old_val)
						break
					default:
						throw new Error(`Unexpected difference when injecting into the major bkp pipeline: "${semantic_difference}"!`)
				}
			}
		}

		let existing: PKeyValue<T> | null = params.existing_hint || null
		existing = existing || await get<T>({ user_id, key }, trx)
		if (existing) {
			try {
				assertDeepStrictEqual(value, existing.value)
				logger.log('⭅ intelligently set a KV entry = no change ✔')
				return
			}
			catch {}

			try {
				assert(get_semantic_difference(value, existing.value), 'new value should really be newer!')
			}
			catch (err) {
				err[SPECIAL_ERROR_ATTRIBUTE_WHEN_OLDER] = existing.value
				throw err
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
		await set_kv_entry(params, trx)
		return params.value
	}
	catch (err) {
		if (err[SPECIAL_ERROR_ATTRIBUTE_WHEN_OLDER]) {
			return err[SPECIAL_ERROR_ATTRIBUTE_WHEN_OLDER]
		}
		throw err
	}
}
