import { expect } from 'chai'

import { LIB } from '../../consts'
import {
	create_better_date_obj,
	_get_exif_datetime,
	create_better_date_from_symd,
	get_human_readable_timestamp_auto,
} from '../../services/better-date'

import { State } from './types'
import {
	create,
	on_fs_exploration_done,
	on_subfile_all_infos_gathered,
	on_subfile_found,
	on_subfile_primary_infos_gathered,
} from './reducers'

import {
	get_ideal_basename,
	get_depth,
	get_event_begin_date_from_basename_if_present_and_confirmed_by_other_sources,
	get_event_range,
	get_event_begin_date‿symd,
	get_event_end_date‿symd,
	is_looking_like_a_backup,
	to_string,
	get_neighbor_primary_hints,
	get_tz,
} from './selectors'
import * as File from '../file/index'
import './__test_shared'
import { ALL_MEDIA_DEMOS } from '../../__test_shared/real_files'
import { get_test_single_file_state_generator } from '../../__test_shared/utils'
import * as BetterDateLib from '../../services/better-date'

/////////////////////

describe(`${LIB} - folder state`, function() {

	describe('selectors', function() {

		describe('get_event_begin_date_from_basename_if_present_and_confirmed_by_other_sources()', function() {

			context('when the folder basename does NOT contains a date', function() {

				context('when there are children', function () {

					it('should NOT yield an event range', async () => {
						let state = create('2014-541')

						let file_state = await ALL_MEDIA_DEMOS[0].get_phase1_state()
						state = on_subfile_found(state, file_state)
						state = on_subfile_primary_infos_gathered(state, file_state)

						state = on_fs_exploration_done(state)

						const begin_date = get_event_begin_date_from_basename_if_present_and_confirmed_by_other_sources(state)
						expect(begin_date).to.be.null
					})
				})

				context('when there are NO children', function () {

					it('should NOT yield an event range', () => {
						let state = create('2014-541')
						state = on_fs_exploration_done(state)

						const begin_date = get_event_begin_date_from_basename_if_present_and_confirmed_by_other_sources(state)
						expect(begin_date).to.be.null
					})
				})
			})

			context('when the folder basename contains a date', function() {

				it('should properly detect events when basename is clear', () => {
					let state = create('20140803 - holidays')
					state = on_fs_exploration_done(state)

					const begin_date = get_event_begin_date_from_basename_if_present_and_confirmed_by_other_sources(state)
					expect(begin_date).not.to.be.null
					expect(get_human_readable_timestamp_auto(begin_date!, 'tz:embedded')).to.equal('2014-08-03')
				})

				it('should properly detect backups when basename is clear', () => {
					let state = create('20140803 - BackuP ')
					state = on_fs_exploration_done(state)

					let begin_date = get_event_begin_date_from_basename_if_present_and_confirmed_by_other_sources(state)
					expect(begin_date).to.be.null

					state = create('20140803 - SauveGarde ')
					state = on_fs_exploration_done(state)

					begin_date = get_event_begin_date_from_basename_if_present_and_confirmed_by_other_sources(state)
					expect(begin_date).to.be.null

					state = create('20140803 - imPort')
					state = on_fs_exploration_done(state)

					begin_date = get_event_begin_date_from_basename_if_present_and_confirmed_by_other_sources(state)
					expect(begin_date).to.be.null
				})

				it('should cross-reference with children when basename is unclear -- no children', () => {
					let state = create('holidays 2014-08-03')
					state = on_fs_exploration_done(state)

					const begin_date = get_event_begin_date_from_basename_if_present_and_confirmed_by_other_sources(state)
					expect(begin_date).not.to.be.null
					expect(get_human_readable_timestamp_auto(begin_date!, 'tz:embedded')).to.equal('2014-08-03')
				})

				it('should cross-reference with children when basename is unclear -- children hints at event', async () => {
					let state = create('holidays 2018-09-01')

					let file_state = await ALL_MEDIA_DEMOS[0].get_phase1_state() // REM date = 2018-09-03_20h46m14 GMT+8
					state = on_subfile_found(state, file_state)
					state = on_subfile_primary_infos_gathered(state, file_state)
					state = on_fs_exploration_done(state)

					const begin_date = get_event_begin_date_from_basename_if_present_and_confirmed_by_other_sources(state)
					expect(begin_date).not.to.be.null
					expect(get_human_readable_timestamp_auto(begin_date!, 'tz:embedded')).to.equal('2018-09-01')
				})

				it('should cross-reference with children when basename is unclear -- children hints at backup', async () => {
					let state = create('2018-10-31')

					let file_state = await ALL_MEDIA_DEMOS[0].get_phase1_state() // REM date = 2018-09-03_20h46m14 GMT+8
					state = on_subfile_found(state, file_state)
					state = on_subfile_primary_infos_gathered(state, file_state)

					state = on_fs_exploration_done(state)

					const begin_date = get_event_begin_date_from_basename_if_present_and_confirmed_by_other_sources(state)
					expect(begin_date).to.be.null // since the basename date is unrelated to the range start
				})

				it('should cross-reference with children when basename is unclear -- children hints unclear', async () => {
					let state = create('2015-08-03')

					let file_state_1 = await ALL_MEDIA_DEMOS[0].get_phase1_state() // REM date = 2018-09-03_20h46m14 GMT+8
					state = on_subfile_found(state, file_state_1)
					state = on_subfile_primary_infos_gathered(state, file_state_1)
					let file_state_2 = await ALL_MEDIA_DEMOS[1].get_phase1_state() // REM date =  2002-01-26_16h05m50
					state = on_subfile_found(state, file_state_2)
					state = on_subfile_primary_infos_gathered(state, file_state_2)

					state = on_fs_exploration_done(state)

					// keep the folder as event
					const begin_date = get_event_begin_date_from_basename_if_present_and_confirmed_by_other_sources(state)
					expect(begin_date, 'begin date').not.to.be.null
					expect(get_human_readable_timestamp_auto(begin_date!, 'tz:embedded')).to.equal('2015-08-03')
				})
			})
		})

		describe('is_current_basename_intentful_of_event_start()', function() {
			// implicitly tested through get_event_begin_date_from_basename_if_present_and_confirmed_by_other_sources()
		})

		describe('get_event_range() + is_looking_like_a_backup()', function() {

			context('when called too early', function () {

				// changed 2022 after realizing that new folders can be created during the sorting phase
				// on_fs_exploration_done() won't be called for those folders, it should still work
				it('should NOT complain', () => {
					let state = create('holiday 2018-09-04')

					expect(() => get_event_range(state)).not.to.throw()
				})
			})

			context('when the folder basename does NOT contains a date', function() {

				context('when there are children', function() {

					it('should yield an event range corresponding to the children range', async () => {
						let state = create('foo')

						let file_state_01 = await ALL_MEDIA_DEMOS[0].get_phase1_state()
						/*console.log(file_state_01.current_exif_data!.SourceFile)
						console.log((() => {
							const m = get_best_creation_dateⵧfrom_current_data‿meta(file_state_01)
							return {
								...m,
								candidate: get_debug_representation(m.candidate)
							}
						})())*/
						state = on_subfile_found(state, file_state_01)
						state = on_subfile_primary_infos_gathered(state, file_state_01)

						let file_state_02 = await ALL_MEDIA_DEMOS[0].get_phase1_state()
						//console.log(file_state_02.current_exif_data!.SourceFile, file_state_02.current_exif_data)
						file_state_02 = {
							...file_state_02,
							current_exif_data: {
								SourceFile: 'alt-' + file_state_02.current_exif_data!.SourceFile, // REM exif date is memoized against the sourcefile
								CreationDate: _get_exif_datetime(create_better_date_obj({
									year: 2018,
									month: 9,
									day: 5,
									hour: 9,
									minute: 50,
									second: 14,
									milli: 123,
									tz: 'tz:auto',
								}))
							} as any,
						}
						/*console.log((() => {
							const m = get_best_creation_dateⵧfrom_current_data‿meta(file_state_02)
							return {
								...m,
								candidate: get_debug_representation(m.candidate)
							}
						})())*/
						state = on_subfile_found(state, file_state_02)
						state = on_subfile_primary_infos_gathered(state, file_state_02)

						state = on_fs_exploration_done(state)

						expect(is_looking_like_a_backup(state), 'is_looking_like_a_backup').to.be.false
						expect(get_event_range(state), 'event range').to.be.ok
						expect(get_event_begin_date‿symd(state)).to.equal(20180903)
						expect(get_event_end_date‿symd(state)).to.equal(20180905)
					})

					context('when the children range is too big', function () {

						it('should throw', async () => {
							let state = create('foo')

							let file_state_01 = await ALL_MEDIA_DEMOS[0].get_phase1_state()
							state = on_subfile_found(state, file_state_01)
							state = on_subfile_primary_infos_gathered(state, file_state_01)

							let file_state_02 = await ALL_MEDIA_DEMOS[1].get_phase1_state()
							state = on_subfile_found(state, file_state_02)
							state = on_subfile_primary_infos_gathered(state, file_state_02)

							state = on_fs_exploration_done(state)

							expect(is_looking_like_a_backup(state), 'is_looking_like_a_backup').to.be.false
							expect(() => get_event_range(state)).to.throw('too big')
						})
					})
				})

				context('when there are NO children', function() {

					it('should NOT yield an event range', async () => {
						let state = create('foo')
						state = on_fs_exploration_done(state)

						expect(is_looking_like_a_backup(state), 'is_looking_like_a_backup').to.be.false
						expect(get_event_range(state), 'event range').not.to.be.ok
					})
				})
			})

			context('when the folder basename contains a date', function() {

				context('when there are children', function() {

					context('when the cross-referencing is NOT trustable -- fs 1970', function () {

						it('should NOT interpret it as a backup', async () => {

							let state = create('2018-11-23 holiday')

							let stategen = get_test_single_file_state_generator()
							stategen.inputs.dateⵧfsⵧcurrent‿tms = 1234 // precondition for the test
							let file_state = stategen.get_phase1_state()
							state = on_subfile_found(state, file_state)
							state = on_subfile_primary_infos_gathered(state, file_state)
							state = on_fs_exploration_done(state)

							expect(is_looking_like_a_backup(state), 'is_looking_like_a_backup').to.be.false
							expect(get_event_range(state), 'event range').to.be.ok
						})
					})

					context('when the cross-referencing hints at a backup', function () {

						it('should NOT yield an event range', async () => {
							let state = create('2018-11-23 iphone 12')

							expect(ALL_MEDIA_DEMOS[0].data.DATE__COMPACT).to.equal(20180903) // precondition for the test
							let file_state = await ALL_MEDIA_DEMOS[0].get_phase1_state()
							state = on_subfile_found(state, file_state)
							state = on_subfile_primary_infos_gathered(state, file_state)
							state = on_fs_exploration_done(state)

							expect(is_looking_like_a_backup(state), 'is_looking_like_a_backup').to.be.true
							expect(get_event_range(state), 'event range').not.to.be.ok
						})
					})

					context('when the cross-referencing hints at an event', function () {

						it('should yield an event range starting with the basename date', async () => {
							let state = create('holidays in cool place 2018-09-03')

							expect(ALL_MEDIA_DEMOS[0].data.DATE__COMPACT, 'precondition').to.equal(20180903) // precondition for the test
							let file_state = await ALL_MEDIA_DEMOS[0].get_phase1_state()
							state = on_subfile_found(state, file_state)
							state = on_subfile_primary_infos_gathered(state, file_state)
							state = on_fs_exploration_done(state)

							const hints = get_neighbor_primary_hints(state)
							expect(hints.tz, 'tz in hints').to.equal('Asia/Shanghai') // aggregated from the file
							file_state = File.on_info_read__current_neighbors_primary_hints(file_state, hints)
							file_state = File.on_notes_recovered(file_state, null)
							expect(File.get_best_tz(file_state), 'tz from file').to.equal('Asia/Shanghai') // embedded in the file
							expect(BetterDateLib.get_embedded_timezone(File.get_best_creation_date(file_state)), 'tz from file bcd').to.equal('Asia/Shanghai') // embedded in the file

							state = on_subfile_all_infos_gathered(state, file_state)
							expect(get_tz(state, 'fallback:resolved_auto'), 'aggregated tz').to.equal('Asia/Shanghai') // aggregated from the file

							expect(is_looking_like_a_backup(state), 'is_looking_like_a_backup').to.be.false
							expect(get_event_range(state), 'event range').to.be.ok
							expect(get_event_begin_date‿symd(state), 'begin').to.equal(20180903)
							expect(get_event_end_date‿symd(state), 'end').to.equal(20180903)
						})

						context('when the children range is too big', function () {

							it('should cap the event range', async () => {
								let state = create('something 2002-01-02')

								expect(ALL_MEDIA_DEMOS[0].data.DATE__COMPACT).to.equal(20180903) // precondition for the test
								let file_state = await ALL_MEDIA_DEMOS[0].get_phase1_state()
								state = on_subfile_found(state, file_state)
								state = on_subfile_primary_infos_gathered(state, file_state)

								state = on_fs_exploration_done(state)

								expect(is_looking_like_a_backup(state), 'is_looking_like_a_backup').to.be.false
								expect(get_event_range(state), 'event range').to.be.ok
								expect(get_event_begin_date‿symd(state)).to.equal(20020102)
								expect(get_event_end_date‿symd(state)).to.equal(20020130)
							})
						})
					})
				})

				context('when there are NO children', function() {

					context('when the folder name refers to a backup', function () {

						it('should NOT init the event range', async () => {
							let state = create('20181105 - backup iphone')
							state = on_fs_exploration_done(state)

							expect(is_looking_like_a_backup(state), 'is_looking_like_a_backup').to.be.true
							expect(get_event_range(state), 'event range').not.to.be.ok
						})
					})

					context('when the folder name looks like an event', function () {

						it('should init the event range with the max range duration (catch all for other pics)', async () => {
							let state = create('20180903 - some holiday')
							state = on_fs_exploration_done(state)

							expect(is_looking_like_a_backup(state), 'is_looking_like_a_backup').to.be.false
							expect(get_event_range(state), 'event range').to.be.ok
							expect(get_event_begin_date‿symd(state)).to.equal(20180903)
							expect(get_event_end_date‿symd(state)).to.equal(20181001)
						})
					})
				})
			})
		})

		describe('get_ideal_basename()', function () {

			type TCIdeal = { [k: string]: string }
			const TEST_CASES: TCIdeal = {
				'foo':   '20001231 - foo',
				'20140803 - holidays':    '20140803 - holidays',
				'- inbox':   '- inbox',
				'20011125 - 00- voyage à Paris - 2001':   '20011125 - x00- voyage à Paris - 2001' // explicit date + unicode (seen BUG strange unicode destruction) + "x" protection needed
			}
			Object.keys(TEST_CASES).forEach(tc => {
				it(`should work by taking the event range (manual or auto-generated) -- ${tc}`, () => {
					let state: State = create(tc)
					state = on_fs_exploration_done(state)

					const has_date_in_basename = !!get_event_begin_date_from_basename_if_present_and_confirmed_by_other_sources(state)

					//console.log(tc, { state, has_date_in_basename, ebfb: get_event_begin_date_from_basename_if_present_and_confirmed_by_other_sources(state) })
					if (!has_date_in_basename) {
						if (tc !== '- inbox') {
							expect(state.type).to.equal('event')
							expect(() => get_ideal_basename(state), tc).to.throw('should have')
							expect(() => get_ideal_basename(state), tc).to.throw('range')

							// TODO review use reducer?
							state = {
								...state,
								forced_event_range: {
									begin: create_better_date_from_symd(20001231, 'tz:auto'),
									end:   create_better_date_from_symd(20001231, 'tz:auto'),
								}
							}
						}
					}

					expect(get_ideal_basename(state), tc).to.equal(TEST_CASES[tc])
				})
			})

			/*it('should priorise explicit event date over basename hint', () => {
				let state: State = create('20140803 - holidays')
				//console.log(state)
				state.event_range.begin = state.event_range.begin = create_better_date_from_symd(20001231, 'tz:auto')
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
				subfile_state = File.on_info_read__hash(subfile_state, '1234')
				subfile_state = File.on_info_read__fs_stats(subfile_state, {
					birthtimeMs: 1234567890,
					atimeMs:     1234567890,
					mtimeMs:     1234567890,
					ctimeMs:     1234567890,
				})
				subfile_state = File.on_info_read__current_neighbors_primary_hints(subfile_state, null, 'unknown')

				subfile_state = File.on_notes_recovered(subfile_state, null)

				state = on_subfile_primary_infos_gathered(state, subfile_state)
				//console.log(state)
				expect(get_ideal_basename(state)).to.equal('20011206 - x01- St. Nicolas')
			})*/
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

		describe('to_string()', function() {

			it('should work for early states', () => {
				let state = create('foo')
				console.log(to_string(state))
			})

			it('should work for late states', () => {
				let state = create('foo 2008.11.25 ')
				state = on_fs_exploration_done(state)

				console.log(to_string(state))
			})
		})
	})
})
