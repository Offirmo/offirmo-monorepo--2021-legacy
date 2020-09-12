/*import memoize_one from 'memoize-one'*/
import assert from 'tiny-invariant'
import EventEmitter from 'emittery'
import stable_stringify from 'json-stable-stringify'
import {JSONObject, Storage} from '@offirmo-private/ts-types'
import {
	get_schema_version_loose,
	get_base_loose,
	is_BaseState,
	is_RootState,
	get_semantic_difference,
	SemanticDifference,
	compare as compare_state,
} from '@offirmo-private/state'

import * as TBRPGState from '@tbrpg/state'
import { State, SCHEMA_VERSION } from '@tbrpg/state'
import { Action } from '@tbrpg/interfaces'


import { OMRSoftExecutionContext } from '../../sec'
import { Store } from '../../types'
import { reduce_action } from '../../utils/reduce-action'
import try_or_fallback from '../../utils/try_or_fallback'

/////////////////////////////////////////////////

const EMITTER_EVT = 'change'
export const OPTIMIZATION_DELAY_MS = 1

export const StorageKey = {
	main:            'the-boring-rpg.savegame',
	bkp_minor:       'the-boring-rpg.savegame-bkp',
	bkp_major_old:   'the-boring-rpg.savegame-bkp-m1',
	bkp_major_older: 'the-boring-rpg.savegame-bkp-m2',
}

/////////////////////////////////////////////////

export function _safe_read_parse_and_validate_from_storage<State>(
	storage: Storage,
	key: string,
	on_error: (err: Error) => void = (err) => { throw err },
): Readonly<State> | undefined {
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
			const json = JSON.parse(ls_content)

			// need this check due to some serializations returning {} for empty
			const is_empty: boolean = !json || Object.keys(json).length === 0
			if (is_empty)
				return fallback

			const is_valid_state: boolean = is_BaseState(json) || is_RootState(json)
			if (!is_valid_state)
				throw new Error(`Content of storage key "${key}" is not a base nor a root state!`)

			return json as State
		}
	})
}

/////////////////////////////////////////////////

export function create(
	SEC: OMRSoftExecutionContext,
	storage: Storage
): Store {
	const LIB = `Store--local-storage-v2`
	return SEC.xTry(`creating ${LIB}…`, ({SEC, logger}) => {
		logger.verbose(`[${LIB}] FYI storage keys = "${Object.values(StorageKey).join(', ')}"`)

		let state: Readonly<State> | undefined = undefined

		/////////////////////////////////////////////////

		function _on_error(err: Error) {
			logger.warn(`[${LIB}] Error while processing`, err)
			// TODO report to dispatcher
		}

		function _store_key_value(key: string, json: any): void {
			const value = stable_stringify(json)
			logger.log(`[${LIB}] 💾 writing "${key}"…`, { base: get_base_loose(json)})
			storage.setItem(key, value)
			logger.trace(`[${LIB}] 💾 written "${key}" ✔`, { snapshot: JSON.parse(value) })
		}

		function _optimized_store_key_value(key: string, json: any): Promise<void> {
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					try {
						resolve(_store_key_value(key, json))
					}
					catch (err) {
						reject(err)
					}
				}, OPTIMIZATION_DELAY_MS)
			})
		}

		const emitter = new EventEmitter.Typed<{}, 'change'>()

		/////////////////////////////////////////////////
		// bkp pipeline

		let bkp__current: Readonly<State> | undefined = _safe_read_parse_and_validate_from_storage<State>(storage, StorageKey.main, _on_error)
		let bkp__recent: Readonly<State> | undefined = _safe_read_parse_and_validate_from_storage<State>(storage, StorageKey.bkp_minor, _on_error)
		let bkp__older: Array<Readonly<JSONObject> | undefined> = [
			_safe_read_parse_and_validate_from_storage<any>(storage, StorageKey.bkp_major_old, _on_error),
			_safe_read_parse_and_validate_from_storage<any>(storage, StorageKey.bkp_major_older, _on_error),
		]

		// should allow any minor overwrite,
		// in case manual revert or cloud sync.
		async function _enqueue_in_bkp_pipeline(some_state?: Readonly<any>): Promise<boolean> {
			logger.trace(`[${LIB}] _enqueue_in_bkp_pipeline()`, { base: get_base_loose(some_state as any) })
			if (!some_state) return false
			assert(get_schema_version_loose(some_state) === SCHEMA_VERSION, `schema version === ${SCHEMA_VERSION} (current)!`)

			if (bkp__current
				&& get_semantic_difference(some_state, bkp__current, { assert_newer: false }) === SemanticDifference.none)
				return false

			bkp__recent = bkp__current
			bkp__current = some_state
			await _optimized_store_key_value(StorageKey.main, bkp__current)
			if (bkp__recent && get_schema_version_loose(bkp__recent) === SCHEMA_VERSION)
				await _optimized_store_key_value(StorageKey.bkp_minor, bkp__recent)

			return true
		}

		// EXPECTED: values are presented from the oldest to the newest!
		async function _enqueue_in_major_bkp_pipeline(legacy_state?: Readonly<any>): Promise<boolean> {
			logger.trace('_enqueue_in_major_bkp_pipeline()', { base: get_base_loose(legacy_state as any) })

			const most_recent_previous_major_version = bkp__older[0]
			const semantic_difference = get_semantic_difference(legacy_state, most_recent_previous_major_version)
			switch (semantic_difference) {
				case SemanticDifference.none:
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
			await _optimized_store_key_value(StorageKey.bkp_major_old, bkp__older[0])
			if (bkp__older[1]) await _optimized_store_key_value(StorageKey.bkp_major_older, bkp__older[1])

			return true
		}

		/////////////////////////////////////////////////

		// recover from potentially sparse bkp pipeline
		try {
			// XXX this code block is tricky, beware sync/async
			let promise: Promise<any> = Promise.resolve()

			// read and store everything needed in memory
			const most_recent_restored: any = [
					bkp__current || bkp__recent, // REM: recent can be younger than current if restored, but shouldn't use it
					...bkp__older,
				]
				.filter(s => !!s)
				.sort(compare_state)
				.pop()
			const raw_recovered_states_ordered: any[] = [
					bkp__current,
					bkp__recent,
					...bkp__older,
				]
				.filter(s => !!s)
				.sort(compare_state)

			// synchronous cleanup so that set() can work properly
			if (get_schema_version_loose(bkp__recent as any) < SCHEMA_VERSION) {
				bkp__recent = undefined
				storage.removeItem(StorageKey.bkp_minor)
			}

			if (most_recent_restored) {
				logger.trace(`[${LIB}] automigrating restored state…`, { base: get_base_loose(most_recent_restored) })
				const recovered_state = TBRPGState.migrate_to_latest(SEC, most_recent_restored)
				promise = promise.then(() => set(recovered_state))
			}

			console.log({ raw_recovered_states_ordered: raw_recovered_states_ordered.map(get_base_loose) })
			while(raw_recovered_states_ordered.length) {
				const some_state = raw_recovered_states_ordered.shift()
				if (get_schema_version_loose(some_state) < SCHEMA_VERSION)
					promise = promise.then(() => _enqueue_in_major_bkp_pipeline(some_state))
			}

			promise.catch(_on_error)
		}
		catch (err) {
			_on_error(err)
		}

		/////////////////////////////////////////////////

		function set(some_state: Readonly<State>): void {
			logger.trace('set()', { base: get_base_loose(some_state) })

			state = some_state

			_enqueue_in_bkp_pipeline(some_state)
				.then(had_change => { if (had_change) emitter.emit(EMITTER_EVT) })
				.catch(_on_error)
		}

		function get(): Readonly<State> {
			assert(state, `${LIB}.get(): never initialized`)
			return state
		}

		function on_dispatch(action: Readonly<Action>, eventual_state_hint?: Readonly<State>): void {
			logger.log(`[${LIB}] ⚡ action dispatched: ${action.type}`)
			assert(state || eventual_state_hint, `on_dispatch(): ${LIB} should be provided a hint or a previous state`)
			assert(!!eventual_state_hint, `on_dispatch(): ${LIB} (upper level architectural invariant) hint is mandatory in this store`)

			const previous_state = state
			state = eventual_state_hint || reduce_action(state!, action)
			if (state === previous_state) {
				logger.log(`[${LIB}] ⚡ action dispatched: ${action.type} => no state change.`)
				return
			}

			_enqueue_in_bkp_pipeline(state)
				.then(had_change => { if (had_change) emitter.emit(EMITTER_EVT) })
				.catch(_on_error)
		}

		function subscribe(debug_id: string, listener: () => void): () => void {
			emitter.on(EMITTER_EVT, listener)

			if (state) listener()

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
