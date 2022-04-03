/*import memoize_one from 'memoize-one'*/
import assert from 'tiny-invariant'
import EventEmitter from 'emittery'
import stable_stringify from 'json-stable-stringify'
import { normalizeError } from '@offirmo/error-utils'
import { JSONObject, Storage } from '@offirmo-private/ts-types'
import {
	fluid_select,
	Immutable,
	get_schema_version_loose,
	get_base_loose,
	get_revision_loose,
	UNCLEAR_compare,
} from '@offirmo-private/state-utils'
import { schedule_when_idle_but_not_too_far } from '@offirmo-private/async-utils'

import { State, SCHEMA_VERSION } from '@tbrpg/state'
import { Action } from '@tbrpg/interfaces'


import { OMRSoftExecutionContext } from '../../sec'
import { Store, Dispatcher } from '../../types'
import { reduce_action } from '../../utils/reduce-action'
import try_or_fallback from '../../utils/try_or_fallback'

/////////////////////////////////////////////////

const EMITTER_EVT = 'change'

export const StorageKey = {
	bkp_main:        'the-boring-rpg.savegame',
	bkp_minor:       'the-boring-rpg.savegame-bkp',
	bkp_major_old:   'the-boring-rpg.savegame-bkp-m1',
	bkp_major_older: 'the-boring-rpg.savegame-bkp-m2',
}

/////////////////////////////////////////////////

export function _safe_read_parse_and_validate_from_storage<State>(
	storage: Storage,
	key: string,
	on_error: (err: Error) => void = (err) => { throw err },
): State | undefined {
	const fallback = undefined
	return try_or_fallback({
		fallback,
		on_error,
		code: () => {
			// LS access can throw
			const ls_content = storage.getItem(key)
			if (!ls_content)
				return fallback

			// can throw as well
			const json: JSONObject = JSON.parse(ls_content)
			//console.log('parsed', json)

			// need this check due to some serializations returning {} for empty
			const is_empty: boolean = !json || Object.keys(json).length === 0
			if (is_empty)
				return fallback

			// NOTE base/root was reworked over time, can be valid while not passing those type guards
			//const is_valid_state: boolean = is_BaseState(json) || is_RootState(json) || has_versioned_schema(json)

			return json as any as State
		}
	})
}

/////////////////////////////////////////////////

export function create(
	SEC: OMRSoftExecutionContext,
	storage: Storage,
	migrate_to_latest: (SEC: OMRSoftExecutionContext, legacy: Immutable<any>, hints?: Immutable<any>) => Immutable<State>,
	dispatcher?: Dispatcher,
): Store {
	const LIB = `🗃ⵧ⚫local`
	return SEC.xTry(`creating ${LIB}…`, ({SEC, logger}) => {
		logger.trace(`[${LIB}].create()…`)
		logger.verbose(`[${LIB}] FYI storage keys = "${Object.values(StorageKey).join(', ')}"`)

		let state: Immutable<State> | undefined = undefined
		let recovered_states_unmigrated_ordered_oldest_first: any[] = []
		let restored_migrated: Immutable<State> | undefined = undefined

		/////////////////////////////////////////////////

		function _on_error(err: Error) {
			logger.warn(`[${LIB}] Error while processing`, err)
			// TODO report to dispatcher
		}

		function _store_key_value(key: string, json: any): void {
			const value = stable_stringify(json)
			logger.trace(`[${LIB}] 💾 writing "${key}"…`, get_base_loose(json))
			storage.setItem(key, value)
			logger.trace(`[${LIB}] 💾 written "${key}" ✔`, { /*snapshot: JSON.parse(value)*/ })
		}

		function _optimized_store_key_value(key: string, json: any): Promise<void> {
			return new Promise((resolve, reject) => {
				schedule_when_idle_but_not_too_far(() => {
					try {
						resolve(_store_key_value(key, json))
					}
					catch (_err) {
						const err = normalizeError(_err)
						reject(err)
					}
				})
			})
		}

		const emitter = new EventEmitter<{ change: undefined }>()

		/////////////////////////////////////////////////
		// bkp pipeline

		let bkp__current: Immutable<State> | undefined = _safe_read_parse_and_validate_from_storage<State>(storage, StorageKey.bkp_main, _on_error)
		let bkp__recent: Immutable<State> | undefined = _safe_read_parse_and_validate_from_storage<State>(storage, StorageKey.bkp_minor, _on_error)
		let bkp__older: Array<Readonly<JSONObject>> = [
			_safe_read_parse_and_validate_from_storage<any>(storage, StorageKey.bkp_major_old, _on_error),
			_safe_read_parse_and_validate_from_storage<any>(storage, StorageKey.bkp_major_older, _on_error),
		].filter(s => !!s)

		// TODO should allow any minor overwrite, in case manual revert
		// Return value: not used TODO review and clean
		async function _enqueue_in_bkp_pipeline(some_state: Immutable<State>): Promise<boolean> {
			logger.trace(`[${LIB}] _enqueue_in_bkp_pipeline()`, {
				candidate: get_base_loose(some_state as any),
				current: get_base_loose(state as any),
				bkp__current: get_base_loose(bkp__current as any),
				'legacy.length': recovered_states_unmigrated_ordered_oldest_first.length,
				//some_state,
			})

			assert(get_schema_version_loose(some_state) === SCHEMA_VERSION, `_enqueue_in_bkp_pipeline(): schema version === ${SCHEMA_VERSION} (current)!`)

			if (some_state === restored_migrated) {
				logger.trace(`[${LIB}] _enqueue_in_bkp_pipeline(): echo from restoration, no change ✔`)
				return false
			}

			const has_valuable_difference = !bkp__current || fluid_select(some_state).has_valuable_difference_with(bkp__current)
			if (!has_valuable_difference) {
				logger.trace(`[${LIB}] _enqueue_in_bkp_pipeline(): no valuable change ✔`)
				return false
			}

			logger.trace(`[${LIB}] _enqueue_in_bkp_pipeline(): valuable change…`)
			const promises: Promise<any>[] = []
			bkp__recent = bkp__current
			bkp__current = some_state
			promises.push(_optimized_store_key_value(StorageKey.bkp_main, bkp__current))
			if (bkp__recent) {
				if (get_schema_version_loose(bkp__recent) === SCHEMA_VERSION)
					promises.push(_optimized_store_key_value(StorageKey.bkp_minor, bkp__recent))
				else {
					// cleanup, we move it to the major pipeline, cf. lines below
					storage.removeItem(StorageKey.bkp_minor)
					bkp__recent = undefined
				}
			}
			if (recovered_states_unmigrated_ordered_oldest_first.length)
				logger.trace(`[${LIB}] _enqueue_in_bkp_pipeline(): this is the first valuable change, moving restored states along the major bkp pipeline…`)
			while(recovered_states_unmigrated_ordered_oldest_first.length) {
				const some_legacy_state = recovered_states_unmigrated_ordered_oldest_first.shift()
				if (get_schema_version_loose(some_legacy_state) < SCHEMA_VERSION)
					promises.push(_enqueue_in_major_bkp_pipeline(some_legacy_state))
			}
			await Promise.all(promises)

			return true
		}

		// EXPECTED: values are presented from the oldest to the newest!
		async function _enqueue_in_major_bkp_pipeline(legacy_state: Immutable<any>): Promise<boolean> {
			const most_recent_previous_major_version = bkp__older[0] as any
			logger.trace(`[${LIB}] _enqueue_in_major_bkp_pipeline()`, {
				...fluid_select(legacy_state).get_debug_infos_about_comparison_with(most_recent_previous_major_version, 'enqueued', 'most_recent_major'),
				current_major_bkp_pipeline: JSON.parse(JSON.stringify(bkp__older))
			})

			assert(
				fluid_select(legacy_state).has_higher_or_equal_schema_version_than(most_recent_previous_major_version),
				`_enqueue_in_major_bkp_pipeline() candidate should >= version than most recent major`
			)

			const is_major_update = fluid_select(legacy_state).has_higher_schema_version_than(most_recent_previous_major_version)
			if (is_major_update) {
				bkp__older = [legacy_state, bkp__older[0]].filter(s => !!s)
			}
			else {
				const has_valuable_difference = fluid_select(legacy_state).has_valuable_difference_with(most_recent_previous_major_version)
				if (!has_valuable_difference)
					return false

				bkp__older[0] = legacy_state
			}

			logger.trace(`[${LIB}] _enqueue_in_major_bkp_pipeline(): saving major`, get_base_loose(bkp__older[0] as any))
			await _optimized_store_key_value(StorageKey.bkp_major_old, bkp__older[0])
			if (bkp__older[1]) {
				logger.trace(`[${LIB}] _enqueue_in_major_bkp_pipeline(): saving major-1`, get_base_loose(bkp__older[1] as any))
				await _optimized_store_key_value(StorageKey.bkp_major_older, bkp__older[1])
			}

			return true
		}

		/////////////////////////////////////////////////

		// recover from bkp (we handle potentially sparse bkp pipeline)
		try {
			logger.verbose(`[${LIB}] attempting to restore…`)

			// XXX this code block is tricky, beware sync/async

			// read and store everything needed in memory
			recovered_states_unmigrated_ordered_oldest_first = [
					...bkp__older,
					bkp__current || bkp__recent,
				]
				.filter(s => !!s)
				.sort(UNCLEAR_compare)
			bkp__older = [] // reset since we hold the backups in the var above now

			if (recovered_states_unmigrated_ordered_oldest_first.length)
				logger.trace(`[${LIB}] found ${recovered_states_unmigrated_ordered_oldest_first.length} past backups:`, {
					recovered_states_unmigrated_ordered_most_recent_first: JSON.parse(JSON.stringify(recovered_states_unmigrated_ordered_oldest_first)),
					...(bkp__current && { main: bkp__current }),
					...(bkp__recent && { minor: bkp__recent }),
					...(bkp__older[0] && { major_1: bkp__older[0]}),
					...(bkp__older[1] && { major_2: bkp__older[1]}),
				})

			const most_recent_unmigrated_bkp = recovered_states_unmigrated_ordered_oldest_first.slice(-1)[0]

			if (!most_recent_unmigrated_bkp) {
				logger.trace(`[${LIB}] found NO candidate state to be restored.`)
			}
			else {
				logger.trace(`[${LIB}] found candidate state to be restored`, get_base_loose(most_recent_unmigrated_bkp))
				logger.trace(`[${LIB}] automigrating and restoring this candidate state…`)

				// memorize it for later
				restored_migrated = migrate_to_latest(SEC,
					// deep clone in case the migration is not immutable (seen!)
					JSON.parse(JSON.stringify(
						most_recent_unmigrated_bkp
					))
				)

				// immediate sync restoration
				set(restored_migrated)

				if (dispatcher) {
					// NO DISPATCH ON RESTORATION!
					// - We can't do it SYNC because all the stores may not be plugged in yet
					// - We can't do it ASYNC because dependents would need to wait with sth like a promise
					// Eventually, we let the caller (plugging stores to dispatcher) do it.
					//logger.trace(`[${LIB}] forwarding the restored state to the dispatcher…`)
					//dispatcher.dispatch(create_action__set(restored_migrated!))
				}
			}
		}
		catch (_err) {
			const err = normalizeError(_err)
			_on_error(err)
		}

		/////////////////////////////////////////////////

		function set(new_state: Immutable<State>): void {
			const has_valuable_difference = !state || fluid_select(new_state).has_valuable_difference_with(state)
			logger.trace(`[${LIB}].set()`, {
				new_state: get_base_loose(new_state),
				existing_state: get_base_loose(state as any),
			})

			if (!state) {
				logger.trace(`[${LIB}].set(): init ✔`)
			}
			else if (new_state === state) {
				logger.warn(`[${LIB}].set(): echo ?`)
				return
			}
			else if (!has_valuable_difference) {
				logger.trace(`[${LIB}].set(): no semantic change ✔`)
				return
			}

			state = new_state
			emitter.emit(EMITTER_EVT)

			_enqueue_in_bkp_pipeline(state)
				.catch(_on_error)
		}

		function get(): Immutable<State> {
			assert(state, `[${LIB}].get(): should be initialized`)

			return state
		}

		function on_dispatch(action: Immutable<Action>, eventual_state_hint?: Immutable<State>): void {
			logger.trace(`[${LIB}] ⚡ action dispatched: ${action.type}`, {
				eventual_state_hint: get_base_loose(eventual_state_hint as any),
			})
			assert(state || eventual_state_hint, `[${LIB}].on_dispatch(): should be provided a hint or a previous state`)
			assert(!!eventual_state_hint, `[${LIB}].on_dispatch(): (upper level architectural invariant) hint is mandatory in this store`)

			const previous_state = state
			state = eventual_state_hint || reduce_action(state!, action)
			const has_valuable_difference = !previous_state || fluid_select(state).has_valuable_difference_with(previous_state)
			logger.trace(`[${LIB}] ⚡ action dispatched & reduced:`, {
				current_rev: get_revision_loose(previous_state as any),
				new_rev: get_revision_loose(state as any),
				has_valuable_difference,
			})
			if (!has_valuable_difference) {
				return
			}

			emitter.emit(EMITTER_EVT)

			_enqueue_in_bkp_pipeline(state)
				.catch(_on_error)
		}

		function subscribe(debug_id: string, listener: () => void): () => void {
			emitter.on(EMITTER_EVT, listener)

			if (state) listener() // semantically disputable, but for convenience

			return () => emitter.off(EMITTER_EVT, listener)
		}

		return {
			get,
			on_dispatch,
			subscribe,
			set,
		}
	})
}

export default create
