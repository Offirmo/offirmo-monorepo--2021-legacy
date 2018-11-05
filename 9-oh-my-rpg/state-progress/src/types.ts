import { Enum } from 'typescript-string-enums'

import { HumanReadableTimestampUTCMinutes } from '@offirmo/timestamps'

/////////////////////

const AchievementStatus = Enum(
	'hidden',
	'revealed',
	'unlocked',
)
type AchievementStatus = Enum<typeof AchievementStatus> // eslint-disable-line no-redeclare

interface AchievementDefinition {
	name: string
	icon: string
	description: string
	lore?: string
	get_status: (stats: State) => AchievementStatus
}

/////////////////////

interface State {
	schema_version: number
	revision: number

	// NOTE: This state NOT contain stuff that can be inferred from the global state,
	// that would be redundant!

	wiki: null // TODO
	flags: null // TODO

	// Achievements are derived from the state,
	// so we don't need to store their status.
	// BUT we need to detect a change in status,
	// hence the need for storing the previous state.
	// Theoretically we COULD detect a change without that,
	// EXCEPT for newly introduced achievements, so this is needed.
	achievements: { [key: string]: AchievementStatus }

	statistics: {
		// game
		good_play_count: number
		bad_play_count: number
		encountered_monsters: { [key: string]: true }
		encountered_adventures: { [key: string]: true }
		good_play_count_by_active_class: { [klass: string]: number }
		bad_play_count_by_active_class: { [klass: string]: number }

		// meta (sent from above)
		has_account: boolean
		is_registered_alpha_player: boolean
	}
}

/////////////////////

export {
	AchievementStatus,
	AchievementDefinition,
	State,
}

/////////////////////
