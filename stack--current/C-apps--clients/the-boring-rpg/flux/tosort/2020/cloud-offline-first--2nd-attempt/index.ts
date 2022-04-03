import assert from 'tiny-invariant'
import stable_stringify from 'json-stable-stringify'
import { get_UTC_timestamp_ms } from '@offirmo-private/timestamps'
import tiny_singleton from '@offirmo/tiny-singleton'
import { overrideHook } from '@offirmo/universal-debug-api-placeholder'
import { Storage } from '@offirmo-private/ts-types'
import { ReleaseChannel, get_api_base_url, Endpoint } from '@online-adventur.es/functions-interface'
import { NUMERIC_VERSION, State } from '@tbrpg/state'
import {
	Action,
	/*ActionStartGame,
	ActionType,
	SyncResult,
	StorageKey,*/
} from '@tbrpg/interfaces'

import { LIB as ROOT_LIB } from '../../consts'
import { OMRSoftExecutionContext } from '../../sec'
import { CloudStore } from '../types'
import logger from './logger'

const LIB = `${ROOT_LIB}/CloudStore`


function create(
	SEC: OMRSoftExecutionContext,
	local_storage: Storage,
	initial_state: Readonly<State>,
	set: (new_state: Readonly<State>) => void, // useful for the cloud store to overwrite the mem store
): CloudStore {
	return SEC.xTry(LIB, ({SEC: ROOT_SEC}): CloudStore => {

		/*
		function re_create_cloud_store(initial_state: Readonly<State>) {
			return ROOT_SEC.xTry('re-creating cloud store', ({ SEC }): CloudStore => {
				let opt_out_reason: string | null = 'unknown!!' // so far
				let is_logged_in: boolean = false // so far
				//let last_sync_result: Promise<SyncResult> // TODO

				const rpc_url = get_json_rpc_url(SEC)
				const call_json_rpc = create_jsonrpc_client({
					rpc_url,
					//method: 'PATCH',
				})
				logger.info('re-creating the cloud store…', { rpc_url })

				const get_synchronizer = tiny_singleton(() => create_synchronizer({
					SEC,
					call_remote_procedure: call_json_rpc,
					on_successful_sync: (result: SyncResult) => {
						const { common: { numver }, processed_up_to_time, authoritative_state } = result

						if (numver !== NUMERIC_VERSION) {
							// TODO trigger a refresh to update
							// TODO stop the sync?
							// TODO several places, take care!
							opt_out('We are outdated!')
							return
						}

						pending_actions = pending_actions.filter(action => action.time > processed_up_to_time)
						persist_pending_actions(ROOT_SEC, local_storage, pending_actions)

						if (authoritative_state) {
							set(authoritative_state)
						}
					},
					initial_pending_actions: pending_actions,
					initial_state,
				}))

				function opt_out(reason: string) {
					opt_out_reason = reason
					logger.info(`[${LIB}] opted out of cloud sync.`, { reason })
				}

				function set(authoritative_state: Readonly<State>) {
					// TODO pushback!
					throw new Error(`[${LIB}] cloud store set() NIMP!`)
				}

				function dispatch(action: Readonly<Action>, eventual_state_hint?: Readonly<State>): void {
					assert(eventual_state_hint, 'state MUST be hinted!')
					if (opt_out_reason) return

					const { time, ...debug } = action
					const is_ignored_action =
						action.type === ActionType.update_to_now
						|| action.type === ActionType.on_start_session

					logger[is_ignored_action ? 'silly' : 'log'](`[${LIB}] ⚡ action dispatched: ${action.type}`, {
						//action: debug,
						//pending_actions: pending_actions.length,
					})

					// snoop on some actions
					if (action.type === ActionType.on_logged_in_refresh) {
						is_logged_in = action.is_logged_in
						logger.info('snooped the logged-in message!', { action })
					}

					// ignore some actions
					if (is_ignored_action) {
						return
					}
					else if (action.type === ActionType.on_logged_in_refresh) {
						// don't persist but still continue executing
					}
					else {
						pending_actions.push(action)
						persist_pending_actions(ROOT_SEC, local_storage, pending_actions)
					}

					if (is_logged_in) {
						get_synchronizer().sync(pending_actions, eventual_state_hint!)
					}
				}

				SEC.xTryCatch('restoring state from all bits', () => {

					if (!overrideHook('cloud_sync_enabled', false)) {
						opt_out('manually-disabled')
						return
					}

					if (initial_state.u_state.meta.persistence_id === undefined) {
						if (pending_actions.length === 0 && initial_state.u_state.revision === 0) {
							// new game freshly created
							opt_out_reason = null
							logger.info(`[${LIB}] new game, never persisted yet, could be in the future.`)

							const action: ActionStartGame = {
								time: get_UTC_timestamp_ms(),
								type: ActionType.start_game,
								expected_revisions: {},
								seed: initial_state.u_state.prng.seed,
							}
							dispatch(action)
							return
						}

						// how to check if state and pending actions match?
						if (pending_actions.length !== initial_state.u_state.revision) {
							// something is wrong, state and pending actions are out of sync
							console.log({pending_actions})
							logger.error(`${LIB} cloud store: never persisted yet but out of sync!`, {
								'pending_actions.length': pending_actions.length,
								revision: initial_state.u_state.revision,
							})

							// what else can we do?
							opt_out('mismatching infos :(')
							return
						}

						// looks ok...
						opt_out_reason = null
						logger.info(`[${LIB}] existing game, never persisted yet, some pending actions`, {
							'pending_actions.length': pending_actions.length,
							revision: initial_state.u_state.revision,
						})
						return
					}

					// we have a remote persistence id and no reason to opt out
					// we still need to wait for the user to be logged in
					opt_out_reason = null
					logger.info(`eligible to cloud sync (will wait for login)`, {
						'pending_actions.length': pending_actions.length,
						revision: initial_state.u_state.revision,
					})
					setTimeout(() => {
						if (!is_logged_in)
							logger.info('cloud store: still not logged in, no sync will happen until then.')
					}, 5000)
				})

				// TODO check that we can write in LS
				// TODO send messages if data not synced

				return {
					set,
					dispatch,
					get: forbidden_get,
				}
			})
		}

		let real_cloud_store = re_create_cloud_store(initial_state)
*/
		const indirect_store = {
			set(new_state: Readonly<State>): void {
				// XXX TODO check
				//real_cloud_store = re_create_cloud_store(new_state)
			},
			dispatch(action: Readonly<Action>, eventual_state_hint?: Readonly<State>): void {
				//return real_cloud_store.dispatch(action, eventual_state_hint)
			},
			get(): Readonly<State> | null {
				//return real_cloud_store.get()
				return null
			},
		}

		return indirect_store
	})
}

export default create
export {
	CloudStore,
	create,
}
