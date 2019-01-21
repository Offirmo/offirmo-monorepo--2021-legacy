import {
	State as ProgressState,
	AchievementDefinition,
	AchievementStatus,
	on_achieved,
	get_last_known_achievement_status,
} from '@oh-my-rpg/state-progress'
import {
	enqueue as enqueueEngagement,
	EngagementType,
} from '@oh-my-rpg/state-engagement'

import { State, UState } from '../../../types'

import ACHIEVEMENT_DEFINITIONS from '../../../data/achievements'
import {EngagementKey} from "../../../engagement";

/////////////////////

function _refresh_achievements(state: Readonly<State>): Readonly<State> {
	let { u_state } = state
	let has_change = false
	let progress: ProgressState = {
		...u_state.progress
	}

	ACHIEVEMENT_DEFINITIONS.forEach((definition: AchievementDefinition<UState>) => {
		const { icon, name } = definition
		const last_known_status = get_last_known_achievement_status(progress, name)

		// Don't remove an achievement
		// if it was a bug, it should be revoked in a migration
		if (last_known_status === AchievementStatus.unlocked) return

		const current_status = definition.get_status(u_state)

		// nothing to do if no change
		if (last_known_status === current_status) return

		has_change = true
		progress = on_achieved(progress, name, current_status)
		// need to tell the user?
		if (current_status === AchievementStatus.unlocked) {
			u_state = {
			...u_state,
					engagement: enqueueEngagement(u_state.engagement, {
					type: EngagementType.aside,
					key: EngagementKey['achievement-unlocked'],
				}, {
					semantic_level: 'success',
					auto_dismiss_delay_ms: 7_000,
					icon,
					name,
				}),
			}
		}
	})

	if (!has_change)
		return state

	return {
		...state,
		u_state: {
			...u_state,
			progress,
		}
	}
}

export {
	_refresh_achievements,
}
