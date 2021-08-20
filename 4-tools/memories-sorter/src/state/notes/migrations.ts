import { Immutable, enforce_immutability } from '@offirmo-private/state-utils'
import {
	LastMigrationStep,
	MigrationStep,
	generic_migrate_to_latest,
} from '@offirmo-private/state-utils'

import { LIB, SCHEMA_VERSION } from './consts'
import { State } from './types'
import { SoftExecutionContext } from '../../services/sec'

// some hints may be needed to migrate to demo state
// need to export them for composing tests
export const MIGRATION_HINTS_FOR_TESTS: any = enforce_immutability<any>({
})

/////////////////////

type StateForMigration = State

export function migrate_to_latest(SEC: SoftExecutionContext, legacy_state: Immutable<any>, hints: Immutable<any> = {}): Immutable<StateForMigration> {
	return generic_migrate_to_latest<StateForMigration>({
		SEC: SEC as any,
		LIB,
		SCHEMA_VERSION,
		legacy_state,
		hints,
		sub_states_migrate_to_latest: {},
		pipeline: [
			migrate_to_2x,
			migrate_to_1,
		]
	})
}

/////////////////////

const migrate_to_2x: LastMigrationStep<StateForMigration, any> = (SEC, legacy_state, hints, next, legacy_schema_version) => {
	//console.log('hello from migrate_to_3x', legacy_state, hints, legacy_schema_version)
	if (legacy_schema_version < 1)
		legacy_state = next(SEC, legacy_state, hints)

	let state: any = {
		...legacy_state,
		schema_version: 2,
	}

	throw new Error('migrate_to_2x NIMP!')

	return state
}

const migrate_to_1: MigrationStep<StateForMigration, any> = (SEC, legacy_state, hints, next, legacy_schema_version) => {
	throw new Error('migrate_to_1 NIMP!')
}

/////////////////////
