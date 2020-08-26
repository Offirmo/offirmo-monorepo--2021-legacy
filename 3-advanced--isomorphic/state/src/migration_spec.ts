import { expect } from 'chai'
import deep_freeze from 'deep-freeze-strict'
import { SoftExecutionContext, getRootSEC } from '@offirmo-private/soft-execution-context'

import { LIB } from './consts'

import {
	LastMigrationStep,
	MigrationStep,
	CleanupStep,
	generic_migrate_to_latest,
} from './migration'

import {
	StateA_U_v0,
	DEMO_STATE_A_U_v0,
	StateA_U_v1,
	DEMO_STATE_A_U_v1,
	StateA_U_v2,
	DEMO_STATE_A_U_v2,
	SCHEMA_VERSION_A,
} from './_test_helpers'


describe.only(`${LIB} - migration`, function() {
	const TEST_SEC = getRootSEC()
	const LIB = '@offirmo-private/state--UNIT-TEST'
	TEST_SEC.setLogicalStack({module: LIB})

	describe('generic_migrate_to_latest()', function() {

		describe('on trivial or UState only', function() {
			const SCHEMA_VERSION = SCHEMA_VERSION_A

			type State2 = StateA_U_v2
			type State = State2
			const DEMO_STATE_v0 = DEMO_STATE_A_U_v0
			const DEMO_STATE_v2 = DEMO_STATE_A_U_v2

			const migrate_to_2: LastMigrationStep<State> = (SEC, legacy_state, hints, previous, legacy_schema_version) => {
				if (legacy_schema_version < 2)
					legacy_state = previous(SEC, legacy_state, hints)

				let state: State = {
					...legacy_state as any,
					foo: {
						bar: {
							baz: legacy_state.foo.bar,
						}
					}
				}

				return state
			}

			const migrate_to_1: MigrationStep = (SEC, legacy_state, hints, previous, legacy_schema_version) => {
				let state: State = {
					...legacy_state as any,
					foo: {
						bar: legacy_state.foo,
					}
				}

				return state
			}

			it('should work in nominal case', () => {
				function migrate_to_latest(SEC: SoftExecutionContext, legacy_state: Readonly<any>, hints: Readonly<any> = {}, ): State {
					return generic_migrate_to_latest({
						SEC,

						LIB,
						SCHEMA_VERSION,
						legacy_state: DEMO_STATE_v0,
						hints,
						sub_states: {},

						pipeline: [
							migrate_to_2,
							migrate_to_1,
						]
					})
				}

				expect(migrate_to_latest(TEST_SEC, DEMO_STATE_v0)).to.deep.equal(DEMO_STATE_v2)
			})

			it('should throw on end of pipeline (too old version)', () => {
				function migrate_to_latest(SEC: SoftExecutionContext, legacy_state: Readonly<any>, hints: Readonly<any> = {}, ): State {
					return generic_migrate_to_latest({
						SEC,

						LIB,
						SCHEMA_VERSION,
						legacy_state: DEMO_STATE_v0,
						hints,
						sub_states: {},

						pipeline: [
							migrate_to_2,
							// no older migration
						]
					})
				}

				expect(() => migrate_to_latest(TEST_SEC, DEMO_STATE_v0)).to.throw('migration')
			})
		})

		describe('on TState only', function() {

		})

		describe('on Bundled UState + TState', function() {

		})

		describe('on RootState with subStates', function() {

		})
	})
})
