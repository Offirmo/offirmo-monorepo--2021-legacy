import { expect } from 'chai'

import { test_migrations } from '@oh-my-rpg/migration-tester'

import { SCHEMA_VERSION } from './consts'
import { migrate_to_latest, MIGRATION_HINTS_FOR_TESTS } from './migrations'
import { create } from './state'
import { DEMO_STATE } from './examples'


describe('@oh-my-rpg/state-prng - schema migration', function() {

	describe('migration of a new state', function() {
		const new_state = create()
		test_migrations({
			//read_only: false, // XXX
			use_hints: false,
			SCHEMA_VERSION,
			LATEST_EXPECTED_DATA: new_state,
			migrate_to_latest: migrate_to_latest,
			absolute_dir_path: require('path').join(__dirname, '../../src/migrations_of_blank_state_specs'),
			describe, context, it, expect,
		})
	})

	describe('migration of an active state', function() {
		test_migrations({
			//read_only: false, // XXX
			use_hints: true,
			SCHEMA_VERSION,
			LATEST_EXPECTED_DATA: DEMO_STATE,
			migration_hints_for_chaining: MIGRATION_HINTS_FOR_TESTS,
			migrate_to_latest: migrate_to_latest,
			absolute_dir_path: require('path').join(__dirname, '../../src/migrations_of_active_state_specs'),
			describe, context, it, expect,
		})
	})
})
