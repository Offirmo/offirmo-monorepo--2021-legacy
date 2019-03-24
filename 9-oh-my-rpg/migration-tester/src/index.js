'use strict'

const path = require('path')
const { cloneDeep } = require('lodash')
const prettify_json = require('@offirmo/prettify-json').default
const { get_human_readable_UTC_timestamp_minutes } = require('@offirmo/timestamps')
const { LIB, HINTS_FILENAME } = require('./consts')
const fs = require('./utils-fs')
const base_diff_json = require('./json-diff')


function test_migrations({
	use_hints = false,
	read_only = true,
	migration_hints_for_chaining = undefined,
	SCHEMA_VERSION,
	LATEST_EXPECTED_DATA,
	migrate_to_latest,
	absolute_dir_path,
	advanced_diff_json = undefined,
	describe, context, it, expect,
	skip = false, // allow skipping the test, like it.skip
}) {
	const LOG_PREFIX = `[${LIB} - ${path.basename(absolute_dir_path)}]`
	console.log(`${LOG_PREFIX} building unit tests...`)
	if (read_only)
		console.log(`${LOG_PREFIX} note: read-only, will only report errors`)
	else
		console.log(`${LOG_PREFIX} note: write enabled, will attempt to create/update data`)
	if (skip)
		console.log(`${LOG_PREFIX} note: skip mode, will do the minimum`)

	// propagate the skip
	describe = skip ? describe.skip.bind(describe) : describe
	//it = skip ? it.skip.bind(it) : it

	function diff_json(a, b) {
		let diff = base_diff_json(a, b)
		if (!diff) return

		if (advanced_diff_json) {
			diff = advanced_diff_json(a, b, {
				diff_json: base_diff_json,
				prettify_json,
				diff,
			})
			if (!Object.keys(diff).length)
				diff = undefined
		}

		return diff
	}

	// early tests, always valid
	describe(`[${LIB} - automatically generated tests]`, function() {

		context('when the schema version is more recent', function () {

			it('should throw with a meaningful error', () => {
				function load() {
					migrate_to_latest({schema_version: 99999})
				}

				expect(load).to.throw('more recent version')
			})
		})

		context('when the schema version is up to date', function () {

			it('should return the state without change', () => {
				try {
					expect(LATEST_EXPECTED_DATA.schema_version).to.equal(SCHEMA_VERSION) // make sure our tests are up to date
					expect(migrate_to_latest(cloneDeep(LATEST_EXPECTED_DATA))).to.deep.equal(LATEST_EXPECTED_DATA)
				}
				catch (err) {
					err.message = err.message + ` [${LIB} hint: check param LATEST_EXPECTED_DATA]`
					throw err
				}
			})
		})

		/////// validate params before continuing further
		if (!(function validate_params() {
			if (skip)
				return true // allow outdated tests to pass

			console.log(`${LOG_PREFIX} validating params...`)

			// validate SCHEMA_VERSION
			if (!SCHEMA_VERSION) return false // unit tests above will catch this

			// validate LATEST_EXPECTED_DATA
			if (LATEST_EXPECTED_DATA.schema_version !== SCHEMA_VERSION)
				return false // unit tests above will catch this

			const LATEST_EXPECTED_DATA_migrated_diff = base_diff_json(
				migrate_to_latest(cloneDeep(LATEST_EXPECTED_DATA)),
				LATEST_EXPECTED_DATA,
			)
			if (LATEST_EXPECTED_DATA_migrated_diff) {
				// this error will be caught by the test, but we display the diff to help:
				console.error(`${LOG_PREFIX} ✖ LATEST_EXPECTED_DATA is not up to date! Difference when migrated:\n`, prettify_json(LATEST_EXPECTED_DATA_migrated_diff))
				return false
			}

			console.log(`${LOG_PREFIX} params OK ✔`)
			return true
		})()) {
			console.warn(`${LOG_PREFIX} bad params, see unit tests failures ✖`)
		}

		/////// grab the files = past snapshots and hints
		if (!read_only)
			fs.mkdirpSync(absolute_dir_path)

		try {
			fs.lsFiles(absolute_dir_path)
		}
		catch (err) {
			if (skip) return
			throw err
		}

		const ALL_FILES = fs.lsFiles(absolute_dir_path)
			.filter(snap_path => !snap_path.startsWith('.')) // skip .DS_STORE and like
			.filter(snap_path => snap_path.endsWith('.json')) // allows README :)
			.sort()
			.map(snap_path => path.join(absolute_dir_path, snap_path))

		// note: may not exist
		const HINTS_FILE = path.join(absolute_dir_path, HINTS_FILENAME)

		const ALL_SNAPSHOTS = ALL_FILES
			.filter(snap_path => snap_path !== HINTS_FILE)

		if (ALL_SNAPSHOTS.length === 0 && !read_only) {
			// create one

		}

		console.log(`${LOG_PREFIX} Found snapshots:\n` + prettify_json(ALL_SNAPSHOTS.map(p => path.basename(p))))

		/////// create hints file if requested and not present
		migration_hints_for_chaining = (function generate_and_update_hints(hints_from_params) {
			if (!use_hints)
				return undefined

			if (hints_from_params) {
				console.log(`${LOG_PREFIX} using hints, provided from params ✔`)
				return hints_from_params
			}

			let hints = ALL_FILES.find(snap_path => snap_path === HINTS_FILE)
				? fs.json.readSync(HINTS_FILE)
				: {}

			// create/update the structure (in memory)
			for( let i = 1; i <= SCHEMA_VERSION; ++i) {
				const key = `to_v${i}`
				hints[key] = hints[key] || {}
			}
			// persist the creation/update
			if (!read_only)
				fs.json.writeSync(HINTS_FILE, hints)

			console.log(`${LOG_PREFIX} using hints, provided from a file ✔`)
			return hints
		})(migration_hints_for_chaining)

		/////// create / update latest file if allowed / not present
		;(function create_or_update_latest_if_allowed() {
			if (skip) return

			let latest_snapshot_path = ALL_SNAPSHOTS.slice(-1)[0]

			let latest_snapshot_data = latest_snapshot_path
				? fs.json.readSync(latest_snapshot_path)
				: undefined

			if (latest_snapshot_data) console.log(`${LOG_PREFIX} found latest snapshot data ✔`)
			//console.log(`${LOG_PREFIX} latest_snapshot_data:`, prettify_json(latest_snapshot_data))

			const latest_migrated_diff = diff_json(
				LATEST_EXPECTED_DATA,
				latest_snapshot_data,
			)

			const latest_snapshot_data_matches_latest_expected_data = typeof latest_migrated_diff === 'undefined'
			if (latest_snapshot_data_matches_latest_expected_data)
				return

			if (latest_snapshot_path)
				console.log(`${LOG_PREFIX} ✖ Current latest snapshot is not up to date. Difference with previous:\n`, prettify_json(latest_migrated_diff))
			else
				console.log(`${LOG_PREFIX} ✖ Current latest, up-to-date data is missing.`)

			if (read_only)
				throw new Error(`${LOG_PREFIX} ✖ Current latest, up-to-date data is not up to date!`)

			// create a new snapshot with the new expected data
			const name = get_human_readable_UTC_timestamp_minutes() + '.json'
			console.log(`${LOG_PREFIX} Creating a new data snapshot: ${name}.`)
			fs.json.writeSync(path.join(absolute_dir_path, name), LATEST_EXPECTED_DATA)
		})()

		ALL_SNAPSHOTS.forEach(snapshot_path => {
			const LEGACY_DATA = fs.json.readSync(snapshot_path)

			context(`when the version is outdated: v${LEGACY_DATA.schema_version} from ${path.basename(snapshot_path)}`, function () {

				it('should migrate it to the latest version', () => {
					try {
						const migrated_data = migrate_to_latest(LEGACY_DATA, migration_hints_for_chaining)

						// JSON diff / patch is slightly more powerful,
						// here configured to ignore uuids if valids
						// so we pre-compare
						if (diff_json(LATEST_EXPECTED_DATA, migrated_data)) {
							expect(migrated_data).to.deep.equal(LATEST_EXPECTED_DATA)
						}
					} catch (err) {
						err.message = err.message + ` [${LIB} hint: check file ${path.basename(snapshot_path)}]`
						throw err
					}
				})
			})
		})
	})
}

// emulate describe.skip
test_migrations.skip = function(options) {
	return test_migrations({
		...options,
		skip: true,
	})
}

module.exports = {
	test_migrations,
}
