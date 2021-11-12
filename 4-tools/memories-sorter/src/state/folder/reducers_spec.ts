import { expect } from 'chai'

import { LIB } from '../../consts'
import { ALL_MEDIA_DEMOS } from '../../__test_shared/real_files'
import * as File from '../file'

import {
	State,
} from './types'
import {
	is_current_basename_intentful_of_event_start,
	get_ideal_basename,
	get_depth,
	get_event_range,
	get_event_begin_date‿symd,
	get_event_end_date‿symd,
} from './selectors'
import {
	create,
	on_subfile_found,
	on_subfile_primary_infos_gathered,
	on_fs_exploration_done,
} from './reducers'

import './__test_shared'



/////////////////////

describe(`${LIB} - folder state`, function() {

	describe('reducers', function() {

		describe('create()', function () {

			it('should NOT infer the date ranges at start (waiting to discriminate from an event and a backup)', () => {
				let state = create('holiday 2018-09-04')

				Object.keys(state.children_bcd_ranges).forEach(_range_key => {
					const range_key = _range_key as any as  keyof State['children_bcd_ranges']
					expect(state.children_bcd_ranges[range_key], `children_bcd_ranges.${range_key}`).to.be.undefined
				})
				expect(get_event_range(state), 'event range').not.to.be.ok
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

			it('should aggregate primary info', async () => {
				let state = create('foo')

				let file_state = await ALL_MEDIA_DEMOS[0].get_phase1_state()
				state = on_subfile_found(state, file_state)
				expect(state.children_pass_1_count).to.equal(0)
				expect(state.children_fs_reliability_count).to.deep.equal({ unknown: 0, unreliable: 0, reliable: 0 })

				state = on_subfile_primary_infos_gathered(state, file_state)
				expect(state.children_pass_1_count).to.equal(1)
				// in whatever combination:
				expect(state.children_fs_reliability_count.unknown).to.be.at.least(0)
				expect(state.children_fs_reliability_count.unreliable).to.be.at.least(0)
				expect(state.children_fs_reliability_count.reliable).to.be.at.least(0)
				expect(
					state.children_fs_reliability_count.unknown
					+ state.children_fs_reliability_count.unreliable
					+ state.children_fs_reliability_count.reliable
				).to.deep.equal(1)

				expect(state.children_bcd_ranges.from_fsⵧcurrent?.begin).to.be.ok
				expect(state.children_bcd_ranges.from_fsⵧcurrent?.end).to.be.ok
				expect(state.children_bcd_ranges.from_primaryⵧcurrentⵧphase_1?.begin).to.be.ok
				expect(state.children_bcd_ranges.from_primaryⵧcurrentⵧphase_1?.end).to.be.ok
			})
		})

		describe('on_fs_exploration_done()', function() {

			context('when the folder basename does NOT contains a date', function() {

				it('should NOT yield an event range (YET), EVEN if there are children', async () => {
					let state = create('foo')

					let file_state = await ALL_MEDIA_DEMOS[0].get_phase1_state()
					state = on_subfile_found(state, file_state)
					state = on_subfile_primary_infos_gathered(state, file_state)

					state = on_fs_exploration_done(state)
					expect(get_event_range(state), 'event range').not.to.be.ok
				})
			})

			context('when the folder basename contains a date', function() {

				context('when there are children', function() {

					context('when the cross-referencing hints at a backup', function () {

						it('should NOT yield an event range', async () => {
							let state = create('2018-11-23 iphone 12')

							expect(ALL_MEDIA_DEMOS[0].data.DATE__COMPACT).to.equal(20180903) // precondition for the test
							let file_state = await ALL_MEDIA_DEMOS[0].get_phase1_state()
							state = on_subfile_found(state, file_state)
							state = on_subfile_primary_infos_gathered(state, file_state)

							state = on_fs_exploration_done(state)
							expect(get_event_range(state), 'event range').not.to.be.ok
						})
					})

					context('when the cross-referencing hints at an event', function () {

						it.only('should yield an event range starting with the basename date', async () => {
							let state = create('holidays in cool place 2018-09-03')

							expect(ALL_MEDIA_DEMOS[0].data.DATE__COMPACT).to.equal(20180903) // precondition for the test
							let file_state = await ALL_MEDIA_DEMOS[0].get_phase1_state()
							state = on_subfile_found(state, file_state)
							state = on_subfile_primary_infos_gathered(state, file_state)

							state = on_fs_exploration_done(state)
							expect(get_event_range(state), 'event range').to.be.ok
							expect(get_event_begin_date‿symd(state)).to.equal(20180903)
							expect(get_event_end_date‿symd(state)).to.equal(20180903)
						})
					})
				})

				context('when there are NO children', function() {

					context('when the folder name refers to a backup', function () {

						it('should NOT init the event range', async () => {
							let state = create('20181105 - backup iphone')

							state = on_fs_exploration_done(state)
							expect(get_event_range(state), 'event range').to.be.undefined
						})
					})

					context('when the folder name looks like an event', function () {

						it('should init the event range', async () => {
							let state = create('20180903 - some holiday')

							state = on_fs_exploration_done(state)
							expect(get_event_range(state), 'event range').to.be.ok
							expect(get_event_begin_date‿symd(state)).to.equal(20180903)
							expect(get_event_end_date‿symd(state)).to.equal(20180903)
						})
					})
				})
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
	})
})
