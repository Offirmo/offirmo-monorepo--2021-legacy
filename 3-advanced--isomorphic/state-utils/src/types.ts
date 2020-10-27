//import { JSONAny } from '@offirmo-private/ts-types'
import { TimestampUTCMs } from '@offirmo-private/timestamps'


// critical for migrations
export interface WithSchemaVersion {
	schema_version: number
}
// represents user-initiated changes
export interface WithRevision {
	revision: number
}
export interface WithTimestamp {
	timestamp_ms: TimestampUTCMs
}


export interface BaseState extends WithSchemaVersion, WithRevision {
	//last_user_action_tms: TimestampUTCMs
	//[k: string]: JSONAny | BaseUState
}
// state which only changes with User actions
export interface BaseUState extends BaseState {
}
// state which changes with User actions but also with Time
export interface BaseTState extends BaseState, WithTimestamp {
}


export type UTBundle<U extends BaseUState, T extends BaseTState> = [ U, T ]

export interface BaseRootState<U extends BaseUState = BaseUState, T extends BaseTState = BaseTState> {
	// schema_version, revision -> would be redundant, see u_state & t_state

	u_state: U
	t_state: T
}

// TODO review
/*export type OffirmoState<
	U extends BaseUState = BaseUState,
	T extends BaseTState = BaseTState,
> = U | T | UTBundle<U, T> | BaseRootState<U, T>*/
