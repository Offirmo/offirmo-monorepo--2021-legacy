import memoize_one from 'memoize-one'
import assert from 'tiny-invariant'
import { get_UTC_timestamp_ms } from '@offirmo/timestamps'

import { OMRContext } from '@oh-my-rpg/definitions'
import { State } from '@tbrpg/state'

import { LIB } from '../../consts'
import { LS_KEYS } from '../consts'
import { SoftExecutionContext } from '../../sec'
import { ACTIONS_SCHEMA_VERSION, Action, ActionStartGame, ActionType } from '../../actions'
import { CloudStore } from '../types'
import { PersistentStorage } from '../../types'


function get_persisted_pending_actions(SEC: SoftExecutionContext, local_storage: PersistentStorage): Action[] {
	try {
		return SEC.xTry(`creating ${LIB} offline-first cloud store`, ({}: OMRContext): Action[] => {
			let raw = local_storage.getItem(LS_KEYS.cloud_sync_pending_actions)
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
function persist_pending_actions(SEC: SoftExecutionContext, local_storage: PersistentStorage, pending_actions: Action[]): Action[] {
	return SEC.xTryCatch(`persisting ${LIB} offline-first cloud store`, ({}: OMRContext): void => {
		local_storage.setItem(
			LS_KEYS.cloud_sync_pending_actions,
			JSON.stringify(pending_actions),
		)
	})
}

interface SyncResult {

}


function create(
	SEC: SoftExecutionContext,
	local_storage: PersistentStorage,
	initial_state: State,
	set: (new_state: Readonly<State>) => void, // useful for the cloud store to overwrite the mem store
): CloudStore {
	return SEC.xTry(`creating ${LIB} offline-first cloud store`, ({SEC, logger}: OMRContext): CloudStore => {
		let is_cloud_store_ok = true // so far

		function get(): Readonly<State> | null {
			throw new Error('Unexpected cloud store get!')
		}

		const no_op_store: CloudStore = {
			set: () => {},
			dispatch: () => {},
			get,
		}

		if (initial_state.u_state.meta.persistence_id === null) {
			// intentionally not handled by cloud
			is_cloud_store_ok = false
		}

		let is_logged_in: boolean = false // so far
		const pending_actions = get_persisted_pending_actions(SEC, local_storage)
		let last_sync_result: Promise<SyncResult> // TODO

		function dispatch(action: Readonly<Action>): void {
			logger.trace(`Cloud store: was dispatched a new action: ${action.type}`, {
				action,
				pending_actions,
			})

			// snoop on some actions
			if (action.type === ActionType.on_logged_in_update) {
				is_logged_in = action.is_logged_in
			}

			// ignore some actions
			if (action.type === ActionType.update_to_now) {
				return
			}
			else if (action.type === ActionType.on_logged_in_update) {
				// don't persist but still continue executing
			}
			else {
				pending_actions.push(action)
				persist_pending_actions(SEC, local_storage, pending_actions)
			}

			if (is_logged_in) {
				// TODO not just sync from here, sync from server!
				// TODO system of re-arming
				throw new Error(`Cloud store: TODO sync!`)
			}
		}

		SEC.xTry(`restoring cloud store state from all bits`, ({logger}: OMRContext) => {
			if (initial_state.u_state.meta.persistence_id === undefined) {
				if (pending_actions.length === 0 && initial_state.u_state.revision === 0) {
					// new game freshly created
					const action: ActionStartGame = {
						v: ACTIONS_SCHEMA_VERSION,
						time: get_UTC_timestamp_ms(),
						type: ActionType.start_game,
						expected_sub_state_revisions: {},
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
					is_cloud_store_ok = false
					return
				}

				// looks ok...
			}

			// we have a remote persistence id.

			// we can't do anything for new, need to wait for the user to be logged in
		})

		// TODO check that we can write in LS
		// TODO send messages if data not synced

		// TODO sync!!
		return {
			set: () => { throw new Error('NIMP!!')},
			dispatch,
			get,
		}
	})
}

export {
	create,
}
