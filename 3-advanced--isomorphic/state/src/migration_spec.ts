import { expect } from 'chai'
import deepFreeze from 'deep-freeze-strict'
import { SoftExecutionContext, getRootSEC } from '@offirmo-private/soft-execution-context'

import { LIB } from './consts'

import {
	LastMigrationStep,
	MigrationStep,
	CleanupStep,
	generic_migrate_to_latest,
} from './migration'

import {
	BASE_EXAMPLE,
	ROOT_EXAMPLE,
} from './_test_helpers'
import { WithSchemaVersion } from './types'


describe(`${LIB} - migration`, function() {
	const TEST_SEC = getRootSEC()
	TEST_SEC.setLogicalStack({module: LIB})

	describe('generic_migrate_to_latest()', function() {

		describe('on trivial or UState only', function() {
			const SCHEMA_VERSION = 2

			interface State2 extends WithSchemaVersion {
				schema_revision: 2
				foo: {
					bar: {
						baz: number
					}
				}
			}
			type State = State2
			interface State1 extends WithSchemaVersion {
				schema_revision: 1
				foo: {
					bar: number
				}
			}
			interface State0 {
				foo: number
			}
			const DEMO_STATE_v0: State0 = deepFreeze({
				foo: 42
			} as State0)
			const DEMO_STATE_v1: State1 = deepFreeze({
				foo: {
					bar: 42
				}
			} as State1)
			const DEMO_STATE_v2: State2 = deepFreeze({
				foo: {
					bar: {
						baz: 42
					}
				}
			} as State2)

			it.only('should work in nominal case', () => {
				function migrate_to_latest(SEC: SoftExecutionContext, legacy_state: Readonly<any>, hints: Readonly<any> = {}, ): State {
					return generic_migrate_to_latest({
						SEC,

						SCHEMA_VERSION,
						legacy_state: DEMO_STATE_v0,
						hints,
						sub_states: [],

						pipeline: [
							migrate_to_2,
							migrate_to_1,
						]
					})
				}

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
					if (legacy_schema_version < 1)
						legacy_state = previous(SEC, legacy_state, hints)

					let state: State = {
						...legacy_state as any,
						foo: {
							bar: legacy_state.foo,
						}
					}

					return state
				}

				expect(migrate_to_latest(TEST_SEC, DEMO_STATE_v0)).to.deep.equal(DEMO_STATE_v2)
			})
		})

		describe('on TState only', function() {

		})

		describe('on UState + TState', function() {

			/*

			const SCHEMA_VERSION = 2

			interface State2 extends WithSchemaVersion{
				schema_revision: 2
				foo: {
					bar: {
						baz: number
					}
				}
			}
			type State = State2
			interface State1 extends WithSchemaVersion{
				schema_revision: 1
				foo: {
					bar: number
				}
			}
			interface State0 {
				foo: number
			}
			const DEMO_STATE_v0: State0 = deepFreeze({
				foo: 42
			} as State0)
			const DEMO_STATE_v1: State1 = deepFreeze({
				foo: {
					bar: 42
				}
			} as State1)
			const DEMO_STATE_v2: State2 = deepFreeze({
				foo: {
					bar: {
						baz: 42
					}
				}
			} as State2)

			it('should work in nominal case', () => {
				function migrate_to_latest(SEC: SoftExecutionContext, legacy_state: Readonly<any>, hints: Readonly<any> = {}, ): State {
					return generic_migrate_to_latest({
						SEC,

						SCHEMA_VERSION,
						legacy_state: [ DEMO_STATE_v0, ],
						hints,
						sub_states: [],

						pipeline: [
							migrate_to_2,
							migrate_to_1,
						]
					})
				}

				const migrate_to_2: LastMigrationStep = (SEC, legacy_state, legacy_t_state], hints, next, legacy_schema_version) => {
					if (legacy_schema_version < 2)
						[ legacy_u_state, legacy_t_state ] = next(SEC, [legacy_u_state, legacy_t_state], legacy_schema_version, hints)

					let [ u_state, t_state ]: [ State2, any ] = [ legacy_u_state, legacy_t_state ]
					u_state = {
						...u_state,
						foo: {
							bar: {
								baz: legacy_u_state.foo.bar,
							}
						}
					}

					return [ u_state, t_state ]
				}

				const migrate_to_1: MigrationStep = () => {
					throw new Error('Schema is too old (pre-beta), can’t migrate!')
				}
			})
			 */
		})

		describe('on RootState', function() {

		})

	})

})
