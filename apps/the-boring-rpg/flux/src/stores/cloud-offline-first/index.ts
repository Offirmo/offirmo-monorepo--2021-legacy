import memoize_one from 'memoize-one'
import assert from 'tiny-invariant'
import { get_UTC_timestamp_ms } from '@offirmo-private/timestamps'
import { OMRContext } from '@oh-my-rpg/definitions'
import {
	ENGINE_VERSION,
	State,
} from '@tbrpg/state'
import {
	Action,
	ActionStartGame,
	ActionType,
	SyncResult,
	TbrpgStorage,
	StorageKey,
} from '@tbrpg/interfaces'
import { Storage } from '@offirmo-private/ts-types'

import { LIB as ROOT_LIB } from '../../consts'
import { SoftExecutionContext } from '../../sec'
import { CloudStore } from '../types'
import stable_stringify from 'json-stable-stringify'
import { Synchronizer, create as create_synchronizer } from './synchonizer'
import { JsonRpcCaller, create as create_jsonrpc_fetch } from './json-rpc-fetch'

const LIB = `${ROOT_LIB}/CloudStore`

function get_persisted_pending_actions(SEC: SoftExecutionContext, local_storage: Storage): Action[] {
	try {
		return SEC.xTry(`retrieving persisted actions`, ({}: OMRContext): Action[] => {
			let raw = local_storage.getItem(StorageKey['cloud.pending-actions'])
			if (!raw) return []

			let pending_actions = JSON.parse(raw)
			assert(Array.isArray(pending_actions), 'get_persisted_pending_actions type check')

			return pending_actions
		})
	}
	catch {
		return []
	}
}
function persist_pending_actions(SEC: SoftExecutionContext, local_storage: Storage, pending_actions: Action[]): void {
	return SEC.xTryCatch(`persisting ${pending_actions.length} action(s)`, ({}: OMRContext): void => {
		local_storage.setItem(
			StorageKey['cloud.pending-actions'],
			stable_stringify(pending_actions),
		)
	})
}
function reset_pending_actions(SEC: SoftExecutionContext, local_storage: Storage): void {
	return persist_pending_actions(SEC, local_storage, [])
}


function create(
	SEC: SoftExecutionContext,
	local_storage: Storage,
	initial_state: Readonly<State>,
	set: (new_state: Readonly<State>) => void, // useful for the cloud store to overwrite the mem store
): CloudStore {
	return SEC.xTry(LIB, ({SEC: ROOT_SEC}: OMRContext): CloudStore => {

		function re_create(initial_state: Readonly<State>) {
			return ROOT_SEC.xTry(`re-creating store`, ({SEC, logger}: OMRContext): CloudStore => {
				let opt_out_reason: string | null = 'unknown!!' // so far

				function get(): Readonly<State> | null {
					throw new Error(`[${LIB}] Unexpected get()!`)
				}

				const no_op_store: CloudStore = {
					set: () => {},
					dispatch: () => {},
					get,
				}

				let is_logged_in: boolean = false // so far
				let pending_actions = get_persisted_pending_actions(SEC, local_storage)
				//let last_sync_result: Promise<SyncResult> // TODO

				let call_remote_procedure = create_jsonrpc_fetch({
					// TODO auto depending to env
					rpc_url: 'http://localhost:9000/tbrpg-rpc'
				})

				let _synchronizer: Synchronizer | null = null
				function get_synchronizer(): Synchronizer {
					if (!_synchronizer) {
						_synchronizer = create_synchronizer({
							SEC,
							call_remote_procedure,
							on_successful_sync: (result: SyncResult) => {
								const { engine_v, processed_up_to_time, authoritative_state } = result

								if (engine_v !== ENGINE_VERSION) {
									// TODO trigger a refresh to update
									opt_out_reason = 'We are outdated!'
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
						})
					}

					return _synchronizer
				}

				function dispatch(action: Readonly<Action>, eventual_state_hint?: Readonly<State>): void {
					assert(eventual_state_hint, 'state MUST be hinted!')
					const { time, ...debug } = action
					logger.log(`[${LIB}] ⚡ action dispatched: ${action.type}`, {
						//action: debug,
						//pending_actions: pending_actions.length,
					})

					// snoop on some actions
					if (action.type === ActionType.on_logged_in_refresh) {
						is_logged_in = action.is_logged_in
					}

					// ignore some actions
					if (action.type === ActionType.update_to_now) {
						return
					}
					else if (action.type === ActionType.on_logged_in_refresh) {
						// don't persist but still continue executing
					}
					else {
						pending_actions.push(action)
						persist_pending_actions(ROOT_SEC, local_storage, pending_actions)
					}

					if (is_logged_in && !opt_out_reason) {
						get_synchronizer().sync(pending_actions, eventual_state_hint!)
					}
				}

				SEC.xTryCatch(`restoring state from all bits`, ({logger}: OMRContext) => {

					if (initial_state.u_state.meta.persistence_id === null) {
						// intentionally not handled by cloud
						opt_out_reason = 'intentional (null)'
						logger.info(`[${LIB}]: existing game intentionally opted out.`)
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
								revision: initial_state.u_state.revision
							})

							// what else can we do?
							opt_out_reason = 'mismatching infos :('
							return
						}

						// looks ok...
						opt_out_reason = null
						logger.info(`[${LIB}] existing game, never persisted yet, some pending actions`, {
							'pending_actions.length': pending_actions.length,
							revision: initial_state.u_state.revision
						})
						return
					}

					// we have a remote persistence id.
					// we still need to wait for the user to be logged in
					opt_out_reason = null
					logger.info(`[${LIB}] cloud sync enabled!`, {
						'pending_actions.length': pending_actions.length,
						revision: initial_state.u_state.revision
					})
				})

				// TODO check that we can write in LS
				// TODO send messages if data not synced

				if (opt_out_reason !== null) {
					logger.info(`[${LIB}] opted out of cloud sync.`, { opt_out_reason })
					return no_op_store
				}

				return {
					set: () => { throw new Error('set() NIMP in direct cloud store!!')},
					dispatch,
					get,
				}
			})
		}

		let real_store = re_create(initial_state)

		let indirect_store = {
			set(new_state: Readonly<State>): void {
				reset_pending_actions(ROOT_SEC, local_storage)
				real_store = re_create(new_state)
			},
			dispatch(action: Readonly<Action>, eventual_state_hint?: Readonly<State>): void {
				return real_store.dispatch(action)
			},
			get(): Readonly<State> | null {
				return real_store.get()
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
