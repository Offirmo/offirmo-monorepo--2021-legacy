import { Immutable, enforce_immutability } from '@offirmo-private/state-utils'
import { LastMigrationStep, MigrationStep, generic_migrate_to_latest } from '@offirmo-private/state-utils'

import { LIB, SCHEMA_VERSION } from './consts'
import { UState, TState } from './types'
import { OMRSoftExecutionContext } from './sec'

// some hints may be needed to migrate to demo state
// need to export them for composing tests
const MIGRATION_HINTS_FOR_TESTS: any = enforce_immutability<any>({
})

/////////////////////

type StateForMigration = [UState, TState]

function migrate_to_latest(SEC: OMRSoftExecutionContext, legacy_state: Readonly<any>, hints: Readonly<any> = {}): Immutable<StateForMigration> {
	return generic_migrate_to_latest<StateForMigration>({
		SEC: SEC as any,

		LIB,
		SCHEMA_VERSION,
		legacy_state,
		hints,
		sub_states_migrate_to_latest: {},

		pipeline: [
			migrate_to_4x,
			migrate_to_3,
		]
	})
}

/////////////////////

const migrate_to_4x: LastMigrationStep<StateForMigration, [any, any]> = (SEC, legacy_state, hints, previous, legacy_schema_version) => {
	//console.log('hello from migrate_to_4x', legacy_state, hints, previous, legacy_schema_version)
	if (legacy_schema_version < 3)
		legacy_state = previous(SEC, legacy_state, hints)

	let [ u_state, t_state ] = legacy_state
	u_state = {
		...u_state,
		schema_version: 4,
	}
	t_state = {
		...t_state,
		schema_version: 4,

		// this field was added
		revision: u_state.revision,
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
