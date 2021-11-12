import { expect } from 'chai'

import { LIB } from '../../consts'
import {
	create_better_date_from_symd,
	get_human_readable_timestamp_auto,
} from '../../services/better-date'

import { State } from './types'
import {
	create,
	on_subfile_found,
	on_subfile_primary_infos_gathered,
} from './reducers'

import {
	get_ideal_basename,
	get_depth,
	get_event_begin_date_from_basename_if_present_and_confirmed_by_other_sources,
} from './selectors'

import './__test_shared'
import { ALL_MEDIA_DEMOS } from '../../__test_shared/real_files'

/////////////////////

describe(`${LIB} - folder state`, function() {

	describe('selectors', function() {

		describe('get_event_begin_date_from_basename_if_present_and_confirmed_by_other_sources()', function() {

			it('should not find anything when no date in basename', () => {
				let state = create('2014-541')
				const begin_date = get_event_begin_date_from_basename_if_present_and_confirmed_by_other_sources(state)
				expect(begin_date).to.be.null
			})

			it('should properly detect events when basename is clear', () => {
				let state = create('20140803 - holidays')
				const begin_date = get_event_begin_date_from_basename_if_present_and_confirmed_by_other_sources(state)
				expect(begin_date).not.to.be.null
				expect(get_human_readable_timestamp_auto(begin_date!, 'tz:embedded')).to.equal('2014-08-03')
			})

			it('should properly detect backups when basename is clear', () => {
				let state = create('20140803 - BackuP ')
				let begin_date = get_event_begin_date_from_basename_if_present_and_confirmed_by_other_sources(state)
				expect(begin_date).to.be.null

				state = create('20140803 - SauveGarde ')
				begin_date = get_event_begin_date_from_basename_if_present_and_confirmed_by_other_sources(state)
				expect(begin_date).to.be.null

				state = create('20140803 - imPort')
				begin_date = get_event_begin_date_from_basename_if_present_and_confirmed_by_other_sources(state)
				expect(begin_date).to.be.null
			})

			it('should cross-reference with children when basename is unclear -- no children', () => {
				let state = create('holidays 2014-08-03')
				const begin_date = get_event_begin_date_from_basename_if_present_and_confirmed_by_other_sources(state)
				expect(begin_date).not.to.be.null
				expect(get_human_readable_timestamp_auto(begin_date!, 'tz:embedded')).to.equal('2014-08-03')
			})

			it('should cross-reference with children when basename is unclear -- children hints at event', async () => {
				let state = create('holidays 2018-09-01')
				let file_state = await ALL_MEDIA_DEMOS[0].get_phase1_state() // REM date = 2018-09-03_20h46m14 GMT+8
				state = on_subfile_found(state, file_state)
				state = on_subfile_primary_infos_gathered(state, file_state)

				const begin_date = get_event_begin_date_from_basename_if_present_and_confirmed_by_other_sources(state)
				expect(begin_date).not.to.be.null
				expect(get_human_readable_timestamp_auto(begin_date!, 'tz:embedded')).to.equal('2018-09-01')
			})

			it('should cross-reference with children when basename is unclear -- children hints at backup', async () => {
				let state = create('2018-10-31')
				let file_state = await ALL_MEDIA_DEMOS[0].get_phase1_state() // REM date = 2018-09-03_20h46m14 GMT+8
				state = on_subfile_found(state, file_state)
				state = on_subfile_primary_infos_gathered(state, file_state)

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

				const begin_date = get_event_begin_date_from_basename_if_present_and_confirmed_by_other_sources(state)
				expect(begin_date).to.be.null
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
					const has_date_in_basename = get_event_begin_date_from_basename_if_present_and_confirmed_by_other_sources(state) !== null

					//console.log(tc, { state }, get_event_begin_date_from_basename_if_present_and_confirmed_by_other_sources(state))
					if (!has_date_in_basename) {
						expect(() => get_ideal_basename(state), tc).to.throw('event range should have a start')

						// TODO review
						state.forced_event_range = {
							begin: create_better_date_from_symd(20001231, 'tz:auto'),
							end:   create_better_date_from_symd(20001231, 'tz:auto'),
						}
					}

					//console.log(state)
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

			it('should work')
		})
	})
})
