import {
	Immutable,
	enforce_immutability,
	LastMigrationStep,
	MigrationStep,
	SubStatesMigrations,
	CleanupStep,
	generic_migrate_to_latest,
} from '@offirmo-private/state-utils'
import { SoftExecutionContext } from '../sec'

import { LIB, SCHEMA_VERSION } from '../consts'
import { State } from '../types'

/////////////////////

// some hints may be needed to migrate to demo state
// need to export them for composing tests
export const MIGRATION_HINTS_FOR_TESTS: any = enforce_immutability<any>({
})

export function migrate_to_latest(SEC: SoftExecutionContext, legacy_state: Immutable<any>, hints: Immutable<any> = {}): Immutable<State> {
	return generic_migrate_to_latest<State>({
		SEC: SEC as any,
		LIB,
		SCHEMA_VERSION,
		legacy_state,
		hints,
		sub_states_migrate_to_latest: {},
		pipeline: [
			migrate_to_1x,
		]
	})
}

export const cleanup: CleanupStep<State> = (SEC, state, hints) => {
	return state
}

/////////////////////

const migrate_to_1x: LastMigrationStep<State, any> = (SEC, legacy_state, hints, next, legacy_schema_version) => {
	return legacy_state
}

/////////////////////
