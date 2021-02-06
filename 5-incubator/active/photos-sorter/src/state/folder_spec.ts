import { expect } from 'chai'

import { LIB } from '../consts'
import {
	State,

	is_current_basename_intentful,
	get_ideal_basename,
	get_depth,

	create,
	on_subfile_found,
	on_dated_subfile_found,
} from './folder'

import {
	get_MEDIA_DEMO_01
} from '../__test_shared/real_files'

/////////////////////

describe(`${LIB} - folder state`, function() {

	describe('selectors', function() {

		describe('get_ideal_basename', function () {

			it('should work', () => {
				type TCIdeal = { [k: string]: string }
				const TEST_CASES: TCIdeal = {
					'foo': '20001231 - foo',
					'20140803 - holidays': '20140803 - holidays',
					'- inbox': '- inbox',
					'20011125 - 00- voyage à Paris - 2001': '20011125 - 00- voyage à Paris - 2001' // explicit date + unicode (seen BUG strange unicode destruction)
				}
				Object.keys(TEST_CASES).forEach(tc => {
					let state: State = create(tc)
					if (!state.event_begin_date_symd)
						state.event_begin_date_symd = state.event_end_date_symd = 20001231
					//console.log(state)
					expect(get_ideal_basename(state), tc).to.equal(TEST_CASES[tc])
				})
			})

			it('should priorise explicit event date over basename hint', () => {
				let state: State = create('20140803 - holidays')
				//console.log(state)
				state.event_begin_date_symd = state.event_end_date_symd = 20001231
				//console.log(state)
				expect(get_ideal_basename(state)).to.equal('20001231 - holidays')
			})

			it('should work -- manual test for bug', () => {
				let state: State = create('20011125 - 00- voyage à Paris - 2001')
				//console.log(state)
				expect(get_ideal_basename(state)).to.equal('20011125 - 00- voyage à Paris - 2001')
			})
		})

		describe('get_depth()', function() {

			it('should work', () => {
				type TCIdeal = { [k: string]: number }
				const TEST_CASES: TCIdeal = {
					'.': 0,
					'foo': 0,
					'foo/bar': 1,
					'foo bar/baz ho ho/ ho': 2,
				}
				Object.keys(TEST_CASES).forEach(tc => {
					let state: State = create(tc)
					expect(get_depth(state), tc).to.equal(TEST_CASES[tc])
				})
			})
		})
	})

	describe('reducers', function() {

		describe('create()', function () {

			it('should infer the date ranges', () => {
				let state = create('holiday 2018-09-04')
				expect(state.children_begin_date_symd, 'children begin').to.be.undefined
				expect(state.children_end_date_symd, 'children end').to.be.undefined
				expect(state.event_begin_date_symd, 'inferred event begin').to.equal(20180904)
				expect(state.event_end_date_symd, 'inferred event end').to.equal(20180904)
			})
		})

		describe('on_dated_subfile_found()', function () {
			before(() => get_MEDIA_DEMO_01())

			context('when no event range', function() {

				it('should set the date range', async () => {
					let state = create('foo')

					let file_state = await get_MEDIA_DEMO_01()
					state = on_subfile_found(state, file_state)
					state = on_dated_subfile_found(state, file_state)

					expect(state.type).to.equal('event')
					expect(state.children_begin_date_symd, 'inferred children begin').to.equal(20180903)
					expect(state.children_end_date_symd, 'inferred children end').to.equal(20180903)
					expect(state.event_begin_date_symd).to.equal(20180903)
					expect(state.event_end_date_symd).to.equal(20180903)
				})
			})

			context('when existing event range', function() {

				it('should extend the event begin date', async () => {
					let state = create('holiday 20180904')
					expect(state.event_begin_date_symd, 'inferred event begin').to.equal(20180904)
					expect(state.event_end_date_symd, 'inferred event end').to.equal(20180904)

					let file_state = await get_MEDIA_DEMO_01()
					state = on_subfile_found(state, file_state)
					state = on_dated_subfile_found(state, file_state)

					expect(state.type).to.equal('event')
					expect(state.children_begin_date_symd, 'children begin').to.equal(20180903)
					expect(state.children_end_date_symd, 'children end').to.equal(20180903)
					expect(state.event_begin_date_symd).to.equal(20180903)
					expect(state.event_end_date_symd).to.equal(20180904)
				})

				it('should NOT extend the begin date range if the folder name is clear on the begin date', async () => {
					let state = create('20180904 - holiday')
					expect(state.event_begin_date_symd).to.equal(20180904)
					expect(state.event_end_date_symd).to.equal(20180904)
					expect(is_current_basename_intentful(state)).to.be.true

					let file_state = await get_MEDIA_DEMO_01()
					state = on_subfile_found(state, file_state)
					state = on_dated_subfile_found(state, file_state)

					expect(state.type).to.equal('event')
					expect(state.event_begin_date_symd).to.equal(20180904)
					expect(state.event_end_date_symd).to.equal(20180904)
				})

				it('should extend the end date range', async () => {
					let state = create('20180902 - holiday')
					expect(state.event_begin_date_symd).to.equal(20180902)
					expect(state.event_end_date_symd).to.equal(20180902)

					let file_state = await get_MEDIA_DEMO_01()
					state = on_subfile_found(state, file_state)
					state = on_dated_subfile_found(state, file_state)

					expect(state.type).to.equal('event')
					expect(state.event_begin_date_symd).to.equal(20180902)
					expect(state.event_end_date_symd).to.equal(20180903)
				})
			})

			context('when the range gets too big', function() {

				context('when not intentful', function() {

					it('should demote', async () => {
						let state = create('holiday 20180704')

						let file_state = await get_MEDIA_DEMO_01()
						state = on_subfile_found(state, file_state)
						state = on_dated_subfile_found(state, file_state)

						expect(state.type).to.equal('unknown') // demoted
						expect(state.children_begin_date_symd, 'children begin').to.equal(20180903)
						expect(state.children_end_date_symd, 'children end').to.equal(20180903)
						expect(state.event_begin_date_symd).to.be.undefined
						expect(state.event_end_date_symd).to.be.undefined
					})
				})

				context('when intentful', function() {

					it('should not demote but cap the range', async () => {
						let state = create('20180704 - holiday')

						let file_state = await get_MEDIA_DEMO_01()
						state = on_subfile_found(state, file_state)
						state = on_dated_subfile_found(state, file_state)

						expect(state.type).to.equal('event')
						expect(state.event_begin_date_symd).to.equal(20180704)
						expect(state.event_end_date_symd).to.equal(20180801)
					})
				})
			})
		})
	})
})
