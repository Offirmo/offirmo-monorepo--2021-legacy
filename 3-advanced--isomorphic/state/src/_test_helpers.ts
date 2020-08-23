import deepFreeze from 'deep-freeze-strict'

import {
	BaseRootState, BaseTState,
	BaseUState,
} from './types'

// needed only for changing the default level
import { getRootSEC } from '@offirmo-private/soft-execution-context-node'
import { getLogger } from '@offirmo/universal-debug-api-node'
const logger = getLogger({
//	suggestedLevel: 'silly'
})
getRootSEC().injectDependencies({ logger: getLogger() })

/////////////////////////////////////////////////

export interface SubUStateA_v4 extends BaseUState {
	schema_version: 4

	foo: number
	bar: string
}
export type SubUStateA = SubUStateA_v4

/////////////////////

export interface SubUStateB_v5 extends BaseUState {
	schema_version: 5

	fizz: string
}
export type SubUStateB = SubUStateB_v5
export interface SubTStateB_v5 extends BaseTState {
	schema_version: 5

	buzz: number
}
export type SubTStateB = SubTStateB_v5

/////////////////////////////////////////////////

export interface TestRootUState_v8 extends BaseUState {
	schema_version: 8

	sub1: SubUStateA
	sub2: SubUStateB
}
export type TestRootUState = TestRootUState_v8

export interface TestRootTState_v3 extends BaseTState {
	schema_version: 3

	energy: number
	sub2: SubTStateB
}
export type TestRootTState = TestRootTState_v3

export interface TestRootState_v10 extends BaseRootState {
	schema_version: 10

	u_state: TestRootUState
	t_state: TestRootTState
}
export type TestRootState = TestRootState_v10

/////////////////////////////////////////////////

export const BASE_UEXAMPLE: Readonly<TestRootUState> = deepFreeze({
	schema_version: 8,
	revision: 103,

	sub1: {
		schema_version: 4,
		revision: 45,
		foo: 42,
		bar: 'baz',
	},
	sub2: {
		schema_version: 5,
		revision: 67,
		fizz: 'hello',
	},
} as TestRootUState)

export const BASE_TEXAMPLE: Readonly<TestRootTState> = deepFreeze({
	schema_version: 3,
	revision: 222,
	timestamp_ms: 123456789,
	energy: 7,

	sub2: {
		schema_version: 5,
		revision: 67,
		buzz: 33,
	},
} as TestRootTState)

export const ROOT_EXAMPLE: Readonly<TestRootState> = deepFreeze({
	schema_version: 10,

	u_state: BASE_UEXAMPLE,
	t_state: BASE_TEXAMPLE,
} as TestRootState)
