/*import memoize_one from 'memoize-one'*/
import assert from 'tiny-invariant'
import EventEmitter from 'emittery'
import stable_stringify from 'json-stable-stringify'
import { JSONObject, Storage } from '@offirmo-private/ts-types'
import {
	Immutable,
	get_schema_version_loose,
	get_base_loose,
	get_revision_loose,
	get_semantic_difference,
	SemanticDifference,
	compare as compare_state, has_versioned_schema,
} from '@offirmo-private/state-utils'
import { schedule_when_idle_but_not_too_far } from '@offirmo-private/async-utils'

import * as TBRPGState from '@tbrpg/state'
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

			// NO! base/root was harmonized recently, can be valid while not passing those type guards
			//const is_valid_state: boolean = is_BaseState(json) || is_RootState(json)
			const is_valid_state: boolean = has_versioned_schema(json)
			if (!is_valid_state)
				throw new Error(`Content of storage key "${key}" is not a base nor a root state!`)

			return json as any as State
		}
	})
}

/////////////////////////////////////////////////

export function create(
	SEC: OMRSoftExecutionContext,
	storage: Storage,
	dispatcher?: Dispatcher,
): Store {
	const LIB = `Store--local`
	return SEC.xTry(`creating ${LIB}…`, ({SEC, logger}) => {
		logger.trace(`${LIB}.create()…`)
		logger.verbose(`[${LIB}] FYI storage keys = "${Object.values(StorageKey).join(', ')}"`)

		let state: Immutable<State> | undefined = undefined
		let recovered_states_unmigrated_ordered: any[] = []
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
					catch (err) {
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
		let bkp__older: Array<Readonly<JSONObject> | undefined> = [
			_safe_read_parse_and_validate_from_storage<any>(storage, StorageKey.bkp_major_old, _on_error),
			_safe_read_parse_and_validate_from_storage<any>(storage, StorageKey.bkp_major_older, _on_error),
		]

		// should allow any minor overwrite,
		// in case manual revert or cloud sync.
		async function _enqueue_in_bkp_pipeline(some_state?: Immutable<State>): Promise<boolean> {
			logger.trace(`[${LIB}] _enqueue_in_bkp_pipeline()`, {
				candidate_rev: some_state ? get_revision_loose(some_state) : null,
				current_rev: state ? get_revision_loose(state) : null,
				bkp_rev: bkp__current ? get_revision_loose(bkp__current) : null,
				'legacy.length': recovered_states_unmigrated_ordered.length,
				//some_state,
			})
			if (!some_state) return false
			assert(get_schema_version_loose(some_state) === SCHEMA_VERSION, `schema version === ${SCHEMA_VERSION} (current)!`)
			if (some_state === restored_migrated) {
				logger.trace(`[${LIB}] _enqueue_in_bkp_pipeline(): echo from restoration, no change ✔`)
				return false
			}
			const semantic_difference = get_semantic_difference(some_state, bkp__current, { assert_newer: false })
			const is_different_enough = semantic_difference !== SemanticDifference.none && semantic_difference !== SemanticDifference.time
			if (bkp__current && !is_different_enough) {
				logger.trace(`[${LIB}] _enqueue_in_bkp_pipeline(): no relevant change ✔`, { semantic_difference })
				return false
			}

			logger.trace(`[${LIB}] _enqueue_in_bkp_pipeline(): ${semantic_difference} change…`)
			const promises: Promise<any>[] = []
			bkp__recent = bkp__current
			bkp__current = some_state
			promises.push(_optimized_store_key_value(StorageKey.bkp_main, bkp__current))
			if (bkp__recent) {
				if (get_schema_version_loose(bkp__recent) === SCHEMA_VERSION)
					promises.push(_optimized_store_key_value(StorageKey.bkp_minor, bkp__recent))
				else {
					// cleanup, will be stored in the major pipeline, cf. lines below
					storage.removeItem(StorageKey.bkp_minor)
					bkp__recent = undefined
				}
			}
			while(recovered_states_unmigrated_ordered.length) {
				logger.trace(`[${LIB}] _enqueue_in_bkp_pipeline(): since there was a change, moving restored states along the major bkp pipeline…`)
				const some_legacy_state = recovered_states_unmigrated_ordered.shift()
				if (get_schema_version_loose(some_legacy_state) < SCHEMA_VERSION)
					promises.push(_enqueue_in_major_bkp_pipeline(some_legacy_state))
			}
			await Promise.all(promises)

			return true
		}

		// EXPECTED: values are presented from the oldest to the newest!
		async function _enqueue_in_major_bkp_pipeline(legacy_state?: Readonly<any>): Promise<boolean> {
			logger.trace(`[${LIB}] _enqueue_in_major_bkp_pipeline()`, get_base_loose(legacy_state as any))

			const most_recent_previous_major_version = bkp__older[0]
			const semantic_difference = get_semantic_difference(legacy_state, most_recent_previous_major_version)
			switch (semantic_difference) {
				case SemanticDifference.none:
				case SemanticDifference.time:
					return false

				case SemanticDifference.minor: {
					bkp__older[0] = legacy_state
					break
				}
				case SemanticDifference.major: {
					bkp__older = [legacy_state, bkp__older[0]]
					break
				}
				default:
					throw new Error(`Unexpected difference when injecting into the major bkp pipeline: "${semantic_difference}"!`)
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
			recovered_states_unmigrated_ordered = [
					bkp__current || bkp__recent,
					...bkp__older,
				]
				.filter(s => !!s)
				.sort(compare_state)

			if (recovered_states_unmigrated_ordered.length)
				logger.trace(`[${LIB}] found ${recovered_states_unmigrated_ordered.length} past backups:`, {
					...((bkp__current || bkp__recent) && { main: bkp__current || bkp__recent }),
					...(bkp__older[0] && { major_1: bkp__older[0]}),
					...(bkp__older[1] && { major_1: bkp__older[1]}),
				})

			const most_recent_unmigrated_bkp = recovered_states_unmigrated_ordered.slice(-1)[0]

			if (!most_recent_unmigrated_bkp) {
				logger.trace(`[${LIB}] found NO candidate state to be restored.`)
			}
			else {
				logger.trace(`[${LIB}] found candidate state to be restored`, get_base_loose(most_recent_unmigrated_bkp))
				logger.trace(`[${LIB}] automigrating and restoring this candidate state…`)

				// memorize it for later
				restored_migrated = TBRPGState.migrate_to_latest(SEC,
					// deep clone in case the migration is not immutable (seen!)
					JSON.parse(JSON.stringify(
						most_recent_unmigrated_bkp
					))
				)

				// immediate sync restoration
				set(restored_migrated)

				if (dispatcher) {
					// NO!
					// - We can't do it SYNC because all the stores may not be plugged in yet
					// - We can't do it ASYNC because dependents would need to wait with sth like a promise
					// Eventually, we let the caller (plugging stores to dispatcher) do it.
					//logger.trace(`[${LIB}] forwarding the restored state to the dispatcher…`)
					//dispatcher.dispatch(create_action__set(restored_migrated!))
				}
			}
		}
		catch (err) {
			_on_error(err)
		}

		/////////////////////////////////////////////////

		function set(new_state: Immutable<State>): void {
			const semantic_difference = get_semantic_difference(new_state, state, { assert_newer: false })
			logger.trace(`${LIB}.set()`, {
				...get_base_loose(new_state),
				...(state
					? { previous: get_base_loose(state), semantic_difference }
					: { previous: null }
				),
			})

			if (!state) {
				logger.trace(`${LIB}.set(): init ✔`)
			}
			else if (semantic_difference === SemanticDifference.none) {
				logger.trace(`${LIB}.set(): no semantic change ✔`)
				return
			}

			state = new_state
			emitter.emit(EMITTER_EVT)

			_enqueue_in_bkp_pipeline(state)
				.catch(_on_error)
		}

		function get(): Immutable<State> {
			assert(state, `${LIB}.get(): never initialized`)

			return state
		}

		function on_dispatch(action: Immutable<Action>, eventual_state_hint?: Immutable<State>): void {
			logger.trace(`[${LIB}] ⚡ action dispatched: ${action.type}`, {
				...(eventual_state_hint && get_base_loose(eventual_state_hint)),
			})
			assert(state || eventual_state_hint, `on_dispatch(): ${LIB} should be provided a hint or a previous state`)
			assert(!!eventual_state_hint, `on_dispatch(): ${LIB} (upper level architectural invariant) hint is mandatory in this store`)

			const previous_state = state
			state = eventual_state_hint || reduce_action(state!, action)
			const semantic_difference = get_semantic_difference(state, previous_state, { assert_newer: false })
			logger.trace(`[${LIB}] ⚡ action dispatched & reduced:`, {
				current_rev: get_revision_loose(previous_state as any),
				new_rev: get_revision_loose(state as any),
				semantic_difference,
			})
			if (semantic_difference === SemanticDifference.none) {
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
