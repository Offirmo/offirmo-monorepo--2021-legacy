import memoize_one from 'memoize-one'

import { OMRContext } from '@oh-my-rpg/definitions'
import { State } from '@tbrpg/state'
import { Action } from '@tbrpg/interfaces'

import { LIB } from '../../consts'
import { SoftExecutionContext } from '../../sec'
import { reduce_action } from '../../utils/reduce-action'
import { InMemoryStore } from '../types'


function create(
	SEC: SoftExecutionContext,
	initial_state: State, // can be an old version to be salvaged, can be null...
	on_change: (s: Readonly<State>, debugId: string) => void,
): InMemoryStore {
	return SEC.xTry(`creating ${LIB} in-memory store`, ({SEC, logger}: OMRContext) => {
		let state: State = initial_state

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
				on_change_m(state, 'forced in-memory store set()')
			},
		}
	})
}

export {
	InMemoryStore,
	create,
}
