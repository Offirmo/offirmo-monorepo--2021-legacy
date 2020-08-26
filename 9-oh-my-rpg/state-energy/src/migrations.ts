import deep_freeze from 'deep-freeze-strict'
import { LastMigrationStep, MigrationStep, generic_migrate_to_latest } from '@offirmo-private/state'

import { LIB, SCHEMA_VERSION } from './consts'
import { UState, TState } from './types'
import { OMRSoftExecutionContext } from './sec'

// some hints may be needed to migrate to demo state
// need to export them for composing tests
const MIGRATION_HINTS_FOR_TESTS: any = deep_freeze<any>({
})

/////////////////////

type StateForMigration = [UState, TState]

function migrate_to_latest(SEC: OMRSoftExecutionContext, legacy_state: Readonly<any>, hints: Readonly<any> = {}): StateForMigration {
	return generic_migrate_to_latest({
		SEC: SEC as any,

		LIB,
		SCHEMA_VERSION,
		legacy_state,
		hints,
		sub_states: [],

		pipeline: [
			migrate_to_4,
			migrate_to_3,
		]
	})
}

/////////////////////

const migrate_to_4: LastMigrationStep<StateForMigration, [any, any]> = (SEC, [legacy_u_state, legacy_t_state], hints, next, legacy_schema_version) => {
	if (legacy_schema_version < 3)
		[ legacy_u_state, legacy_t_state ] = next(SEC, [legacy_u_state, legacy_t_state], hints)

	let [ u_state, t_state ] = [ legacy_u_state, legacy_t_state ]
	t_state = {
		...t_state,

		// this field was added
		revision: legacy_u_state.revision,
	}

	return [ u_state, t_state ]
}

const migrate_to_3: MigrationStep<[any, any], [any, any]> = () => {
	throw new Error('Schema is too old (pre-beta), can’t migrate!')
}

/////////////////////

export {
	migrate_to_latest,
	MIGRATION_HINTS_FOR_TESTS,
}
