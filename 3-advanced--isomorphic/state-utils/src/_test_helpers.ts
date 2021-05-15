import { TEST_TIMESTAMP_MS } from '@offirmo-private/timestamps'
import { Immutable } from '@offirmo-private/ts-types'

import {
	BaseRootState,
	UTBundle,
	BaseTState,
	BaseUState,
	WithSchemaVersion,
} from './types'
import { enforce_immutability } from './utils'

// needed only for changing the default level
//import { _force_set_level_of_uda_default_logger } from '@offirmo-private/soft-execution-context-node'
//_force_set_level_of_uda_default_logger('silly')

/////////////////////////////////////////////////

// single U
export interface StateA_U_v0 {
	foo: number
}
export const DEMO_STATE_A_U_v0: StateA_U_v0 = enforce_immutability<StateA_U_v0>({
	foo: 42
})

export interface StateA_U_v1 extends WithSchemaVersion {
	schema_version: 1
	foo: {
		bar: number
	}
}
export const DEMO_STATE_A_U_v1: StateA_U_v1 = enforce_immutability<StateA_U_v1>({
	schema_version: 1,
	foo: {
		bar: 42
	}
})

export interface StateA_U_v2 extends BaseUState {
	schema_version: 2
	foo: {
		bar: {
			baz: number
		}
	}
}
export const DEMO_STATE_A_U_v2: StateA_U_v2 = enforce_immutability<StateA_U_v2>({
	schema_version: 2,
	revision: 333,
	foo: {
		bar: {
			baz: 42
		}
	}
})

export type StateA_U = StateA_U_v2
export const SCHEMA_VERSION_A = 2

/////////////////////

// single T
export interface StateB_T_v4 extends BaseTState {
	energy: number
}
export const DEMO_STATE_B_T_v4: StateB_T_v4 = enforce_immutability<StateB_T_v4>({
	schema_version: 4,
	timestamp_ms: TEST_TIMESTAMP_MS,
	revision: 0,
	energy: 7
})

export type StateB_T = StateB_T_v4
export const SCHEMA_VERSION_B = 4

/////////////////////

// bundled
export interface StateC_U_v5 extends BaseUState {
	schema_version: 5

	fizz: string
}
export const DEMO_STATE_C_U_v5: StateC_U_v5 = enforce_immutability<StateC_U_v5>({
	schema_version: 5,
	revision: 24,

	fizz: 'buzz',
})
export interface StateC_T_v5 extends BaseTState {
	schema_version: 5

	buzz: number
}
export const DEMO_STATE_C_T_v5: StateC_T_v5 = enforce_immutability<StateC_T_v5>({
	schema_version: 5,
	timestamp_ms: TEST_TIMESTAMP_MS,
	revision: 12,

	buzz: 11,
})
export type StateC_U = StateC_U_v5
export type StateC_T = StateC_T_v5

/////////////////////////////////////////////////

export interface DemoRootState_U_v8 extends BaseUState {
	own_u: string

	subA: StateA_U
	// no subB
	subC: StateC_U
}
export interface DemoRootState_T_v8 extends BaseTState {
	own_t: number

	// no subA
	subB: StateB_T
	subC: StateC_T
}
export type DemoBundleState_v8 = UTBundle<DemoRootState_U_v8, DemoRootState_T_v8>
export interface DemoRootState_v8 extends BaseRootState {
	own_r: number

	u_state: DemoRootState_U_v8
	t_state: DemoRootState_T_v8
}
export type DemoRootState = DemoRootState_v8

/////////////////////////////////////////////////
export const DEMO_BUNDLE_v8: Immutable<DemoBundleState_v8> = enforce_immutability<DemoBundleState_v8>([
	{
		schema_version: 8,
		revision: 103,

		own_u: 'hello',

		subA: DEMO_STATE_A_U_v2,
		subC: DEMO_STATE_C_U_v5,
	},
	{
		schema_version: 8,
		revision: 33,
		timestamp_ms: TEST_TIMESTAMP_MS,

		own_t: 42,

		subB: DEMO_STATE_B_T_v4,
		subC: DEMO_STATE_C_T_v5,
	},
])

export const DEMO_ROOT_v8: Immutable<DemoRootState_v8> = enforce_immutability<DemoRootState_v8>({
	ⵙapp_id: 'test',
	last_user_investment_tms: TEST_TIMESTAMP_MS,

	own_r: 7,

	u_state: {
		schema_version: 8,
		revision: 103,

		own_u: 'hello',

		subA: DEMO_STATE_A_U_v2,
		subC: DEMO_STATE_C_U_v5,
	},
	t_state: {
		schema_version: 8,
		revision: 33,
		timestamp_ms: TEST_TIMESTAMP_MS,

		own_t: 42,

		subB: DEMO_STATE_B_T_v4,
		subC: DEMO_STATE_C_T_v5,
	},
})

/////////////////////////////////////////////////

export const DEMO_BASE_STATE = DEMO_STATE_C_U_v5
export const DEMO_BASE_STATE_WITH_SUBS = DEMO_ROOT_v8.u_state

export const DEMO_USTATE = DEMO_STATE_C_U_v5
export const DEMO_TSTATE = DEMO_STATE_C_T_v5
export const DEMO_BUNDLE_STATE = DEMO_BUNDLE_v8
export const DEMO_ROOT_STATE = DEMO_ROOT_v8
