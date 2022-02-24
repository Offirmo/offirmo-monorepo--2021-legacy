import assert from 'tiny-invariant'
import { Immutable, enforce_immutability } from '@offirmo-private/state-utils'
import {
	LastMigrationStep,
	MigrationStep,
	generic_migrate_to_latest,
} from '@offirmo-private/state-utils'

import { LIB, SCHEMA_VERSION } from './consts'
import { State } from './types'
import { SoftExecutionContext } from '../../services/sec'
import { PersistedNotes as FileNotes } from '../file'

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

	assert(
		Object.keys(legacy_state).sort().join(',')
		=== '_comment,encountered_files,known_modifications_new_to_old,last_user_action_tms,revision,schema_version',
		`migrate_to_2x() unexpected keys: ` + Object.keys(legacy_state).sort().join(',')
	)

	let { last_user_action_tms, ...rest } = legacy_state
	let state: StateForMigration = {
		...rest,
		schema_version: 2,
		last_user_investment_tms: last_user_action_tms,
		encountered_files: {}, // temporarily
	}

	Object.keys(legacy_state.encountered_files).forEach(hash => {
		const legacy_file_notes: any = legacy_state.encountered_files[hash]
		const migrated_notes: FileNotes = {
			deleted: undefined,
			starred: undefined,
			manual_date: undefined,
			_bcd_afawk‿symd: undefined,
			_bcd_source: undefined,
			_currently_known_as: '',
			historical: {
				basename: '',
				parent_path: '',
				fs_bcd_tms: 0,
				neighbor_hints: {
					//fs_reliability: 'unknown',
					//parent_folder_bcd: undefined,
				},
				exif_orientation: undefined,
				trailing_extra_bytes_cleaned: undefined,
			},
		}

		let keys = Object.keys(legacy_file_notes)
		if (keys.includes('_currently_known_as')) {
			migrated_notes._currently_known_as = legacy_file_notes._currently_known_as
			keys = keys.filter(k => k !== '_currently_known_as')
		}
		if (keys.includes('currently_known_as')) { // old property name
			migrated_notes._currently_known_as = legacy_file_notes.currently_known_as
			keys = keys.filter(k => k !== 'currently_known_as')
		}
		if (keys.includes('bcd_afawk‿symd')) {
			migrated_notes._bcd_afawk‿symd = legacy_file_notes.bcd_afawk‿symd
			keys = keys.filter(k => k !== 'bcd_afawk‿symd')
		}
		if (keys.includes('_bcd_source')) {
			migrated_notes._bcd_source = legacy_file_notes._bcd_source
			keys = keys.filter(k => k !== '_bcd_source')
		}
		if (keys.includes('renaming_source')) { // old property name
			migrated_notes._bcd_source = legacy_file_notes.renaming_source
			keys = keys.filter(k => k !== 'renaming_source')
		}
		//best_date_afawk_symd

		if (keys.includes('original')) {

			let subkeys = Object.keys(legacy_file_notes.original)
			if (subkeys.includes('basename')) {
				migrated_notes.historical.basename = legacy_file_notes.original.basename
				subkeys = subkeys.filter(k => k !== 'basename')
			}
			if (subkeys.includes('parent_path')) {
				migrated_notes.historical.parent_path = legacy_file_notes.original.parent_path
				subkeys = subkeys.filter(k => k !== 'parent_path')
			}
			if (subkeys.includes('fs_birthtime_ms')) {
				migrated_notes.historical.fs_bcd_tms = legacy_file_notes.original.fs_birthtime_ms
				subkeys = subkeys.filter(k => k !== 'fs_birthtime_ms')
			}
			if (subkeys.includes('exif_orientation')) {
				migrated_notes.historical.exif_orientation = legacy_file_notes.original.exif_orientation
				subkeys = subkeys.filter(k => k !== 'exif_orientation')
			}
			if (subkeys.includes('is_fs_birthtime_assessed_reliable')) {
				switch(legacy_file_notes.original.is_fs_birthtime_assessed_reliable) {
					case undefined:
						// fallthrough
					case 'unknown':
						// leave the field undefined
						break
					case true:
						migrated_notes.historical.neighbor_hints.fs_reliability = 'reliable'
						break
					case false:
						migrated_notes.historical.neighbor_hints.fs_reliability = 'unreliable'
						break
					default:
						throw new Error(`migrate_to_2x() unexpected value "${legacy_file_notes.original.is_fs_birthtime_assessed_reliable}" for legacy_file_notes.original.is_fs_birthtime_assessed_reliable!`)
				}
				subkeys = subkeys.filter(k => k !== 'is_fs_birthtime_assessed_reliable')
			}

			console.assert(
				subkeys.length === 0,
				`migrate_to_2x() unexpected subkey for encountered_files: ${subkeys.join(',')}!`
			)

			keys = keys.filter(k => k !== 'original')
		}

		console.assert(
			keys.length === 0,
			`migrate_to_2x() unexpected key for encountered_files: ${keys.join(',')}!`
		)

		state.encountered_files[hash] = migrated_notes
	})

	return state
}

const migrate_to_1: MigrationStep<StateForMigration, any> = (SEC, legacy_state, hints, next, legacy_schema_version) => {
	throw new Error('migrate_to_1 NIMP!')
}

/////////////////////
