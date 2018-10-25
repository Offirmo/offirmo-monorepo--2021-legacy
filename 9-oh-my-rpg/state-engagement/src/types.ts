import { Enum } from 'typescript-string-enums'

/////////////////////

const EngagementType = Enum(
	'flow', // normal immediate feedback to user actions
	'aside', // side message like an achievement
	// 'full_transient', // full screen like a level up
	// 'announcement',
	// 'modal', // so important that it must be acknowledged
	// tutoriel
	// hint
)
type EngagementType = Enum<typeof EngagementType> // eslint-disable-line no-redeclare

// TODO TS type inheritance?
interface Engagement {
	key: string
	type: EngagementType
}

interface PendingEngagement {
	engagement: Engagement
	queue_time_root_revision: number
	// params?
}

/////////////////////

interface State {
	schema_version: number
	revision: number

	queue: PendingEngagement[]
}

/////////////////////

export {
	EngagementType,
	Engagement,
	PendingEngagement,
	State,
}

/////////////////////
