import { ElementType } from '@oh-my-rpg/definitions'

import {
	get_last_known_achievement_status,
	AchievementDefinition,
	AchievementStatus,
	AchievementSnapshot,
} from '@oh-my-rpg/state-progress'

import { State } from '../types'

import ACHIEVEMENT_DEFINITIONS from '../data/achievements'

/////////////////////

function get_achievement_snapshot(state: Readonly<State>, definition: Readonly<AchievementDefinition<State>>): Readonly<AchievementSnapshot> {
	const { session_uuid, name, icon, description, lore, get_completion_rate } = definition

	// we check this and not get_status since unlock is "sticky" (by design) and get_status may not be
	const status = get_last_known_achievement_status(state.progress, name)

	return {
		uuid: session_uuid,
		element_type: ElementType.achievement_snapshot,
		name,
		icon,
		description,
		lore,
		status: status!,
		completion_rate: get_completion_rate ? get_completion_rate(state) : undefined,
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

function get_achievements_completion(state: Readonly<State>): [number, number] {
	const snapshot = get_achievements_snapshot(state)
	const unlocked_ach_count = snapshot
		.filter(as => as.status === AchievementStatus.unlocked)
		.length

	return [unlocked_ach_count, snapshot.length]
}

/////////////////////

export {
	get_achievement_snapshot,
	get_achievement_snapshot_by_uuid,
	get_achievements_snapshot,
	get_achievements_completion,
}
