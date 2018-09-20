import { Enum } from 'typescript-string-enums'

/////////////////////

const AchievementStatus = Enum(
	'hidden',
	'revealed',
	'unlocked',
)
type AchievementStatus = Enum<typeof AchievementStatus>

/////////////////////

interface Statistics {
	// TODO

	/*achievements: {
		[key: string]: AchievementStatus
	}*/
}

interface AchievementDefinition {
	key: string
	name: string
	description: string
	lore?: string // TODO

	sorting_rank: number

	get_status: (stats: Statistics) => AchievementStatus
	//get_completion_rate: (stats: Statistics) => number
}

interface AchievementEntry {
	key: string
	status: AchievementStatus
	completion_rate: number
}

/////////////////////

interface State {
	schema_version: number
	revision: number

	statistics: Statistics
}

/////////////////////

export {
	AchievementStatus,
	Statistics,
	AchievementDefinition,
	AchievementEntry,
	State,
}

/////////////////////
