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

	describe('reducers', function() {

		describe('create()', function () {

			it('should NOT infer the date ranges at start (waiting to discriminate from an event and a backup)', () => {
				let state = create('holiday 2018-09-04')

				Object.keys(state.children_bcd_ranges).forEach(_range_key => {
					const range_key = _range_key as any as  keyof State['children_bcd_ranges']
					expect(state.children_bcd_ranges[range_key].begin, `children_bcd_ranges.${range_key}.begin`).to.be.undefined
					expect(state.children_bcd_ranges[range_key].end, `children_bcd_ranges.${range_key}.end`).to.be.undefined
				})
				expect(state.event_range.begin, 'event begin').to.be.undefined
				expect(state.event_range.end, 'event end').to.be.undefined
			})
		})

		describe('on_subfile_found()', function() {

			it('should count non-meta children', () => {
				let state = create('foo')
				expect(state.children_count).to.equal(0)

				state = on_subfile_found(state, File.create('bar.png'))
				expect(state.children_count).to.equal(1)
			})
		})

		describe('on_subfile_primary_infos_gathered()', function () {

			it.only('should gather primary info', async () => {
				let state = create('foo')
				expect(state.children_count).to.equal(0)

				let file_state = await ALL_MEDIA_DEMOS[0].get_state()
				state = on_subfile_found(state, file_state)

				state = on_subfile_primary_infos_gathered(state, file_state)
			})
		})

		describe('on_fs_exploration_done()', function() {

			context('when the folder basename does NOT contains a date', function() {

				it('should NOT init the event range, EVEN if there are children', () => {
					let state = create('foo')

					let subfile_state = File.create('MM20181130.png')
					state = on_subfile_found(state, subfile_state)

					state = on_subfile_primary_infos_gathered(state, subfile_state)
				})
			})

			context('when the folder basename contains a date', function() {

				context('when there are children', function() {

				})

				context('when there are NO children', function() {

					context('when the folder name refers to a backup', function () {

						it('should NOT init the event range')
					})

					context('when the folder name looks like an event', function () {

						it('should init the event range')
					})

				})
			})
		})

		describe('on_subfile_all_infos_gathered()', function() {
			/*
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
			*/
		})
	})
})
