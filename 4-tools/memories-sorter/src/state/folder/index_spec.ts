import { expect } from 'chai'

import { LIB } from '../../consts'
import {
	State,
	is_current_basename_intentful_of_event_start,
	get_ideal_basename,
	get_depth,
	create,
	on_subfile_found,
	on_subfile_primary_infos_gathered,
} from '.'
import * as File from '../file'

import { ALL_MEDIA_DEMOS } from '../../__test_shared/real_files'
import {
	has_all_infos_for_extracting_the_creation_date,
	on_info_read__exif,
	on_info_read__fs_stats,
	on_info_read__hash, on_info_read__current_neighbors_primary_hints, on_notes_recovered,
} from '../file'

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
					'20011125 - 00- voyage à Paris - 2001': '20011125 - x00- voyage à Paris - 2001' // explicit date + unicode (seen BUG strange unicode destruction) + "x" protection needed
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

			it('should work -- manual test for bug -- 01', () => {
				let state: State = create('20011125 - 00- voyage à Paris - 2001')
				//console.log(state)
				expect(get_ideal_basename(state)).to.equal('20011125 - x00- voyage à Paris - 2001')
			})

			it('should work -- manual test for bug -- 02', () => {
				let state: State = create('01- St. Nicolas')

				let subfile_state = File.create('foo 20011206.png')
				subfile_state = on_info_read__hash(subfile_state, '1234')
				subfile_state = on_info_read__fs_stats(subfile_state, {
					birthtimeMs: 1234567890,
					atimeMs:     1234567890,
					mtimeMs:     1234567890,
					ctimeMs:     1234567890,
				})
				subfile_state = on_info_read__current_neighbors_primary_hints(subfile_state, null, 'unknown')

				subfile_state = on_notes_recovered(subfile_state, null)

				state = on_subfile_primary_infos_gathered(state, subfile_state)
				//console.log(state)
				expect(get_ideal_basename(state)).to.equal('20011206 - x01- St. Nicolas')
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

		describe('on_subfile_primary_infos_gathered()', function () {
			//before(() => ALL_MEDIA_DEMOS[0].get_state())

			context('when no event range', function() {

				it('should set the date range', async () => {
					let state = create('foo')

					let file_state = await ALL_MEDIA_DEMOS[0].get_state()
					state = on_subfile_found(state, file_state)
					state = on_subfile_primary_infos_gathered(state, file_state)

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

					let file_state = await ALL_MEDIA_DEMOS[0].get_state()
					state = on_subfile_found(state, file_state)
					state = on_subfile_primary_infos_gathered(state, file_state)

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
					expect(is_current_basename_intentful_of_event_start(state)).to.be.true

					let file_state = await ALL_MEDIA_DEMOS[0].get_state()
					state = on_subfile_found(state, file_state)
					state = on_subfile_primary_infos_gathered(state, file_state)

					expect(state.type).to.equal('event')
					expect(state.event_begin_date_symd).to.equal(20180904)
					expect(state.event_end_date_symd).to.equal(20180904)
				})

				it('should extend the end date range', async () => {
					let state = create('20180902 - holiday')
					expect(state.event_begin_date_symd).to.equal(20180902)
					expect(state.event_end_date_symd).to.equal(20180902)

					let file_state = await ALL_MEDIA_DEMOS[0].get_state()
					state = on_subfile_found(state, file_state)
					state = on_subfile_primary_infos_gathered(state, file_state)

					expect(state.type).to.equal('event')
					expect(state.event_begin_date_symd).to.equal(20180902)
					expect(state.event_end_date_symd).to.equal(20180903)
				})
			})

			context('when the range gets too big', function() {

				context('when not intentful', function() {

					it('should demote', async () => {
						let state = create('holiday 20180704')

						let file_state = await ALL_MEDIA_DEMOS[0].get_state()
						state = on_subfile_found(state, file_state)
						state = on_subfile_primary_infos_gathered(state, file_state)

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

						let file_state = await ALL_MEDIA_DEMOS[0].get_state()
						state = on_subfile_found(state, file_state)
						state = on_subfile_primary_infos_gathered(state, file_state)

						expect(state.type).to.equal('event')
						expect(state.event_begin_date_symd).to.equal(20180704)
						expect(state.event_end_date_symd).to.equal(20180801)
					})
				})
			})
		})
	})
})
