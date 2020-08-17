import { expect } from 'chai'

import { LIB } from './consts'

import {
	get_schema_version,
	get_schema_version_loose,
	get_revision,
} from './selectors'

import {
	BASE_EXAMPLE,
	ROOT_EXAMPLE,
} from './_test_helpers'


describe(`${LIB} - selectors`, function() {

	describe('get_schema_version()', function() {
		it('should work on correct data', () => {
			expect(get_schema_version({ schema_version: 33})).to.equal(33)
			expect(get_schema_version(ROOT_EXAMPLE)).to.equal(10)
			expect(get_schema_version(ROOT_EXAMPLE.t_state)).to.equal(3)
			expect(get_schema_version(BASE_EXAMPLE)).to.equal(8)
			expect(get_schema_version(BASE_EXAMPLE.sub1)).to.equal(4)
		})

		it('should throw on non-matching', () => {
			const DATA = { foo: 42 }

			expect(
				// @ts-expect-error
				() => get_schema_version(DATA)
			).to.throw()
		})
	})

	describe('get_schema_version_loose()', function() {
		it('should work on non matching', () => {
			expect(get_schema_version_loose(undefined)).to.equal(0)
			expect(get_schema_version_loose(null)).to.equal(0)
			expect(get_schema_version_loose(0)).to.equal(0)
			expect(get_schema_version_loose(new Error('Test!'))).to.equal(0)
		})

		it('should work on correct data', () => {
			expect(get_schema_version({ schema_version: 33})).to.equal(33)
			expect(get_schema_version_loose(ROOT_EXAMPLE)).to.equal(10)
			expect(get_schema_version_loose(ROOT_EXAMPLE.t_state)).to.equal(3)
			expect(get_schema_version_loose(BASE_EXAMPLE)).to.equal(8)
			expect(get_schema_version_loose(BASE_EXAMPLE.sub1)).to.equal(4)
		})
	})

	describe('get_revision()', function() {
		it('should work on correct data', () => {
			expect(get_revision(ROOT_EXAMPLE.t_state)).to.equal(0)
			expect(get_revision(BASE_EXAMPLE)).to.equal(103)
			expect(get_revision(BASE_EXAMPLE.sub1)).to.equal(45)
		})

		it('should throw on non-matching', () => {
			const DATA = { foo: 42 }

			expect(
				// @ts-expect-error
				() => get_revision(DATA)
			).to.throw()
		})
	})
})
