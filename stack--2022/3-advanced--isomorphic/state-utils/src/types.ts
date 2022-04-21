//import { JSONAny } from '@offirmo-private/ts-types'
import { TimestampUTCMs } from '@offirmo-private/timestamps'
import { Immutable } from '@offirmo-private/ts-types'
import { SoftExecutionContext } from '@offirmo-private/soft-execution-context'


// critical for migrations
export interface WithSchemaVersion {
	schema_version: number
}
// count of user-initiated *changes*
// (should not increment if an action triggers no change)
export interface WithRevision {
	revision: number
}
// time of last *user-initiated* *investment* (not activity)
// may NOT be incremented by some meta, non investment actions
// particularly important to discriminate if the state forked
export interface WithLastUserInvestmentTimestamp {
	last_user_investment_tms: TimestampUTCMs
}
// for time-related data (ex. energy refill)
// Note that we expect our code to be able to time-travel, so for an equal revision,
// it shouldn't matter the time
export interface WithTimestamp {
	timestamp_ms: TimestampUTCMs
}


// most basic building block, implemented by most states
export interface BaseState extends WithSchemaVersion, WithRevision {
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
export interface BaseRootState<U extends BaseUState = BaseUState, T extends BaseTState = BaseTState> extends WithLastUserInvestmentTimestamp {
	// schema_version, revision -> NO, would be redundant, see u_state & t_state
	// HOWEVER very useful for debug -> we let the final user make the call and manage it.

	// unique identifier of the app using this state.
	// Useful for dedicated checks/ops in common code.
	// Prefixed with unicode to be put at the bottom, helps readability on ordered stringified.
	ⵙapp_id: string

	u_state: U
	t_state: T
}


export interface StateInfos extends WithSchemaVersion, WithRevision, WithTimestamp, WithLastUserInvestmentTimestamp {
}


// TODO review
export type AnyOffirmoState<
	B extends BaseState = BaseState,
	U extends BaseUState = BaseUState,
	T extends BaseTState = BaseTState,
> = B | U | T | UTBundle<U, T> | BaseRootState<U, T>

export interface BaseAction<Type = string> {
	type: Type
	time: TimestampUTCMs
	expected_revisions: {
		[k:string]: number
	}
}
