import { Enum } from 'typescript-string-enums'

// TODO move out
interface Analytics {
	SEC: any,
	eventId: string,
	details: {
		[k: string]: string | number | undefined | null
	}
}

/////////////////////

const AchievementPlane = Enum(
	'account',
	'app',
	'character',
)
type AchievementPlane = Enum<typeof AchievementPlane> // eslint-disable-line no-redeclare


const AchievementStatus = Enum(
	'hidden',
	'revealed',
	'unlocked',
)
type AchievementStatus = Enum<typeof AchievementStatus> // eslint-disable-line no-redeclare

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

	sorting_rank: number // TODO useful?

	get_status: (stats: Statistics) => AchievementStatus
	//get_completion_rate: (stats: Statistics) => number
}

interface AchievementEntry {
	key: string
	status: AchievementStatus
	//completion_rate: number
}

/////////////////////

interface State {
	schema_version: number
	revision: number

	statistics: Statistics
}

/////////////////////

export {
	Analytics,
	AchievementStatus,
	Statistics,
	AchievementDefinition,
	AchievementEntry,
	State,
}

/////////////////////
