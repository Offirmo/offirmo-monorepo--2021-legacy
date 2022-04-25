import assert from 'tiny-invariant'
import { Immutable } from '@offirmo-private/ts-types'
import { finalize_action_if_needed } from '@offirmo-private/state-utils'

import { State } from '../types'
import { Action, ActionType } from './types'
import {
	create,
	randomize_post_create, reduceⵧdefeat_BBEG, reduceⵧdefeat_mook,

	reduceⵧdo_quest,
	reduceⵧeat_food,
	reduceⵧexplore,
	reduceⵧguild_rank_up,
	reduceⵧromance,
	reduceⵧtrain,

	reduceⵧupdate_to_now,
} from '../reducers'

/////////////////////

export function reduce_action(state: Immutable<State>, action: Immutable<Action>): Immutable<State> {
	action = finalize_action_if_needed(action, state)

	switch(action.type) {
		/////////////////////

		case ActionType.explore:
			return reduceⵧexplore(state, action)
		case ActionType.train:
			return reduceⵧtrain(state, action)
		case ActionType.quest:
			return reduceⵧdo_quest(state, action)
		case ActionType.rank_upⵧguild:
			return reduceⵧguild_rank_up(state, action)
		case ActionType.romance:
			return reduceⵧromance(state, action)
		case ActionType.eat_delicious_food:
			return reduceⵧeat_food(state, action)
		case ActionType.defeat_mook:
			return reduceⵧdefeat_mook(state, action)
		case ActionType.defeat_BBEG:
			return reduceⵧdefeat_BBEG(state, action)

		/////////////////////

		case ActionType.update_to_now:
			return reduceⵧupdate_to_now(state, action.time)
		case ActionType.set:
			return action.state || randomize_post_create(create())
		case ActionType.hack:
			return action.custom_reducer(
				reduceⵧupdate_to_now(state, action.time) // auto update-to-now for convenience
			)

		/////////////////////

		default:
			// @ts-expect-error TS2339
			throw new Error(`reduce_action() unrecognized type "${action?.type}!`)
	}
}
