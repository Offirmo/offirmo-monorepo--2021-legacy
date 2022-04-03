import { ElementType } from '@tbrpg/definitions'
import { Immutable} from '@offirmo-private/ts-types'

import {
	get_last_known_achievement_status,
	AchievementDefinition,
	AchievementStatus,
	AchievementSnapshot,
} from '@tbrpg/state--progress'

import { UState } from '../types'

import ACHIEVEMENT_DEFINITIONS from '../data/achievements'

/////////////////////

function get_achievement_snapshot(u_state: Immutable<UState>, definition: Immutable<AchievementDefinition<UState>>): AchievementSnapshot {
	const { session_uuid, name, icon, description, lore, get_completion_rate } = definition

	// we check this and not get_status since unlock is "sticky" (by design) and get_status may not be
	const status = get_last_known_achievement_status(u_state.progress, name)

	return {
		uuid: session_uuid,
		element_type: ElementType.achievement_snapshot,
		name,
		icon,
		description,
		lore,
		status: status!,
		completion_rate: get_completion_rate ? get_completion_rate(u_state) : undefined,
	}
}

function get_achievement_snapshot_by_temporary_id(u_state: Immutable<UState>, temporary_id: string): ReturnType<typeof get_achievement_snapshot> {
	const definition = ACHIEVEMENT_DEFINITIONS.find(d => d.session_uuid === temporary_id)
	if (!definition)
		throw new Error(`No achievement definition found for temporary_id "${temporary_id}"!`)

	return get_achievement_snapshot(u_state, definition)
}

function get_achievements_snapshot(u_state: Immutable<UState>): ReturnType<typeof get_achievement_snapshot>[] {
	return ACHIEVEMENT_DEFINITIONS
		.map((definition: AchievementDefinition<UState>): AchievementSnapshot => {
			return get_achievement_snapshot(u_state, definition)
		})
		.filter(as => as.status !== AchievementStatus.secret)
}

function get_achievements_completion(u_state: Immutable<UState>): [number, number] {
	const snapshot = get_achievements_snapshot(u_state)
	const unlocked_ach_count = snapshot
		.filter(as => as.status === AchievementStatus.unlocked)
		.length

	return [unlocked_ach_count, snapshot.length]
}

/////////////////////

export {
	get_achievement_snapshot,
	get_achievement_snapshot_by_temporary_id,
	get_achievements_snapshot,
	get_achievements_completion,
}
