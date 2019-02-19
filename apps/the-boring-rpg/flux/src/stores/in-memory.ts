import memoize_one from 'memoize-one'

import { State } from '@tbrpg/state'
import * as TBRPGState from '@tbrpg/state'
import * as PRNGState from '@oh-my-rpg/state-prng'

import { LIB } from '../consts'
import { SoftExecutionContext } from '../sec'
import { Action } from '../actions'
import { reduce_action } from '../utils/reduce-action'
import { InMemoryStore } from './types'


function create(
	SEC: SoftExecutionContext,
	initial: any, // can be an old version to be salvaged, can be null...
	on_change: (s: Readonly<State>, debugId: string) => void,
): InMemoryStore {
	return SEC.xTry(`creating ${LIB} in-memory store`, ({SEC, logger}: any) => {
		let state: State = initial

		SEC.xTry('auto creating/migrating', ({SEC, logger}: any) => {
			// need this check due to some serializations returning {} for empty
			const was_empty_state = !state || Object.keys(state).length === 0

			state = was_empty_state
				? TBRPGState.reseed(TBRPGState.create(SEC))
				: TBRPGState.migrate_to_latest(SEC, state)

			if (was_empty_state) {
				logger.verbose('Clean savegame created from scratch:', {state})
			} else {
				logger.trace('migrated state:', {state})
			}

			// re-seed outside of the unit test path
			if (state.u_state.prng.seed === PRNGState.DEFAULT_SEED) {
				// TODO still needed ? Report as error to check.
				state = TBRPGState.reseed(state)
				logger.warn('re-seeding that shouldn’t be needed!')
			}

			on_change(state, 'migration')
		})

		const on_change_m = memoize_one(on_change)
		function dispatch(action: Readonly<Action>): void {
			state = reduce_action(state, action)
			on_change_m(state, action.type)
		}

		return {
			dispatch,
			get: () => state,
			set: (new_state: Readonly<State>) => {
				state = new_state
				on_change_m(state, 'forced set()')
			},
		}
	})
}

export {
	InMemoryStore,
	create,
}
