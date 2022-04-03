import { expect } from 'chai'

import { LIB } from '../../consts'
import { ALL_MEDIA_DEMOS } from '../../__test_shared/real_files'
import * as File from '../file'

import {
	State,
} from './types'
import {
	create,
	on_subfile_found,
	on_subfile_primary_infos_gathered,
	on_fs_exploration_done,
	on_all_infos_gathered,
} from './reducers'

import './__test_shared'



/////////////////////

describe(`${LIB} - folder state`, function() {

	describe('reducers', function() {

		describe('create()', function () {

			it('should work', () => {
				create('holiday 2018-09-04')
			})

			it('should initialize children ranges to undefined', () => {
				let state = create('holiday 2018-09-04')

				Object.keys(state.media_children_bcd_ranges).forEach(_range_key => {
					const range_key = _range_key as any as  keyof State['media_children_bcd_ranges']
					expect(state.media_children_bcd_ranges[range_key], `media_children_bcd_ranges.${range_key}`).to.be.undefined
				})
			})
		})

		describe('on_subfile_found()', function() {

			it('should count non-meta children', () => {
				let state = create('foo')
				expect(state.media_children_count).to.equal(0)

				state = on_subfile_found(state, File.create('bar.png'))
				expect(state.media_children_count).to.equal(1)
			})
		})

		describe('on_subfile_primary_infos_gathered()', function () {

			it('should aggregate primary info', async () => {
				let state = create('foo')

				let file_state = await ALL_MEDIA_DEMOS[0].get_phase1_state()
				state = on_subfile_found(state, file_state)
				expect(state.media_children_pass_1_count).to.equal(0)
				expect(state.media_children_fs_reliability_count).to.deep.equal({ unknown: 0, unreliable: 0, reliable: 0 })

				state = on_subfile_primary_infos_gathered(state, file_state)
				expect(state.media_children_pass_1_count).to.equal(1)
				// in whatever combination:
				expect(state.media_children_fs_reliability_count.unknown).to.be.at.least(0)
				expect(state.media_children_fs_reliability_count.unreliable).to.be.at.least(0)
				expect(state.media_children_fs_reliability_count.reliable).to.be.at.least(0)
				expect(
					state.media_children_fs_reliability_count.unknown
					+ state.media_children_fs_reliability_count.unreliable
					+ state.media_children_fs_reliability_count.reliable
				).to.deep.equal(1)

				expect(state.media_children_bcd_ranges.from_fsⵧcurrent?.begin).to.be.ok
				expect(state.media_children_bcd_ranges.from_fsⵧcurrent?.end).to.be.ok
				expect(state.media_children_bcd_ranges.from_primaryⵧcurrentⵧphase_1?.begin).to.be.ok
				expect(state.media_children_bcd_ranges.from_primaryⵧcurrentⵧphase_1?.end).to.be.ok
			})
		})

		describe('on_fs_exploration_done()', function() {

			context('when there are NO children', function() {

				it('should work', () => {
					let state = create('holiday 2018-09-04')
					state = on_fs_exploration_done(state)
				})

				it('should initialize children ranges to null', () => {
					let state = create('holiday 2018-09-04')
					state = on_fs_exploration_done(state)

					Object.keys(state.media_children_bcd_ranges).forEach(_range_key => {
						const range_key = _range_key as any as  keyof State['media_children_bcd_ranges']
						expect(state.media_children_bcd_ranges[range_key], `media_children_bcd_ranges.${range_key}`).to.be.null
					})
				})
			})

			context('when there are children', function() {

				// nothing valuable to test
			})
		})

		describe('on_subfile_all_infos_gathered()', function() {
			/*
			context('when no event range', function() {

				it('should set the date range', async () => {
					let state = create('foo')

					let file_state = await ALL_MEDIA_DEMOS[0].get_phase1_state()
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

					let file_state = await ALL_MEDIA_DEMOS[0].get_phase1_state()
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

					let file_state = await ALL_MEDIA_DEMOS[0].get_phase1_state()
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

					let file_state = await ALL_MEDIA_DEMOS[0].get_phase1_state()
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

						let file_state = await ALL_MEDIA_DEMOS[0].get_phase1_state()
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

						let file_state = await ALL_MEDIA_DEMOS[0].get_phase1_state()
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

		describe('on_all_infos_gathered()', function() {

			context('when there are NO children', function() {

				it('should work', () => {
					let state = create('holiday 2018-09-04')
					state = on_fs_exploration_done(state)
					state = on_all_infos_gathered(state)
				})

				it('should do nothing', () => {
					let state = create('holiday 2018-09-04')
					state = on_fs_exploration_done(state)
					const state_after = on_all_infos_gathered(state)
					expect(state_after).to.equal(state)
				})
			})

			context('when there are children', function() {

				context('when the event range is too big', function () {

					it('should demote to unknown')
				})
			})
		})
	})
})
