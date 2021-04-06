import { Immutable } from '@offirmo-private/ts-types'

import { State, AchievementStatus } from './types'


/////////////////////

function get_last_known_achievement_status(state: Immutable<State>, key: string): AchievementStatus | undefined {
	return state.achievements[key]
}

function is_achievement_already_unlocked(state: Immutable<State>, key: string): boolean {
	return state.achievements.hasOwnProperty(key)
		? state.achievements[key] === AchievementStatus.unlocked
		: false
}
/////////////////////

export {
	get_last_known_achievement_status,
	is_achievement_already_unlocked,
}
