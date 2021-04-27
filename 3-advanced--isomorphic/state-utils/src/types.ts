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
// time of last user-initiated *change*
// (*may* increment even if an action triggers no change, as it's an indicator of freshness TODO clarify)
export interface WithLastUserActionTimestamp {
	last_user_action_tms: TimestampUTCMs
}
export interface WithTimestamp {
	timestamp_ms: TimestampUTCMs
}



export interface BaseState extends WithSchemaVersion, WithRevision {
	//last_user_action_tms no, only needed at the top level
}
// state which only changes with User actions
export interface BaseUState extends BaseState {
}
// state which changes with User actions but also with Time
export interface BaseTState extends BaseState, WithTimestamp {
}


export type UTBundle<U extends BaseUState, T extends BaseTState> = [ U, T ]

export interface BaseRootState<U extends BaseUState = BaseUState, T extends BaseTState = BaseTState> {
	// schema_version, revision -> NO, would be redundant, see u_state & t_state TODO review
	//last_user_action_tms: TimestampUTCMs TODO useful to select a fork

	u_state: U
	t_state: T
}

// TODO review
export type OffirmoState<
	U extends BaseUState = BaseUState,
	T extends BaseTState = BaseTState,
> = U | T | UTBundle<U, T> | BaseRootState<U, T>
