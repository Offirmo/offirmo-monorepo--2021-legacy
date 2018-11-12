import { ElementType } from '@oh-my-rpg/definitions'

import {
	AchievementDefinition,
	AchievementStatus,
	AchievementSnapshot,
} from '@oh-my-rpg/state-progress'

import { State } from '../types'

import ACHIEVEMENT_DEFINITIONS from '../data/achievements'

/////////////////////

function get_achievement_snapshot(state: Readonly<State>, definition: AchievementDefinition<State>): Readonly<AchievementSnapshot> {
	const { session_uuid, name, icon, description, lore, get_status } = definition
	const status = get_status(state)

	return {
		uuid: session_uuid,
		element_type: ElementType.achievement_snapshot,
		name,
		icon,
		description,
		lore,
		status,
	}
}

function get_achievement_snapshot_by_uuid(state: Readonly<State>, session_uuid: string): Readonly<AchievementSnapshot> {
	const definition = ACHIEVEMENT_DEFINITIONS.find(d => d.session_uuid === session_uuid)
	if (!definition)
		throw new Error(`No achievement definition found for uuid "${session_uuid}"!`)

	return get_achievement_snapshot(state, definition)
}

function get_achievements_snapshot(state: Readonly<State>): Readonly<AchievementSnapshot>[] {
	return ACHIEVEMENT_DEFINITIONS
		.map((definition: AchievementDefinition<State>): AchievementSnapshot => {
			return get_achievement_snapshot(state, definition)
		})
		.filter(as => as.status !== AchievementStatus.secret)
}

export {
	get_achievement_snapshot,
	get_achievement_snapshot_by_uuid,
	get_achievements_snapshot,
}
