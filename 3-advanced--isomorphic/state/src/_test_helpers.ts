import deepFreeze from 'deep-freeze-strict'
import {
	listenToUncaughtErrors,
	listenToUnhandledRejections,
	decorateWithDetectedEnv,
} from '@offirmo-private/soft-execution-context-node'

import {
	BaseRootState, BaseTState,
	BaseUState,
} from './types'


listenToUncaughtErrors()
listenToUnhandledRejections()
decorateWithDetectedEnv()


export interface SubState1 extends BaseUState {
	schema_version: 4

	foo: number
	bar: string
}
export interface SubState2 extends BaseUState {
	schema_version: 5

	fizz: number
	buzz: string
}
export interface TestUState extends BaseUState {
	schema_version: 8

	sub1: SubState1
	sub2: SubState2
}
export interface TestTState extends BaseTState {
	schema_version: 3

	energy: number
}
export interface TestRootState extends BaseRootState {
	schema_version: 10

	u_state: TestUState
	t_state: TestTState
}

export const BASE_EXAMPLE: Readonly<TestUState> = deepFreeze({
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
		fizz: 33,
		buzz: 'hello',
	},
} as TestUState)

export const ROOT_EXAMPLE: Readonly<TestRootState> = deepFreeze({
	schema_version: 10,

	u_state: BASE_EXAMPLE,
	t_state: {
		schema_version: 3,
		revision: 20,
		timestamp_ms: 123456789,
		energy: 7,
	},
} as TestRootState)
