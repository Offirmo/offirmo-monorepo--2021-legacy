import { expect } from 'chai'

import { LIB } from './consts'

import {
	get_schema_version,
	get_schema_version_loose,
	get_revision,
	get_revision_loose,
	get_timestamp,
	get_timestamp_loose,
	get_base_loose,
} from './selectors'

import {
	DEMO_USTATE,
	DEMO_BASE_STATE,
	DEMO_BASE_STATE_WITH_SUBS,
	DEMO_TSTATE,
	DEMO_ROOT_STATE,
} from './_test_helpers'


describe(`${LIB} - selectors`, function() {

	describe('get_schema_version()', function() {

		describe('on a NON WithSchemaVersion', function() {
			it('should typecheck and throw', () => {
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

			it('should typecheck and throw on non-matching', () => {
				expect(
					// @ts-expect-error
					() => get_schema_version([])
				).to.throw()

				expect(
					// @ts-expect-error
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
				expect(get_schema_version(DEMO_ROOT_STATE)).to.equal(DEMO_ROOT_STATE.u_state.schema_version)
			})

			it('should typecheck and throw on non-matching', () => {
				expect(
					// @ts-expect-error
					() => get_schema_version({})
				).to.throw()

				expect(
					// @ts-expect-error
					() => get_schema_version({ u_state: DEMO_TSTATE, t_state: DEMO_USTATE})
				).to.throw()

				expect(
					// @ts-expect-error
					() => get_schema_version({ u_state: DEMO_USTATE })
				).to.throw()
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
			// @ts-expect-error
			expect(get_schema_version_loose(undefined)).to.equal(0)
			// @ts-expect-error
			expect(get_schema_version_loose(null)).to.equal(0)
			// @ts-expect-error
			expect(get_schema_version_loose(0)).to.equal(0)
			// @ts-expect-error
			expect(get_schema_version_loose(new Error('Test!'))).to.equal(0)
		})

		it('should work on nominal correct data', () => {
			expect(get_schema_version_loose({ schema_version: 33})).to.equal(33)
			expect(get_schema_version_loose(DEMO_ROOT_STATE)).to.equal(DEMO_ROOT_STATE.u_state.schema_version)
			expect(get_schema_version_loose(DEMO_ROOT_STATE.t_state)).to.equal(DEMO_ROOT_STATE.t_state.schema_version)
			expect(get_schema_version_loose(DEMO_USTATE)).to.equal(DEMO_USTATE.schema_version)
			expect(get_schema_version_loose(DEMO_BASE_STATE_WITH_SUBS.subA)).to.equal(DEMO_BASE_STATE_WITH_SUBS.subA.schema_version)
		})

		it('should work on special aggregated data, even when old', () => {
			expect(get_schema_version_loose([DEMO_USTATE, DEMO_TSTATE] as any)).to.equal(DEMO_USTATE.schema_version)
			// @ts-expect-error
			expect(get_schema_version_loose([{ schema_version: 33}, null])).to.equal(33)
		})
	})

	describe('get_revision()', function() {

		it('should work on correct data', () => {
			expect(get_revision({ revision: 33 })).to.equal(33)
			expect(get_revision(DEMO_ROOT_STATE)).to.equal(
				DEMO_ROOT_STATE.u_state.revision + DEMO_ROOT_STATE.t_state.revision
			)
			expect(get_revision([
				DEMO_ROOT_STATE.u_state,
				DEMO_ROOT_STATE.t_state
			])).to.equal(
				DEMO_ROOT_STATE.u_state.revision + DEMO_ROOT_STATE.t_state.revision
			)
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
			expect(get_revision_loose(DEMO_ROOT_STATE)).to.equal(
				DEMO_ROOT_STATE.u_state.revision + DEMO_ROOT_STATE.t_state.revision
			)
			expect(get_revision_loose([
				DEMO_ROOT_STATE.u_state,
				DEMO_ROOT_STATE.t_state
			])).to.equal(
				DEMO_ROOT_STATE.u_state.revision + DEMO_ROOT_STATE.t_state.revision
			)
			expect(get_revision_loose(DEMO_ROOT_STATE.t_state)).to.equal(DEMO_ROOT_STATE.t_state.revision)
			expect(get_revision_loose(DEMO_USTATE)).to.equal(DEMO_USTATE.revision)
			expect(get_revision_loose(DEMO_BASE_STATE_WITH_SUBS.subA)).to.equal(DEMO_BASE_STATE_WITH_SUBS.subA.revision)
		})

		it('should return 0 on non-matching', () => {
			// @ts-expect-error
			expect(get_revision_loose({ foo: 42 })).to.equal(0)
		})
	})

	describe('get_timestamp()', function() {

		describe('on a NON WithTimestamp', function() {
			it('should throw', () => {
				expect(
					// @ts-expect-error
					() => get_timestamp({ foo: 42 })
				).to.throw()
			})
		})

		describe('on WithTimestamp', function() {
			it('should work on correct data', () => {
				expect(get_timestamp({ timestamp_ms: 33})).to.equal(33)
			})
		})

		describe('on a BaseState', function() {

			it('should throw', () => {
				expect(
					// @ts-expect-error
					() => get_timestamp(DEMO_BASE_STATE)
				).to.throw()
			})
		})

		describe('on an bundled U+T state', function() {

			it('should work on special aggregated data', () => {
				expect(get_timestamp([DEMO_USTATE, DEMO_TSTATE])).to.equal(DEMO_TSTATE.timestamp_ms)
			})

			it('should throw on non-matching', () => {
				expect(
					// @ts-expect-error
					() => get_timestamp([])
				).to.throw()

				expect(
					// @ts-expect-error
					() => get_timestamp([DEMO_TSTATE, DEMO_USTATE])
				).to.throw()

				expect(
					// @ts-expect-error
					() => get_timestamp([DEMO_USTATE, DEMO_TSTATE, DEMO_USTATE])
				).to.throw()
			})
		})

		describe('on a root state', function() {

			it('should work on correct data', () => {
				expect(get_timestamp(DEMO_ROOT_STATE)).to.equal(DEMO_ROOT_STATE.t_state.timestamp_ms)
			})
		})
	})

	describe('get_timestamp_loose()', function () {

		it('should work on correct data', () => {
			expect(get_timestamp_loose({ timestamp_ms: 33 })).to.equal(33)
			expect(get_timestamp_loose(DEMO_ROOT_STATE)).to.equal(DEMO_ROOT_STATE.t_state.timestamp_ms)
			expect(get_timestamp_loose([
				DEMO_ROOT_STATE.u_state,
				DEMO_ROOT_STATE.t_state
			])).to.equal(
				DEMO_ROOT_STATE.t_state.timestamp_ms
			)
			expect(get_timestamp_loose(DEMO_ROOT_STATE.t_state)).to.equal(DEMO_ROOT_STATE.t_state.timestamp_ms)
		})

		it('should return 0 on non-matching', () => {
			// @ts-expect-error
			expect(get_timestamp_loose({ foo: 42 })).to.equal(0)
			expect(get_timestamp_loose(DEMO_USTATE)).to.equal(0)
			expect(get_timestamp_loose(DEMO_BASE_STATE_WITH_SUBS.subA)).to.equal(0)
		})
	})

	describe('get_base_loose()', function() {

		it('should work', () => {
			// @ts-expect-error
			expect(get_base_loose(undefined), 'undefined')
				.to.deep.equal(undefined)

			// @ts-expect-error
			expect(get_base_loose(null), 'null')
				.to.deep.equal(null)

			// @ts-expect-error
			expect(get_base_loose('foo'), 'string')
				.to.deep.equal('[not a state! string]')

			// @ts-expect-error
			expect(get_base_loose({ revision: 33 }))
				.to.deep.equal({
					schema_version: 0,
					revision: 33,
					last_user_investment_tms: 0,
					timestamp_ms: 0,
				})

			// @ts-expect-error
			expect(get_base_loose({ schema_version: 33 }))
				.to.deep.equal({
					schema_version: 33,
					revision: 0,
					last_user_investment_tms: 0,
					timestamp_ms: 0,
				})

			expect(get_base_loose(DEMO_USTATE), 'DEMO_USTATE')
				.to.deep.equal({
					schema_version: 5,
					revision: 24,
					last_user_investment_tms: 0,
					timestamp_ms: 0,
				})

			expect(get_base_loose(DEMO_TSTATE), 'DEMO_TSTATE')
				.to.deep.equal({
					schema_version: 5,
					revision: 12,
					last_user_investment_tms: 0,
					timestamp_ms: 1234567890,
				})

			expect(get_base_loose(DEMO_ROOT_STATE), 'DEMO_ROOT_STATE')
				.to.deep.equal({
					schema_version: 8,
					revision: 136,
					last_user_investment_tms: 1234567890,
					timestamp_ms: 1234567890,
				})
		})
	})
})
