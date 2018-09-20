import { expect } from 'chai'

import { test_migrations } from '@oh-my-rpg/migration-tester'

import { SCHEMA_VERSION } from './consts'
import { migrate_to_latest } from './migrations'
import { get_lib_SEC } from './sec'

import { create } from './state'
import { DEMO_STATE, MIGRATION_HINTS_FOR_TESTS } from './examples'

describe('schema migration', function() {

	describe('migration of an existing state', function() {
		// TODO ALPHA remove skip
		test_migrations.skip({
			use_hints: true,
			//read_only: false, // XXX
			migration_hints_for_chaining: MIGRATION_HINTS_FOR_TESTS,
			SCHEMA_VERSION,
			LATEST_EXPECTED_DATA: DEMO_STATE,
			migrate_to_latest: migrate_to_latest.bind(null, get_lib_SEC()),
			absolute_dir_path: require('path').join(__dirname, '../../src/migrations_of_active_state_specs'),
			describe, context, it, expect,
		})
	})

	describe('migration of a new state', function() {
		const new_state = create()
		// alter seed to avoid migration
		new_state.prng.seed = 1234 // should match blank state spec
		// TODO ALPHA remove skip
		test_migrations.skip({
			use_hints: false,
			//read_only: false, // XXX
			SCHEMA_VERSION,
			LATEST_EXPECTED_DATA: new_state,
			migrate_to_latest: migrate_to_latest.bind(null, get_lib_SEC()),
			absolute_dir_path: require('path').join(__dirname, '../../src/migrations_of_blank_state_specs'),
			describe, context, it, expect,
		})
	})
})
