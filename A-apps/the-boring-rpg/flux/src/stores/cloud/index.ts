import assert from 'tiny-invariant'
import EventEmitter from 'emittery'
import stable_stringify from 'json-stable-stringify'
import { Immutable, Storage } from '@offirmo-private/ts-types'
import {
	get_schema_version_loose,
	get_base_loose,
	get_semantic_difference,
	SemanticDifference,
	compare as compare_state, has_versioned_schema, get_revision_loose,
} from '@offirmo-private/state-utils'
import { asap_but_not_synchronous, schedule_when_idle_but_not_too_far } from '@offirmo-private/async-utils'

import * as TBRPGState from '@tbrpg/state'
import { State, SCHEMA_VERSION } from '@tbrpg/state'
import { Action, ActionType, create_action__set } from '@tbrpg/interfaces'
import { Endpoint, fetch_oa, get_api_base_url } from '@online-adventur.es/functions-interface'

import { OMRSoftExecutionContext } from '../../sec'
import { Store, Dispatcher } from '../../types'
import { reduce_action } from '../../utils/reduce-action'
import try_or_fallback from '../../utils/try_or_fallback'
import {StorageKey} from '../local-storage'
import { overrideHook } from '@offirmo/universal-debug-api-placeholder'

/////////////////////////////////////////////////

const EMITTER_EVT = 'change'

function get_cloud_key(state: Immutable<State> | undefined): string {
	const slot_id = state?.u_state.meta.slot_id

	return 'the-boring-rpg.savegame' + (slot_id ? `#${slot_id}` : '')
}


/////////////////////////////////////////////////

export function create(
	SEC: OMRSoftExecutionContext,
	storage: Storage,
	dispatcher?: Dispatcher,
): Store {
	const LIB = `Store--cloud`
	return SEC.xTry(`creating ${LIB}…`, ({SEC, logger, CHANNEL}) => {
		logger.trace(`${LIB}.create()…`)

		const is_enabled = overrideHook('cloud_save_enabled', false)
		logger.verbose(`[${LIB}] FYI API URL = "${get_api_base_url(CHANNEL as any)}"`)

		let state: Immutable<State> | undefined = undefined

		/////////////////////////////////////////////////

		function _on_error(err: Error) {
			logger.warn(`[${LIB}] Error while processing`, err)
			// TODO report to dispatcher
		}

		/////////////////////////////////////////////////

		const emitter = new EventEmitter.Typed<{}, 'change'>()

		/////////////////////////////////////////////////
		let is_logged_in = false // AFAWK
		let last_known_cloud_state: Immutable<State> | undefined = undefined
		let last_cloud_sync = new Date()

		// TODO debounce / throttle
		// TODO handle offline
		// TODO retries
		// TODO spontaneous periodic sync
		async function _sync_with_cloud(some_state: Immutable<State>): Promise<void> {
			const cloud_key = get_cloud_key(some_state)
			const semantic_difference = get_semantic_difference(some_state, last_known_cloud_state)
			const now = new Date()
			const elapsed_time_since_last_sync = +now - +last_cloud_sync

			logger.trace(`[${LIB}] _sync_with_cloud()`, {
				candidate_rev: get_revision_loose(some_state as any),
				current_rev: get_revision_loose(state as any),
				cloud_key,
				semantic_difference,
				elapsed_time_since_last_sync,
			})

			if (!is_enabled) {
				logger.log(`${LIB} TODO enable sync with cloud!`)
				return
			}

			const is_worth_syncing =
				elapsed_time_since_last_sync >= 10 * 60 * 1000
				|| semantic_difference === SemanticDifference.minor
				|| semantic_difference === SemanticDifference.major
			if (!is_worth_syncing) {
				logger.trace(`${LIB} not worth syncing for now ✔`)
				return
			}

			// TODO don't re-send if already in-flight? or sth
			const result = await fetch_oa<State, State>({
				SEC: SEC as any,
				method: 'PATCH',
				url: Endpoint['key-value'] + '/' + cloud_key,
				body: some_state
			})
			// TODO dispatch side channel data
			logger.warn(`[${LIB}] _sync_with_cloud() TODO handle result`, result)
		}

		async function recover_from_cloud() {
			logger.verbose(`${LIB} initiating cloud restoration (will take time)…`)
			fetch_oa<void, State>({
				SEC: SEC as any,
				method: 'GET',
				url: Endpoint['key-value'] + '/' + get_cloud_key(state),
			})
				.then((response) => {
					logger.trace(`${LIB} got initial cloud data`, { response })
					// TODO dispatch side channel data
					// TODO dispatch authoritative data
				})
				.catch(_on_error)
				// TODO periodically retry
		}

		/////////////////////////////////////////////////

		logger.trace(`[${LIB}] store is empty, waiting for an init+being logged in before triggering a sync.`)

		/////////////////////////////////////////////////

		function set(new_state: Immutable<State>): void {
			const semantic_difference = get_semantic_difference(new_state, state, { assert_newer: false })
			logger.trace(`${LIB}.set()`, { ...get_base_loose(new_state), semantic_difference })

			if (!state) {
				logger.trace(`${LIB}.set(): init ✔`)
			}
			else if (semantic_difference === SemanticDifference.none) {
				logger.trace(`${LIB}.set(): no semantic change ✔`)
				return
			}

			state = new_state
			emitter.emit(EMITTER_EVT)

			if (is_logged_in) {
				_sync_with_cloud(state)
					.catch(_on_error)
			}
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

			// snoop on actions
			switch(action.type) {
				case ActionType.on_logged_in_refresh: {
					if (is_logged_in !== action.is_logged_in) {
						is_logged_in = action.is_logged_in
						logger.verbose(`${LIB} logged in status snooped:`, { is_logged_in })
						if (is_logged_in) {
							// TODO force a sync
						}
					}
					break
				}
				default:
					break
			}

			if (semantic_difference === SemanticDifference.none) {
				return
			}

			emitter.emit(EMITTER_EVT)

			if (!is_logged_in) {
				logger.trace(`[${LIB}] not logged in, ignoring for now.`)
			}
			else {
				_sync_with_cloud(state)
					.catch(_on_error)
			}
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
