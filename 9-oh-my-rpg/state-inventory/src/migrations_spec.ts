import { expect } from 'chai'

import { cloneDeep } from 'lodash'
import * as deepFreeze from 'deep-freeze-strict'

import { SCHEMA_VERSION } from './consts'
import { migrate_to_latest } from './migrations'
import { State } from './types'
import { DEMO_STATE, OLDEST_LEGACY_STATE_FOR_TESTS, MIGRATION_HINTS_FOR_TESTS } from './state'

const DATA_v0: any = OLDEST_LEGACY_STATE_FOR_TESTS
const DATA_OLDEST = DATA_v0

const DATA_v1: any = DEMO_STATE

const DATA_LATEST = DEMO_STATE as State


describe('📦 📦 📦  Inventory state - schema migration', function() {

	context('when the version is more recent', function() {

		it('should throw with a meaningful error', () => {
			function load() {
				migrate_to_latest({ schema_version: 99999 })
			}
			expect(load).to.throw('more recent version')
		})
	})

	context('when the version is up to date', function() {

		it('should return the state without change', () => {
			expect(DATA_LATEST.schema_version).to.equal(SCHEMA_VERSION) // make sure our tests are up to date
			expect(migrate_to_latest(cloneDeep(DATA_LATEST))).to.deep.equal(DATA_LATEST)
		})
	})

	context('when the version is outdated', function() {

		it('should migrate to latest version', () => {
			expect(migrate_to_latest(cloneDeep(DATA_OLDEST), MIGRATION_HINTS_FOR_TESTS)).to.deep.equal(DATA_LATEST)
		})
	})

	describe('individual migration functions', function() {

		describe(`1 to latest`, function() {
			it('should work', () => {
				expect(migrate_to_latest(cloneDeep(DATA_v1), MIGRATION_HINTS_FOR_TESTS)).to.deep.equal(DATA_LATEST)
			})
		})

		describe(`0 to latest`, function() {
			it('should work', () => {
				expect(migrate_to_latest(cloneDeep(DATA_v0), MIGRATION_HINTS_FOR_TESTS)).to.deep.equal(DATA_LATEST)
			})
		})
	})
})
