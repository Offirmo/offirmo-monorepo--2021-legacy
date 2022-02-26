import { expect } from 'chai'

import { LIB, NOTES_BASENAME_SUFFIX_LC } from '../../consts'
import * as Notes from '../notes'
import {
	clean_up_duplicates,
	create,
	discard_all_pending_actions,
	get_first_pending_action,
	get_past_and_present_notes,
	get_pending_actions,
	normalize_files_in_place,
	on_exif_read,
	on_file_deleted,
	on_file_found,
	on_file_moved,
	on_folder_found,
	on_fs_exploration_done_consolidate_data_and_backup_originals,
	on_fs_stats_read,
	on_hash_computed,
	on_note_file_found,
	to_string,
} from '.'
import { create_better_date, _get_exif_datetime, get_timestamp_utc_ms_from } from '../../services/better-date'
import * as File from '../file'

/////////////////////

describe(`${LIB} - DB (root) state`, function() {

	describe('integration', function() {

		const CREATION_DATE = create_better_date('tz:auto', 2017, 10, 20, 5, 1, 44, 625)
		const CREATION_DATE_MS = get_timestamp_utc_ms_from(CREATION_DATE)
		//console.log(state.queue)
		//console.log(to_string(state))

		describe('de-duplication', function() {

			it('should detect duplicated and clean media files', function () {
				let state = create('root')

				state = on_folder_found(state, '', '.')

				state = on_file_found(state, '.', 'foo.jpg')
				state = on_file_found(state, '.', 'bar.jpg')
				state = on_file_found(state, '.', 'baz.jpg')

				state = on_hash_computed(state, 'foo.jpg', 'hash01')
				state = on_hash_computed(state, 'bar.jpg', 'hash02')
				state = on_hash_computed(state, 'baz.jpg', 'hash02')

				state = on_fs_stats_read(state, 'foo.jpg', {
					birthtimeMs: CREATION_DATE_MS,
					atimeMs:     CREATION_DATE_MS,
					mtimeMs:     CREATION_DATE_MS,
					ctimeMs:     CREATION_DATE_MS,
				})
				state = on_fs_stats_read(state, 'bar.jpg', {
					birthtimeMs: CREATION_DATE_MS,
					atimeMs:     CREATION_DATE_MS,
					mtimeMs:     CREATION_DATE_MS,
					ctimeMs:     CREATION_DATE_MS,
				})
				state = on_fs_stats_read(state, 'baz.jpg', {
					birthtimeMs: CREATION_DATE_MS,
					atimeMs:     CREATION_DATE_MS,
					mtimeMs:     CREATION_DATE_MS,
					ctimeMs:     CREATION_DATE_MS,
				})

				state = on_exif_read(state, 'foo.jpg', {
					'SourceFile': 'foo.jpg',
					'CreateDate': _get_exif_datetime(CREATION_DATE),
				})
				state = on_exif_read(state, 'bar.jpg', {
					'SourceFile': 'bar.jpg',
					'CreateDate': _get_exif_datetime(CREATION_DATE),
				})
				state = on_exif_read(state, 'baz.jpg', {
					'SourceFile': 'baz.jpg',
					'CreateDate': _get_exif_datetime(CREATION_DATE),
				})

				state = on_fs_exploration_done_consolidate_data_and_backup_originals(state)

				expect(state.encountered_hash_count['hash01'], '01').to.equal(1)
				expect(state.encountered_hash_count['hash02'], '02').to.equal(2)

				state = discard_all_pending_actions(state)
				state = clean_up_duplicates(state)

				//console.log(to_string(state))
				expect(get_pending_actions(state)).to.have.lengthOf(1)
				expect(get_first_pending_action(state)).to.deep.equal({
					type: 'delete_file',
					id: 'baz.jpg'
				})
				//console.log(state.queue)

				state = discard_all_pending_actions(state)
				state = on_file_deleted(state, 'baz.jpg')
				//console.log(to_string(state))
			})

			it('should also work on non media files', function () {
				let state = create('root')

				state = on_folder_found(state, '', '.')
				state = on_folder_found(state, '', 'foo')
				state = on_folder_found(state, '', 'bar')


				state = on_file_found(state, '.', 'foo/description.txt')
				state = on_file_found(state, '.', 'bar/description.txt')

				state = on_hash_computed(state, 'foo/description.txt', 'hash01')
				state = on_hash_computed(state, 'bar/description.txt', 'hash01')
				state = on_fs_stats_read(state, 'foo/description.txt', {
					birthtimeMs: CREATION_DATE_MS,
					atimeMs:     CREATION_DATE_MS,
					mtimeMs:     CREATION_DATE_MS,
					ctimeMs:     CREATION_DATE_MS,
				})
				state = on_fs_stats_read(state, 'bar/description.txt', {
					birthtimeMs: CREATION_DATE_MS,
					atimeMs:     CREATION_DATE_MS,
					mtimeMs:     CREATION_DATE_MS,
					ctimeMs:     CREATION_DATE_MS,
				})

				state = on_fs_exploration_done_consolidate_data_and_backup_originals(state)

				expect(state.encountered_hash_count['hash01']).to.equal(2)

				state = discard_all_pending_actions(state)
				state = clean_up_duplicates(state)

				//console.log(to_string(state))
				expect(get_pending_actions(state)).to.have.lengthOf(1)
				expect(get_first_pending_action(state)).to.deep.equal({
					type: 'delete_file',
					id: 'foo/description.txt',
				})
				//console.log(state.queue)

				state = discard_all_pending_actions(state)
				state = on_file_deleted(state, 'foo/description.txt')
				//console.log(to_string(state))
			})
		})

		describe('notes', function() {

			it('should be accurate')

			it('should be stable across runs')

			it('should take into account file moves')
		})

		describe('stability', function() {

			/*
			Real bug seen:
	VERBOSE›  - moving file from "MM2019-07-31_21h00m15_screenshot.png" to "MM2019-07-31_13h00m22_screenshot.png"…
	VERBOSE›  - moving file from "MM2019-07-31_21h01m36_screenshot.png" to "MM2019-07-31_13h01m42_screenshot.png"…
	VERBOSE›  - moving file from "MM2019-07-31_21h01m42_screenshot.png" to "MM2019-07-31_13h01m48_screenshot.png"…
	VERBOSE›  - moving file from "MM2019-08-01_00h40m33_screenshot.png" to "MM2019-07-31_16h40m38_screenshot.png"…
			 */
			it('should be stable after the first round', function () {
				const DEBUG = false
				const BASENAME = 'Capture d’écran 2019-07-31 à 21.00.15.png'
				const CREATION_DATE_MS = 1564542022000

				let persisted_notes = get_past_and_present_notes(create('.'))
				let file_ut_basename = BASENAME

				///////////////// FIRST ROUND /////////////////
				DEBUG && console.log('......................1st round')
				let state = create('.')

				// simulate exploration
				DEBUG && console.log('exploration…')
				state = on_folder_found(state, '', '.')
				state = on_file_found(state, '.', file_ut_basename)
				// (no notes found)

				expect(get_pending_actions(state), 'after exploration').to.have.lengthOf(3)
				state = on_hash_computed(state, file_ut_basename, 'hash01')
				state = on_fs_stats_read(state, file_ut_basename, {
					birthtimeMs: CREATION_DATE_MS,
					atimeMs:     CREATION_DATE_MS,
					mtimeMs:     CREATION_DATE_MS,
					ctimeMs:     CREATION_DATE_MS,
				})
				// load notes: none
				expect(get_pending_actions(state), 'after primary infos 1').to.have.lengthOf(3) // explore, hash, fs.stats
				state = discard_all_pending_actions(state)

				state = on_fs_exploration_done_consolidate_data_and_backup_originals(state)
				DEBUG && console.log('exploration done.')
				expect(get_pending_actions(state), 'after consolidation 1').to.have.lengthOf(0) // formerly auto notes bkp, removed
				persisted_notes = get_past_and_present_notes(state)
				//state = discard_all_pending_actions(state)

				state = clean_up_duplicates(state)
				expect(get_pending_actions(state), 'after clean up duplicate 1').to.have.lengthOf(0) // no duplicates
				persisted_notes = get_past_and_present_notes(state)
				//state = discard_all_pending_actions(state)

				state = normalize_files_in_place(state)
				expect(get_pending_actions(state), 'after normalize 1').to.have.lengthOf(1) // normalize
				let next_id = File.get_ideal_basename(state.files[file_ut_basename])
				expect(next_id).to.equal('MM2019-07-31_21h00m15_screenshot.png')
				//console.log(next_id, state.files)
				state = on_file_moved(state, file_ut_basename, next_id)
				file_ut_basename = next_id
				persisted_notes = get_past_and_present_notes(state)
				state = discard_all_pending_actions(state)

				DEBUG && console.log('........EO 1st round.......')
				expect(Object.keys(state.files), 'file keys after 1st round').to.deep.equal(['MM2019-07-31_21h00m15_screenshot.png'])
				DEBUG && console.log(to_string(state))
				DEBUG && console.log(Notes.to_string(persisted_notes))

				///////////////// SECOND ROUND /////////////////
				DEBUG && console.log('\n......................2nd round')

				state = create('.')

				// simulate exploration
				state = on_folder_found(state, '', '.')
				state = on_file_found(state, '.', file_ut_basename)
				// notes found this time!
				state = on_file_found(state, '.', NOTES_BASENAME_SUFFIX_LC)

				//console.log(state.queue)
				expect(get_pending_actions(state), 'after explore 2').to.have.lengthOf(4) // explore, hash, fs stats, load notes
				state = discard_all_pending_actions(state)
				// explore done = #1
				state = on_hash_computed(state, file_ut_basename, 'hash01') // #2
				state = on_fs_stats_read(state, file_ut_basename, { // #3
					birthtimeMs: CREATION_DATE_MS,
					atimeMs:     CREATION_DATE_MS,
					mtimeMs:     CREATION_DATE_MS,
					ctimeMs:     CREATION_DATE_MS,
				})
				/*state = on_fs_stats_read(state, NOTES_BASENAME_SUFFIX_LC, { // #4
					birthtimeMs: +Date.now(),
					atimeMs:     +Date.now(),
					mtimeMs:     +Date.now(),
					ctimeMs:     +Date.now(),
				})*/
				state = on_note_file_found(state, persisted_notes) // #5
				expect(get_pending_actions(state), 'after load data 2').to.have.lengthOf(0)

				state = on_fs_exploration_done_consolidate_data_and_backup_originals(state)
				expect(get_pending_actions(state), 'after consolidation 2').to.have.lengthOf(0)
				persisted_notes = get_past_and_present_notes(state)
				//state = discard_all_pending_actions(state)

				state = clean_up_duplicates(state)
				expect(get_pending_actions(state), 'after duplicate 2').to.have.lengthOf(0)
				persisted_notes = get_past_and_present_notes(state)
				state = discard_all_pending_actions(state)

				next_id = File.get_ideal_basename(state.files[file_ut_basename])
				expect(next_id).to.equal(file_ut_basename) // should be stable!!!

				//console.log(to_string(state))
				//console.log(Notes.to_string(persisted_notes))
			})
		})
	})
})
