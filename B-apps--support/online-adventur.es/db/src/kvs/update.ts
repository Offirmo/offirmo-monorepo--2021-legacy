const { isDeepStrictEqual } = require('util')
import { Immutable } from '@offirmo-private/ts-types'

import assert from 'tiny-invariant'
import { createError } from '@offirmo/error-utils'
import { AnyOffirmoState, fluid_select } from '@offirmo-private/state-utils'

import { WithoutTimestamps } from '../types'
import get_db from '../db'
import { PUser } from '../users'
import { logger } from '../utils'
import { PKeyValue } from './types'
import { TABLE__KEY_VALUES } from './consts'
import { get } from './read'

////////////////////////////////////


export async function upsert_kv_entry<T>(
	params: Immutable<{
		user_id: PUser['id'],
		key: string,
		value: T,
		bkp__recent?: any
		bkp__old?: any
		bkp__older?: any
	}>,
	trx: ReturnType<typeof get_db> = get_db()
): Promise<void> {
	logger.log('⭆ upserting a KV entry...', { params })

	const { user_id, key } = params

	// TODO validate JSON
	const data: Immutable<WithoutTimestamps<PKeyValue<T>>> = {
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


const SPECIAL_ERROR_ATTRIBUTE__LATEST_FROM_DB = '_latest_from_db'


export async function set_kv_entry_intelligently<T>(
	params: Immutable<{
		user_id: PUser['id'],
		key: string,
		value: T,
		//existing_hint?: PKeyValue<T>,
	}>,
	trx: ReturnType<typeof get_db> = get_db()
): Promise<void> {
	logger.log('⭆ intelligently setting a KV entry...', { params })

	try {
		const { user_id, key, value } = params
		let bkp__recent: PKeyValue<T>['bkp__recent'] = null
		let previous_major_versions: any[] = []

		// TODO validate JSON

		let existing_pipeline: PKeyValue<T> | null = /*params.existing_hint ||*/ null
		existing_pipeline = /*existing_pipeline ||*/ await get<T>({ user_id, key }, trx)
		logger.log('… intelligently setting a KV entry', {
			//candidate: value,
			//existing_pipeline,
			...fluid_select(value as unknown as AnyOffirmoState)
				.get_debug_infos_about_comparison_with(existing_pipeline?.value as unknown as AnyOffirmoState, 'candidate', 'existing'),
		})

		if (existing_pipeline) {
			if (isDeepStrictEqual(value, existing_pipeline.value)) {
				logger.log('⭅ intelligently set a KV entry = no change ✔')
				return
			}

			// DISCUSSION
			// In theory, this endpoint should only look at investment, not schema version
			// (ex. an outdated client = app store, played a long time offline, suddenly coming online)
			// HOWEVER could that break the backup pipeline? TODO review

			/* NO, according to above
			const is_client_up_to_date = fluid_select(value as unknown as AnyOffirmoState).has_higher_or_equal_schema_version_than(existing_pipeline.value as unknown as AnyOffirmoState)
			if (!is_client_up_to_date) {
				// since the client is online, it should update itself first!
				// TODO review: or should we always succeed?
				throw createError(`Old schema version, please update your client first!`, { statusCode: 426 }) // upgrade required
			}*/

			const should_candidate_replace_existing = fluid_select(value as unknown as AnyOffirmoState).has_higher_investment_than(existing_pipeline.value as unknown as AnyOffirmoState)
			if (!should_candidate_replace_existing) {
				// that's how a lagging client will get the newest/most invested in data
				throw createError(`Existing data has more value/investment!`, { [SPECIAL_ERROR_ATTRIBUTE__LATEST_FROM_DB]: existing_pipeline.value })
			}

			// EXPECTED: calls to this function are expected from the oldest to the newest!
			function enqueue_in_bkp_pipeline(old_val: any) {
				if (!old_val) return

				const is_major_update = fluid_select(value as unknown as AnyOffirmoState).has_higher_schema_version_than(old_val as unknown as AnyOffirmoState)
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
			enqueue_in_bkp_pipeline(existing_pipeline.bkp__older)
			enqueue_in_bkp_pipeline(existing_pipeline.bkp__old)
			enqueue_in_bkp_pipeline(existing_pipeline.bkp__recent)
			enqueue_in_bkp_pipeline(existing_pipeline.value)
		}

		const data: Immutable<WithoutTimestamps<PKeyValue<T>>> = {
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
	params: Immutable<{
		user_id: PUser['id'],
		key: string,
		value: T,
		//existing_hint?: PKeyValue<T>,
	}>,
	trx: ReturnType<typeof get_db> = get_db()
): Promise<Immutable<T>> {
	logger.log('⭆ syncing a KV entry...', { params })

	try {
		await set_kv_entry_intelligently(params, trx)
		logger.log('⭅ intelligently sync’ed a KV entry ✅')
		return params.value
	}
	catch (err) {
		const existing_value_with_precedence = (err as any)?.details?.[SPECIAL_ERROR_ATTRIBUTE__LATEST_FROM_DB]
		if (existing_value_with_precedence) {
			logger.log('⭅ intelligently sync’ed a KV entry ❎')
			return existing_value_with_precedence
		}

		logger.error('⭅ FAILED to intelligently sync a KV entry ❌')
		throw err
	}
}
