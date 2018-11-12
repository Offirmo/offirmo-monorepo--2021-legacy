import { Enum } from 'typescript-string-enums'

/////////////////////

const EngagementType = Enum(
	'flow', // normal immediate feedback to user actions
	'aside', // side message like an achievement
	'warning', // side message with an higher priority
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

interface EngagementParams {
	semantic_level?: 'error' | 'warning' | 'info' | 'success',
	auto_dismiss_delay_ms?: number,
	[key: string]: any
}

interface PendingEngagement {
	uid: number
	engagement: Engagement
	params: EngagementParams
}

/////////////////////

interface State {
	schema_version: number
	revision: number

	// last in, last out
	// newest are appended
	queue: PendingEngagement[]
}

/////////////////////

export {
	EngagementType,
	Engagement,
	EngagementParams,
	PendingEngagement,
	State,
}

/////////////////////
