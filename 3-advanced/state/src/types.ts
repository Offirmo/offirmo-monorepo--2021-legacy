//import { JSONAny } from '@offirmo-private/ts-types'
import { TimestampUTCMs } from '@offirmo-private/timestamps'

export interface BaseUState {
	schema_version: number
	revision: number

	//last_user_action_tms: TimestampUTCMs
	//[k: string]: JSONAny | BaseUState
}

export interface BaseTState {
	schema_version: number
	// revision is not relevant for a T-State
	timestamp_ms: TimestampUTCMs

	//[k: string]: JSONAny | BaseTState
}

export interface BaseRootState {
	schema_version: number
	//revision: undefined -> useless, see u_state

	u_state: BaseUState
	t_state: BaseTState
}
