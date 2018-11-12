import { Enum } from 'typescript-string-enums'

const EngagementKey = Enum(
	'hello_world--flow',
	'hello_world--aside',
	'hello_world--warning',
	'tip--first_play',
	// TODO suggest changing name
	// TODO suggest changing class
	'code_redemption--failed',
	'code_redemption--succeeded',
	'achievement-unlocked',

)
type EngagementKey = Enum<typeof EngagementKey> // eslint-disable-line no-redeclare

export {
	EngagementKey,
}
