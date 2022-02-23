import assert from 'tiny-invariant'
import EventEmitter from 'emittery'
import debounce from 'lodash/debounce'
import stable_stringify from 'json-stable-stringify'
import { normalizeError } from '@offirmo/error-utils'
import { overrideHook } from '@offirmo/universal-debug-api-placeholder'
import { TimestampUTCMs, get_UTC_timestamp_ms } from '@offirmo-private/timestamps'
import { Immutable, Storage } from '@offirmo-private/ts-types'
import {
	fluid_select,
	get_schema_version_loose,
	get_base_loose,
	get_revision_loose,
	UNCLEAR_get_difference__full,
} from '@offirmo-private/state-utils'
import { getGlobalThis } from '@offirmo/globalthis-ponyfill'

import * as TBRPGState from '@tbrpg/state'
import { State, SCHEMA_VERSION, NUMERIC_VERSION } from '@tbrpg/state'
import { Action, ActionType, create_action__set } from '@tbrpg/interfaces'
import { Endpoint, fetch_oa, get_api_base_url } from '@online-adventur.es/api-client'

import { OMRSoftExecutionContext } from '../../sec'
import { Store, Dispatcher } from '../../types'
import { reduce_action } from '../../utils/reduce-action'

/////////////////////////////////////////////////

const EMITTER_EVT = 'change'

function get_cloud_key(state: Immutable<State> | undefined): string {
	const slot_id = state?.u_state.meta.slot_id

	return 'the-boring-rpg.savegame' + (slot_id ? `#${slot_id}` : '')
}

/////////////////////////////////////////////////

interface CloudSyncState {
	last_successful_sync_tms: TimestampUTCMs,
	error_count: number,
}

function is_online(state: Immutable<CloudSyncState>): boolean {
	if (!(getGlobalThis().navigator?.onLine ?? true))
		return false

	return true
}

function is_healthy(state: Immutable<CloudSyncState>): boolean {
	if (state.error_count > 5)
		return false

	return true
}

// TODO evaluate https://github.com/vercel/async-sema

function has_recent_sync(state: Immutable<CloudSyncState>): boolean {
	const now = get_UTC_timestamp_ms()
	if (now - state.last_successful_sync_tms >= 30 * 60 * 1000)
		return false

	return true
}

function on_network_error(state: Immutable<CloudSyncState>, err: Error): Immutable<CloudSyncState> {
	// TODO snoop offline?

	return {
		...state,
		error_count: state.error_count + 1,
	}
}

function on_sync_result(state: Immutable<CloudSyncState>): Immutable<CloudSyncState> {
	return {
		...state,
		last_successful_sync_tms: get_UTC_timestamp_ms(),
		error_count: 0,
	}
}

/////////////////////////////////////////////////

export function create(
	SEC: OMRSoftExecutionContext,
	storage: Storage,
	migrate_to_latest: (SEC: OMRSoftExecutionContext, legacy: Immutable<any>, hints?: Immutable<any>) => Immutable<State>,
	dispatcher?: Dispatcher,
): Store {
	const LIB = `🗃ⵧ🔴cloud`
	return SEC.xTry(`creating ${LIB}…`, ({SEC, logger, CHANNEL}) => {
		logger.trace(`[${LIB}].create()…`)

		let cloud_sync_state: CloudSyncState = {
			last_successful_sync_tms: 0,
			error_count: 0,
		}
		logger.verbose(`[${LIB}] FYI API URL = "${get_api_base_url(CHANNEL as any)}"`)

		/////////////////////////////////////////////////

		let state: Immutable<State> | undefined = undefined

		/////////////////////////////////////////////////

		function _on_error(err: Error) {
			logger.warn(`[${LIB}] Error while processing`, err)
			// TODO report to dispatcher
		}

		/////////////////////////////////////////////////

		const emitter = new EventEmitter<{ change: undefined }>()

		/////////////////////////////////////////////////
		let is_enabled = overrideHook('cloud_save_enabled', false)
		let is_logged_in = false // AFAWK
		let last_known_cloud_state: Immutable<State> | undefined = undefined
		let is_sync_in_flight = false
		let update_suggested = false
		let warned_unhealthy = false

		function should_sync(): boolean {
			const _is_initialised = !!state
			const _is_online = is_online(cloud_sync_state)
			const _is_healthy = is_healthy(cloud_sync_state)
			const _has_valuable_difference = state && (!last_known_cloud_state || fluid_select(state).has_valuable_difference_with(last_known_cloud_state))
			const _has_recent_sync = has_recent_sync(cloud_sync_state)
			const _should_sync = is_enabled
				&& _is_initialised
				&& _is_online
				&& _is_healthy
				&& (_has_valuable_difference || !_has_recent_sync)
				&& !is_sync_in_flight
			logger.trace(`[${LIB}] thinking about a sync… Is it appropriate?`, {
				should_sync: _should_sync,
				details: {
					is_enabled,
					_is_initialised,
					_is_online,
					_is_healthy,
					candidate_rev: get_revision_loose(state!),
					last_known_cloud_rev: get_revision_loose(last_known_cloud_state!),
					_has_valuable_difference,
					_has_recent_sync,
					is_sync_in_flight,
				},
			})

			if (!_is_healthy) {
				// To avoid polluting the logs every tick
				logger[warned_unhealthy ? 'log' : 'warn'](`[${LIB}] no longer syncing with the cloud, too many errors!`)
				warned_unhealthy = true
			}

			return _should_sync
		}

		// TODO handle offline
		// TODO retries?
		// TODO spontaneous periodic sync -> for now we rely on periodic "time" sets
		async function _NON_DEBOUNCED_sync_with_cloud(): Promise<void> {
			logger.warn(`[${LIB}] [FYI debounce waking up or direct call]`) // temp for debug, exiting group

			const cloud_key = get_cloud_key(state)
			// since this func is debounced, re-evaluate the conditions that may have changed
			const _should_sync = should_sync()

			logger.trace(`[${LIB}] _sync_with_cloud() [actual]…`, { _should_sync })

			if (!_should_sync) {
				logger.trace(`[${LIB}] skipping cloud sync: there are reasons not to.`)
				return
			}

			try {
				logger.info(`[${LIB}] _sync_with_cloud() initiating call…`)
				is_sync_in_flight = true
				const revision_on_last_sync_start = get_revision_loose(state!)
				const result = await fetch_oa<State, State>({
					SEC: SEC as any,
					method: 'PATCH',
					url: Endpoint['key-value'] + '/' + cloud_key,
					body: state
				})
				is_sync_in_flight = false
				cloud_sync_state = on_sync_result(cloud_sync_state)
				logger.info(`[${LIB}] _sync_with_cloud() got result:`, result)

				try {
					const { data, side } = result

					if (side.app) {
						assert(side.app.app_id === 'tbrpg', `cloud response app_id ${side.app.app_id} should === tbrpg`)
						if (side.app.NUMERIC_VERSION > NUMERIC_VERSION) {
							if (!update_suggested) {
								update_suggested = true

								const current_version = NUMERIC_VERSION
								const new_version = side.app.NUMERIC_VERSION
								const is_major = new_version < 1
									? (new_version - current_version) >= 0.01
									: (new_version - current_version) >= 1

								logger.warn(`[${ LIB }] outdated client! TODO suggest update`, {
									current_version,
									new_version,
									is_major,
								})

								// bc we are using a stable API endpoint, updates should not be really needed

								// TODO find an isomorphic way to suggest an update
								/*if (getGlobalThis().confirm) {
									const should_reload = getGlobalThis().confirm(
										`A ${is_major ? 'major ' : ''}game update is available, do you want to update now?`
									)
									if (should_reload) {
										execute_from_top(() => 	window.location.reload())
									}
								}*/
							}
						} else if (side.app.latest_news.length) {
							// TODO handle
						}
					}

					last_known_cloud_state = data
					if (get_revision_loose(state!) !== revision_on_last_sync_start) {
						// the local state changed since we initiated the sync
						// this result is outdated.
						// we need to re-attempt to sync asap
						_schedule_sync_with_cloud_if_needed_and_possible()
						return
					}

					// sync result should always be >= by design
					logger.trace(`[${LIB}] _sync_with_cloud() got savegame:`, {
						...fluid_select(state!).get_debug_infos_about_comparison_with(last_known_cloud_state, 'local', 'cloud'),
						semantic_difference: UNCLEAR_get_difference__full(last_known_cloud_state, state),
					})

					let cloud_schema_version = get_schema_version_loose(last_known_cloud_state)
					if (cloud_schema_version > SCHEMA_VERSION) {
						// TODO trigger an update
						assert(cloud_schema_version <= SCHEMA_VERSION, `[${LIB}] schema version of cloud state should match`)
					}
					if (cloud_schema_version < SCHEMA_VERSION) {
						// either:
						// - this is a new client (reinstall?) and the existing cloud save is old
						// - a legacy client (ex. mobile app not up to date due to offline or store validation) is still active with higher involvement
						// no worries, we can migrate it
						last_known_cloud_state = migrate_to_latest(SEC, last_known_cloud_state)
						cloud_schema_version = get_schema_version_loose(last_known_cloud_state)
						assert(cloud_schema_version === SCHEMA_VERSION, `[${LIB}] schema version of cloud state should match after migration`)
					}
					// schema versions now match

					const has_valuable_difference = !state || fluid_select(last_known_cloud_state).has_valuable_difference_with(state)
					if (has_valuable_difference) {
						if (dispatcher) {
							dispatcher.dispatch(create_action__set(TBRPGState.update_to_now(last_known_cloud_state)))
						}
					}
					else {
						// irrelevant diff, don't care
						logger.verbose(`[${LIB}] _sync_with_cloud() = we are in sync with the cloud ✔`)
					}
				}
				catch (_err) {
					const err = normalizeError(_err)
					_on_error(err)
					/* swallow */
				}
			}
			catch (_err) {
				const err = normalizeError(_err)
				is_sync_in_flight = false
				cloud_sync_state = on_network_error(cloud_sync_state, err)
			}
		}

		const _DEBOUNCED_sync_with_cloud: () => void = debounce(() => {
			_NON_DEBOUNCED_sync_with_cloud()
				.catch(_on_error)
		}, 5000, {
			maxWait: 30_000,
			leading: true,
			trailing: true,
		})

		function _schedule_sync_with_cloud_if_needed_and_possible(): void {
			logger.trace(`[${LIB}] thinking about scheduling a sync…`)

			const _should_sync = should_sync()
			if (!_should_sync) {
				logger.trace(`[${LIB}] skipping scheduling a cloud sync: there are no reasons to or reasons not to.`)
				return
			}

			logger.info(`[${LIB}] scheduling a cloud sync… (debounced)`)
			_DEBOUNCED_sync_with_cloud()
		}

		/////////////////////////////////////////////////

		logger.trace(`[${LIB}] store is empty, waiting for an init+being logged in before triggering a sync.`)

		if (getGlobalThis().addEventListener) {
			getGlobalThis().addEventListener('online', () => {
				if (state && is_logged_in && !has_recent_sync(cloud_sync_state))
					_schedule_sync_with_cloud_if_needed_and_possible()
			})
		}

		/////////////////////////////////////////////////

		function set(new_state: Immutable<State>): void {
			const has_valuable_difference = !state || fluid_select(new_state).has_valuable_difference_with(state)
			logger.trace(`[${LIB}].set()`, {
				'new': get_base_loose(new_state),
				existing: get_base_loose(state as any),
				has_valuable_difference,
			})

			if (!state) {
				logger.trace(`[${LIB}].set(): init ✔`)
			}
			else if (!has_valuable_difference) {
				logger.trace(`[${LIB}].set(): no valuable change ✔`)
				return
			}

			state = new_state
			emitter.emit(EMITTER_EVT)

			if (!is_logged_in) return

			_schedule_sync_with_cloud_if_needed_and_possible()
		}

		function get(): Immutable<State> {
			assert(state, `[${LIB}].get(): never initialized`)

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

			// snoop on some actions
			switch(action.type) {
				case ActionType.on_logged_in_refresh: {
					if (is_logged_in !== action.is_logged_in) {
						is_logged_in = action.is_logged_in
						logger.verbose(`[${LIB}] new logged-in status snooped:`, { is_logged_in })
						if (is_logged_in) {
							// not using the debounced one, this is urgent
							_NON_DEBOUNCED_sync_with_cloud()
								.catch(_on_error)
						}
					}
					break
				}
				default:
					break
			}

			if (has_valuable_difference) {
				emitter.emit(EMITTER_EVT)
			}

			// whether or not the state passed to us is valuable, we take the opportunity to check if a sync is needed
			// TODO review into a dedicated periodic check?

			if (!is_logged_in) {
				logger.trace(`[${LIB}] still not logged in, no sync for now.`)
				return
			}

			_schedule_sync_with_cloud_if_needed_and_possible()
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
