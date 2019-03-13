import memoize_one from 'memoize-one'
import assert from 'tiny-invariant'
import { get_UTC_timestamp_ms } from '@offirmo/timestamps'

import { OMRContext } from '@oh-my-rpg/definitions'
import { State } from '@tbrpg/state'

import { LIB } from '../../consts'
import { LS_KEYS } from '../consts'
import { SoftExecutionContext } from '../../sec'
import {Action, ActionStartGame, ActionType} from '../../actions'
import { reduce_action } from '../../utils/reduce-action'
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
	return SEC.xTry(`creating ${LIB} offline-first cloud store`, ({SEC, logger}: OMRContext) => {
		function get(): void {
			throw new Error('Unexpected cloud store get!')
		}

		if (initial_state.u_state.meta.persistence_id === null) {
			// intentionally not handled by cloud
			return {
				dispatch: () => {},
				get,
			}
		}

		let is_logged_in: boolean = false // so far
		const pending_actions = get_persisted_pending_actions(SEC, local_storage)
		let last_sync_result: Promise<SyncResult>

		function dispatch(action: Readonly<Action>): void {
			logger.log('Cloud store: was dispatched a new action', {
				action,
				pending_actions,
			})

			// snoop on some actions
			if (action.type === ActionType.on_logged_in_update) {
				is_logged_in = action.is_logged_in
			}
			pending_actions.push(action)
			persist_pending_actions(SEC, local_storage, pending_actions)
			if (is_logged_in) {
				throw new Error('TODO sync!')
			}
		}

		SEC.xTry(`restoring cloud store state from all bits`, ({logger}: OMRContext) => {
			if (initial_state.u_state.meta.persistence_id === undefined) {
				if (pending_actions.length && pending_actions.slice(-1)[0].expected_state_revision === initial_state.u_state.revision) {
					// all good, old game still pending log in
					return
				}

				if (pending_actions.length === 0 && initial_state.u_state.revision === 0) {
					// new game freshly created
					const action: ActionStartGame = {
						time: get_UTC_timestamp_ms(),
						expected_state_revision: 0,
						type: ActionType.start_game,
						seed: initial_state.u_state.prng.seed,
					}
					dispatch(action)
					return
				}

				// something is wrong, state and pending actions are out of sync
				console.log({pending_actions, r: initial_state.u_state.revision})
				throw new Error('NIMP handling cloud store not yet persisted but out of sync!!')
			}

			// we have a remote persistence id
			// let's sync
			throw new Error('NIMP cloud sync')
		})

		// TODO check that we can write in LS

		// TODO sync!!
		return {
			dispatch,
			get,
		}
	})
}

export {
	create,
}
