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
	/*
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
	*/
})
