import { Immutable} from '@offirmo-private/ts-types'

import {
	State as ProgressState,
	AchievementDefinition,
	AchievementStatus,
	on_achieved,
	get_last_known_achievement_status,
} from '@tbrpg/state--progress'
import {
	enqueue as enqueueEngagement,
	EngagementType,
} from '@oh-my-rpg/state-engagement'

import { State, UState } from '../../types'

import ACHIEVEMENT_DEFINITIONS from '../../data/achievements'
import {EngagementKey} from '../../data/engagement'

/////////////////////

function _refresh_achievements(state: Immutable<State>): Immutable<State> {
	let { u_state } = state
	let { progress, engagement } = u_state
	let has_change = false

	ACHIEVEMENT_DEFINITIONS.forEach((definition: AchievementDefinition<UState>) => {
		const { icon, name } = definition

		const last_known_status = get_last_known_achievement_status(progress, name)
		if (last_known_status === AchievementStatus.unlocked) return // can't change, already best

		const current_status = definition.get_status(u_state)
		if (last_known_status === current_status) return

		has_change = true
		progress = on_achieved(progress, name, current_status)

		if (current_status === AchievementStatus.unlocked) {
			// tell the user
			engagement = enqueueEngagement(engagement,
				{
					type: EngagementType.aside,
					key: EngagementKey['achievement-unlocked'],
				},
				{
					semantic_level: 'success',
					auto_dismiss_delay_ms: 7_000, // TODO magic number!!
					icon,
					name,
				})
		}
	})

	if (!has_change)
		return state

	return {
		...state,
		u_state: {
			...u_state,
			progress,
			engagement,
		},
	}
}

export {
	_refresh_achievements,
}
