import {
	State as ProgressState,
	AchievementDefinition,
	AchievementStatus,
	on_achieved,
	get_last_know_achievement_status,
} from '@oh-my-rpg/state-progress'
import {
	enqueue as enqueueEngagement,
	EngagementType,
} from '@oh-my-rpg/state-engagement'

import { State } from '../../../types'

import ACHIEVEMENT_DEFINITIONS from '../../../data/achievements'
import {EngagementKey} from "../../../engagement";

/////////////////////

function refresh_achievements(state: Readonly<State>): Readonly<State> {
	let changed = false
	let progress: ProgressState = {
		...state.progress
	}

	ACHIEVEMENT_DEFINITIONS.forEach((definition: AchievementDefinition<State>) => {
		const { name } = definition
		const last_known_status = get_last_know_achievement_status(progress, name)
		const current_status = definition.get_status(state)

		if (last_known_status === current_status) return

		changed = true
		progress = on_achieved(progress, name, current_status)
		// need to tell the user?
		if (current_status === AchievementStatus.unlocked) {
			state = {
				...state,
				engagement: enqueueEngagement(state.engagement, {
					type: EngagementType.aside,
					key: EngagementKey['hello_world--aside'],
				}, {
					name,
				}),
			}
		}
	})

	if (!changed)
		return state

	return {
		...state,
		progress,
	}
}

export {
	refresh_achievements,
}
