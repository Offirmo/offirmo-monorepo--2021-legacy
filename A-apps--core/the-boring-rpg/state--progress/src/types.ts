import { Enum } from 'typescript-string-enums'

import { Immutable, BaseUState } from '@offirmo-private/state-utils'
import { HumanReadableTimestampUTCDays } from '@offirmo-private/timestamps'

import { Element } from '@tbrpg/definitions'

/////////////////////

const AchievementStatus = Enum(
	'secret', // should not even be hinted
	'hidden', // may be hinted, for ex. as [???]
	'revealed', // appear and conditions may be seen
	'unlocked',
)
type AchievementStatus = Enum<typeof AchievementStatus> // eslint-disable-line no-redeclare

interface AchievementDefinition<S> {
	// TODO rename to temporary ID
	session_uuid: string // to help React + rich text with a sortable id which may not be stable outside of the current session. Should NOT be stored.

	name: string // is also the key
	icon: string
	description: string
	lore?: string
	get_status: (state: Immutable<S>) => AchievementStatus
	get_completion_rate?: (state: Immutable<S>) => [number, number]
}

// useful for display
interface AchievementSnapshot extends Element {
	name: string
	icon: string
	description: string
	lore?: string
	status: AchievementStatus
	completion_rate?: [number, number]
}

/////////////////////

interface State extends BaseUState {
	// NOTE: This state SHOULD NOT contain stuff that can be inferred from the global state,
	// that would be redundant!

	wiki: null // TODO
	// places
	// mysteries
	// people, organizations
	// events (history)
	flags: null // TODO

	// THIS IS NOT representing the state of achievements.
	// Achievements are derived from the state,
	// so we don't need to store their status.
	// BUT we need to detect a change in status,
	// hence the need for storing the previous state.
	// Theoretically we COULD detect a change without that,
	// EXCEPT for newly introduced achievements, so this is needed.
	// TODO rename as "last_known_achievement_status" ?
	achievements: { [key: string]: AchievementStatus }

	// TODO externalize?
	statistics: {
		creation_date_hrtday: HumanReadableTimestampUTCDays,

		last_visited_timestamp_hrtday: HumanReadableTimestampUTCDays
		active_day_count: number

		// game
		good_play_count: number
		bad_play_count: number
		encountered_monsters: { [key: string]: true }
		encountered_adventures: { [key: string]: true }
		good_play_count_by_active_class: { [klass: string]: number }
		bad_play_count_by_active_class: { [klass: string]: number }
		fight_won_count: number
		fight_lost_count: number
		coins_gained: number
		tokens_gained: number
		items_gained: number

		// meta (sent from above) yet needed for some achievements
		// TODO review redundancy
		has_account: boolean
		is_registered_alpha_player: boolean
	}
}

/////////////////////

export {
	AchievementSnapshot,
	AchievementStatus,
	AchievementDefinition,
	State,
}

/////////////////////
