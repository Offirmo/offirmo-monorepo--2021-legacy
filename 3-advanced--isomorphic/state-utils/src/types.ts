//import { JSONAny } from '@offirmo-private/ts-types'
import { TimestampUTCMs } from '@offirmo-private/timestamps'


// critical for migrations
export interface WithSchemaVersion {
	schema_version: number
}
// count of user-initiated *changes*
// (should not increment if an action triggers no change)
export interface WithRevision {
	revision: number
}
// time of last *user-initiated* *activity*
// (*may* increment even if an action triggers no change, as it's an indicator of freshness TODO clarify)
// particularly important to discriminate if the state forked
export interface WithLastUserActivityTimestamp {
	last_user_activity_tms: TimestampUTCMs
}
// for time-related data (ex. energy refill)
// Note that we expect our code to be able to time-travel, so for an equal revision,
// it shouldn't matter the time
export interface WithTimestamp {
	timestamp_ms: TimestampUTCMs
}


// most basic building block, implemented by most states
export interface BaseState extends WithSchemaVersion, WithRevision {
	//last_user_action_tms: no, only needed at the top level
}
// more advanced state: which ONLY changes with user actions
export interface BaseUState extends BaseState {
}
// more advanced state: which changes with BOTH user actions and elapsed time
export interface BaseTState extends BaseState, WithTimestamp {
}
// tuple of U+T State
export type UTBundle<U extends BaseUState, T extends BaseTState> = [ U, T ]

// most advanced state = aggregation of multiple U+T states
export interface BaseRootState<U extends BaseUState = BaseUState, T extends BaseTState = BaseTState> extends WithLastUserActivityTimestamp {
	// schema_version, revision -> NO, would be redundant, see u_state & t_state

	u_state: U
	t_state: T
}


export interface StateInfos extends WithSchemaVersion, WithRevision, WithTimestamp, WithLastUserActivityTimestamp {
}


// TODO review
export type AnyOffirmoState<
	B extends BaseState = BaseState,
	U extends BaseUState = BaseUState,
	T extends BaseTState = BaseTState,
> = B | U | T | UTBundle<U, T> | BaseRootState<U, T>
