const { expect } = require('chai')

const { LIB } = require('../../consts')
const { itㆍshouldㆍmigrateㆍcorrectly } = require('../..')


describe(`${LIB} - example usage`, function() {
	const SCHEMA_VERSION = 3

	function migrate_to_latest(state) {
		if (state.schema_version > SCHEMA_VERSION)
			throw new Error('More recent version!')
		if (((state || {}).schema_version || 0) < SCHEMA_VERSION) {
			state = {
				...state,
				schema_version: 3,
			}
		}
		return state
	}

	describe('migration of a new state', function () {
		const LATEST_EXPECTED_DATA = { schema_version: 3, foo: 42 }

		itㆍshouldㆍmigrateㆍcorrectly({
			use_hints: false,
			//can_update_snapshots: true, // uncomment when updating
			SCHEMA_VERSION,
			LATEST_EXPECTED_DATA,
			migrate_to_latest,
			absolute_dir_path: require('path').join(__dirname, './migrations_of_blank_state_specs'),
			describe, context, it, expect,
		})
	})

	describe('migration of an existing state', function () {
		const LATEST_EXPECTED_DATA = { schema_version: 3, foo: 144 }

		itㆍshouldㆍmigrateㆍcorrectly({
			use_hints: true,
			//can_update_snapshots: true, // uncomment when updating
			SCHEMA_VERSION,
			LATEST_EXPECTED_DATA,
			migrate_to_latest,
			absolute_dir_path: require('path').join(__dirname, './migrations_of_active_state_specs'),
			describe, context, it, expect,
		})
	})
})
