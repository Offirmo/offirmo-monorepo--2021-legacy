import { expect } from 'chai'

import { LIB } from './consts'

import {
	get_schema_version,
	get_schema_version_loose,
	get_revision,
	get_revision_loose,
} from './selectors'

import {
	DEMO_USTATE,
	DEMO_BASE_STATE,
	DEMO_BASE_STATE_WITH_SUBS,
	DEMO_TSTATE,
	DEMO_ROOT_STATE,
} from './_test_helpers'
import {get_semantic_difference} from './comparators'


describe(`${LIB} - selectors`, function() {

	describe('get_schema_version()', function() {

		describe('on a NON WithSchemaVersion', function() {
			it('should throw', () => {
				expect(
					// @ts-expect-error
					() => get_schema_version({ foo: 42 })
				).to.throw()
			})
		})

		describe('on WithSchemaVersion', function() {
			it('should work on correct data', () => {
				expect(get_schema_version({ schema_version: 33})).to.equal(33)
			})
		})

		describe('on a BaseState', function() {

			it('should work on correct data', () => {
				expect(get_schema_version(DEMO_BASE_STATE)).to.equal(DEMO_BASE_STATE.schema_version)
				expect(get_schema_version(DEMO_ROOT_STATE.u_state)).to.equal(DEMO_ROOT_STATE.u_state.schema_version)
				expect(get_schema_version(DEMO_ROOT_STATE.t_state)).to.equal(DEMO_ROOT_STATE.t_state.schema_version)
			})
		})

		describe('on an bundled U+T state', function() {

			it('should work on special aggregated data', () => {
				expect(get_schema_version([DEMO_USTATE, DEMO_TSTATE])).to.equal(DEMO_USTATE.schema_version)
				expect(get_schema_version([DEMO_USTATE, DEMO_TSTATE])).to.equal(DEMO_TSTATE.schema_version)
			})

			it('should throw on non-matching', () => {
				expect(
					// @ts-expect-error
					() => get_schema_version([])
				).to.throw()

				expect(
					() => get_schema_version([DEMO_TSTATE, DEMO_USTATE])
				).to.throw()

				expect(
					// @ts-expect-error
					() => get_schema_version([DEMO_USTATE, DEMO_TSTATE, DEMO_USTATE])
				).to.throw()
			})

			it('should throw on misaligned', () => {
				expect(
					() => get_schema_version([DEMO_USTATE, {
						...DEMO_TSTATE,
						schema_version: 99,
					}])
				).to.throw()
			})
		})

		describe('on a root state', function() {

			it('should work on correct data', () => {
				expect(get_schema_version(DEMO_ROOT_STATE)).to.equal(DEMO_ROOT_STATE.schema_version)
			})

			it('should throw when any U/T schemas is mismatching', () => {
				expect(() => get_schema_version({
					...DEMO_ROOT_STATE,
					u_state: {
						...DEMO_ROOT_STATE.u_state,
						schema_version: 99,
					}
				})).to.throw()

				expect(() => get_schema_version({
					...DEMO_ROOT_STATE,
					t_state: {
						...DEMO_ROOT_STATE.t_state,
						schema_version: 99,
					}
				})).to.throw()
			})
		})
	})

	describe('get_schema_version_loose()', function() {

		it('should work on non matching', () => {
			expect(get_schema_version_loose(undefined)).to.equal(0)
			expect(get_schema_version_loose(null)).to.equal(0)
			expect(get_schema_version_loose(0)).to.equal(0)
			expect(get_schema_version_loose(new Error('Test!'))).to.equal(0)
		})

		it('should work on nominal correct data', () => {
			expect(get_schema_version_loose({ schema_version: 33})).to.equal(33)
			expect(get_schema_version_loose(DEMO_ROOT_STATE)).to.equal(DEMO_ROOT_STATE.schema_version)
			expect(get_schema_version_loose(DEMO_ROOT_STATE.t_state)).to.equal(DEMO_ROOT_STATE.t_state.schema_version)
			expect(get_schema_version_loose(DEMO_USTATE)).to.equal(DEMO_USTATE.schema_version)
			expect(get_schema_version_loose(DEMO_BASE_STATE_WITH_SUBS.subA)).to.equal(DEMO_BASE_STATE_WITH_SUBS.subA.schema_version)
		})

		it('should work on special aggregated data, even when old', () => {
			expect(get_schema_version_loose([DEMO_USTATE, DEMO_TSTATE] as any)).to.equal(DEMO_USTATE.schema_version)
			expect(get_schema_version_loose([{ schema_version: 33}, null])).to.equal(33)
		})
	})

	describe('get_revision()', function() {

		it('should work on correct data', () => {
			expect(get_revision({ revision: 33 })).to.equal(33)
			expect(get_revision(DEMO_ROOT_STATE.t_state)).to.equal(DEMO_ROOT_STATE.t_state.revision)
			expect(get_revision(DEMO_USTATE)).to.equal(DEMO_USTATE.revision)
			expect(get_revision(DEMO_BASE_STATE_WITH_SUBS.subA)).to.equal(DEMO_BASE_STATE_WITH_SUBS.subA.revision)
		})

		it('should throw on non-matching', () => {
			expect(
				// @ts-expect-error
				() => get_revision({ foo: 42 })
			).to.throw()
		})
	})

	describe('get_revision_loose()', function () {

		it('should work on correct data', () => {
			expect(get_revision_loose({ revision: 33 })).to.equal(33)
			expect(get_revision_loose(DEMO_ROOT_STATE.t_state)).to.equal(DEMO_ROOT_STATE.t_state.revision)
			expect(get_revision_loose(DEMO_USTATE)).to.equal(DEMO_USTATE.revision)
			expect(get_revision_loose(DEMO_BASE_STATE_WITH_SUBS.subA)).to.equal(DEMO_BASE_STATE_WITH_SUBS.subA.revision)
		})

		it('should return 0 on non-matching', () => {
			// @ts-expect-error
			expect(get_revision_loose({ foo: 42 })).to.equal(0)
		})
	})
})
