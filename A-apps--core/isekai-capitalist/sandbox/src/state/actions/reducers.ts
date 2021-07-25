import assert from 'tiny-invariant'
import { Immutable } from '@offirmo-private/ts-types'

import { State } from '../types'
import { Action, ActionType } from './types'
import {
	create,
	randomize_post_create,
	reduceⵧexplore,
	reduceⵧupdate_to_now,
} from '../reducers'

/////////////////////



export function reduce_action(state: Immutable<State>, action: Immutable<Action>): Immutable<State> {
	assert(action.time > 0, `reduce_action() time should be >0`)

	switch(action.type) {
		/////////////////////

		case ActionType.explore:
			return reduceⵧexplore(state, action)

		/////////////////////

		case ActionType.set:
			return action.state || randomize_post_create(create())

		case ActionType.hack:
			return action.custom_reducer(
				reduceⵧupdate_to_now( // auto update-to-now for convenience
					state,
					action.time
				)
			)

		/////////////////////

		default:
			// @ts-expect-error TS2339
			throw new Error(`reduce_action() unrecognized type "${action?.type}!`)
	}
}
