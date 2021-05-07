import { expect } from 'chai'
import { Immutable } from '@offirmo-private/ts-types'
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


describe(`${LIB} - migration`, function() {
	const TEST_SEC = getRootSEC()
	const LIB = '@offirmo-private/state-utils--UNIT-TEST'
	TEST_SEC.setLogicalStack({module: LIB})

	describe('generic_migrate_to_latest()', function() {

		describe('on base state', function() {
			const SCHEMA_VERSION = SCHEMA_VERSION_A

			type State2 = StateA_U_v2
			type State = State2
			const DEMO_STATE_v0 = DEMO_STATE_A_U_v0
			const DEMO_STATE_v1 = DEMO_STATE_A_U_v1
			const DEMO_STATE_v2 = DEMO_STATE_A_U_v2
			const HINTS = {
				v2: {
					revision: 333,
				}
				// by version
				// v1: {}
				// substates
				// subA: {}
			}

			const migrate_to_2: LastMigrationStep<State> = (SEC, legacy_state, hints, previous, legacy_schema_version) => {
				if (legacy_schema_version < 1)
					legacy_state = previous(SEC, legacy_state, hints)

				let state: State = {
					...legacy_state as any,
					schema_version: 2,
					revision: hints.v2.revision,
					foo: {
						bar: {
							baz: legacy_state.foo.bar,
						}
					}
				}

				return state
			}

			const migrate_to_1: MigrationStep = (SEC, legacy_state, hints, previous, legacy_schema_version) => {
				if (legacy_schema_version < 0)
					legacy_state = previous(SEC, legacy_state, hints)

				let state: State = {
					...legacy_state as any,
					schema_version: 1,
					foo: {
						bar: legacy_state.foo,
					}
				}

				return state
			}

			function migrate_to_latest(SEC: SoftExecutionContext, legacy_state: Immutable<any>, hints: Immutable<any> = {}, ): State {
				return generic_migrate_to_latest({
					SEC,

					LIB,
					SCHEMA_VERSION,
					legacy_state,
					hints,
					sub_states_migrate_to_latest: {},

					pipeline: [
						migrate_to_2,
						migrate_to_1,
					]
				})
			}

			it('should work in nominal case 0 -> 2', () => {
				expect(migrate_to_latest(TEST_SEC, DEMO_STATE_v0, HINTS)).to.deep.equal(DEMO_STATE_v2)
			})

			it('should work in nominal case 1 -> 2', () => {
				expect(migrate_to_latest(TEST_SEC, DEMO_STATE_v1, HINTS)).to.deep.equal(DEMO_STATE_v2)
			})

			it('should work in nominal case 2 -> 2', () => {
				//expect(migrate_to_latest(TEST_SEC, DEMO_STATE_v2, HINTS)).to.deep.equal(DEMO_STATE_v2)
				// identity if already good version
				expect(migrate_to_latest(TEST_SEC, DEMO_STATE_v2, HINTS)).to.equal(DEMO_STATE_v2)
			})

			it('should throw on end of pipeline (too old version)', () => {
				function migrate_to_latest(SEC: SoftExecutionContext, legacy_state: Immutable<any>, hints: Immutable<any> = {}, ): State {
					return generic_migrate_to_latest({
						SEC,

						LIB,
						SCHEMA_VERSION,
						legacy_state: DEMO_STATE_v0,
						hints,
						sub_states_migrate_to_latest: {},

						pipeline: [
							migrate_to_2,
							// no older migration
						]
					})
				}

				expect(() => migrate_to_latest(TEST_SEC, DEMO_STATE_v0)).to.throw('migration')
			})
		})

		describe('on Bundled UState + TState', function() {

		})

		describe('on RootState with subStates', function() {

		})
	})
})
