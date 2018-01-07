import { expect } from 'chai'

import { cloneDeep } from 'lodash'
import * as deepFreeze from 'deep-freeze-strict'
import { test_migrations } from "@oh-my-rpg/migration-tester"

import { SCHEMA_VERSION } from './consts'
import { migrate_to_latest } from './migrations'
import { State } from './types'
import { get_SEC } from './sec'

import { create, DEMO_STATE, OLDEST_LEGACY_STATE_FOR_TESTS, MIGRATION_HINTS_FOR_TESTS } from './state'

describe('⚔ 👑 😪  The Boring RPG - schema migration', function() {

	describe('migration of an active savegame', function() {
		test_migrations({
			use_hints: true,
			//read_only: false, // XXX
			migration_hints_for_chaining: MIGRATION_HINTS_FOR_TESTS,
			SCHEMA_VERSION,
			LATEST_EXPECTED_DATA: DEMO_STATE,
			migrate_to_latest: migrate_to_latest.bind(null, get_SEC()),
			absolute_dir_path: require('path').join(__dirname, '../../src/migrations_of_active_state_specs'),
			expect, context, it,
		})
	})

	describe('migration of a new savegame', function() {
		test_migrations({
			use_hints: false,
			//read_only: false, // XXX
			SCHEMA_VERSION,
			LATEST_EXPECTED_DATA: create(),
			migrate_to_latest: migrate_to_latest.bind(null, get_SEC()),
			absolute_dir_path: require('path').join(__dirname, '../../src/migrations_of_blank_state_specs'),
			expect, context, it,
		})
	})
})
