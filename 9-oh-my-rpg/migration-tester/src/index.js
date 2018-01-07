'use strict';

const path = require('path')
const { cloneDeep } = require('lodash')
const prettyjson = require('prettyjson')

const HINTS_FILENAME = 'hints_for_chaining.json'


function prettify_json(data) {
	if (!data) return String(data)

	return prettyjson.render(data, {
		keysColor: 'dim',
	})
}

function is_uuid_valid(uuid) {
	return (typeof uuid === 'string') && uuid.length === 24
}

const jsondiffpatch = require('jsondiffpatch').create({
	// used to match objects when diffing arrays, by default only === operator is used
	objectHash: function(obj) {
		return JSON.stringify(obj)
	},
	propertyFilter: function(name, context) {
		// this optional function can be specified to ignore object properties (eg. volatile data)
		// name: property name, present in either context.left or context.right objects
		// context: the diff context (has context.left and context.right objects)
		if (name === 'uuid' && is_uuid_valid(context.right.uuid) && is_uuid_valid(context.left.uuid)) {
			// ignore
			return false
		}

		return true
	},
	cloneDiffValues: true /* default false. if true, values in the obtained delta will be cloned
      (using jsondiffpatch.clone by default), to ensure delta keeps no references to left or right objects.
      This becomes useful if you're diffing and patching the same objects multiple times without serializing deltas.
      instead of true, a function can be specified here to provide a custom clone(value)
      */
});


const { get_human_readable_UTC_timestamp_minutes } = require('@oh-my-rpg/definitions')
const fs = require('./utils-fs')


function test_migrations({
	use_hints = false,
	read_only = true,
	migration_hints_for_chaining = undefined,
	SCHEMA_VERSION,
	LATEST_EXPECTED_DATA,
	migrate_to_latest,
	absolute_dir_path,
	expect, context, it,
}) {
	console.log(`[MT] migration tester: ${path.basename(absolute_dir_path)}...`)

	// early tests, always valid
	describe.only('data migration', function() {

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
				expect(LATEST_EXPECTED_DATA.schema_version).to.equal(SCHEMA_VERSION) // make sure our tests are up to date
				expect(migrate_to_latest(cloneDeep(LATEST_EXPECTED_DATA))).to.deep.equal(LATEST_EXPECTED_DATA)
			})
		})

		/////// validate params
		if ((function validateParams() {

			// validate SCHEMA_VERSION
			if (!SCHEMA_VERSION) return true // unit tests above will catch this

			// validate LATEST_EXPECTED_DATA
			if (LATEST_EXPECTED_DATA.schema_version !== SCHEMA_VERSION)
				return true // unit tests above will catch this

			const LATEST_EXPECTED_DATA_migrated_diff = jsondiffpatch.diff(
				migrate_to_latest(cloneDeep(LATEST_EXPECTED_DATA)),
				LATEST_EXPECTED_DATA,
			)
			if (!!LATEST_EXPECTED_DATA_migrated_diff) {
				// this error will be caught by the test, but we display the diff to help:
				console.log('TODO display diff')
				return true
			}
		})()) return

		/////// grab the files
		const HINTS_PATH = path.join(absolute_dir_path, HINTS_FILENAME)

		const all_files = fs.lsFiles(absolute_dir_path).sort()
			.filter(snap_path => !snap_path.startsWith('.')) // skip .DS_STORE and like
			.map(snap_path => path.join(absolute_dir_path, snap_path))

		const all_snapshots = all_files
			.filter(snap_path => snap_path !== HINTS_PATH)

		console.log('[MT] Found snapshots:\n' + prettify_json(all_snapshots.map(p => path.basename(p))))


		/////// create hints file if requested and not present
		migration_hints_for_chaining = (function generateAndUpdateHints(hints_from_params) {
			if (!use_hints)
				return undefined

			if (hints_from_params) {
				console.log(`[MT] using hints, provided from params ✔`)
				return hints_from_params
			}

			let hints = all_files.find(snap_path => snap_path === HINTS_PATH)
				? fs.json.readSync(HINTS_PATH)
				: {}

			// update the structure
			for( let i = 1; i <= SCHEMA_VERSION; ++i) {
				const key = `to_v${i}`
				hints[key] = hints[key] || {}
			}
			if (!read_only)
				fs.json.writeSync(HINTS_PATH, hints)

			console.log(`[MT] using hints, provided from a file ✔`)
			return hints
		})(migration_hints_for_chaining)

		/////// create / update latest file if allowed / not present
		;(function createOrUpdateLatestIfAllowed() {

			let latest_snapshot_path = all_files.slice(-1)[0]

			let latest_snapshot_data = latest_snapshot_path
				? fs.json.readSync(latest_snapshot_path)
				: undefined

			if (latest_snapshot_data) console.log(`[MT] found latest snapshot data ✔`)
			//console.log(`[MT] latest_snapshot_data:`, prettify_json(latest_snapshot_data))

			const latest_migrated_diff = jsondiffpatch.diff(
				LATEST_EXPECTED_DATA,
				latest_snapshot_data,
			)

			const latest_snapshot_data_matches_latest_expected_data = typeof latest_migrated_diff === 'undefined'

			if (latest_snapshot_data_matches_latest_expected_data)
				return

			if (latest_snapshot_path)
				console.log(`Current latest snapshot is not up to date. Difference with previous:`, prettify_json(latest_migrated_diff))
			else
				console.log(`[MT] Current latest, up-to-date data is missing.`)

			if (read_only)
				throw new Error('Current latest, up-to-date data is not up to date!')

			// create a new snapshot with the new expected data
			const name = get_human_readable_UTC_timestamp_minutes() + '.json'
			console.log(`[MT] Creating a new data snapshot: ${name}.`)
			fs.json.writeSync(path.join(absolute_dir_path, name), LATEST_EXPECTED_DATA)
		})()

		all_snapshots.forEach(snapshot_path => {
			const LEGACY_DATA = fs.json.readSync(snapshot_path)

			context(`when the version is outdated: v${LEGACY_DATA.schema_version} from ${path.basename(snapshot_path)}`, function () {

				it('should migrate it to the latest version', () => {
					const migrated_data = migrate_to_latest(LEGACY_DATA, migration_hints_for_chaining)

					// JSON diff / patch is slightly more powerful,
					// here configured to ignore uuids if valids
					// so we pre-compare
					if (jsondiffpatch.diff(LATEST_EXPECTED_DATA, migrated_data)) {
						expect(migrated_data).to.deep.equal(LATEST_EXPECTED_DATA)
					}
				})
			})
		})
	})
}


module.exports = {
	test_migrations,
}
