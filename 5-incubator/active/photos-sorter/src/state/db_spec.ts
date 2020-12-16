import { expect } from 'chai'

import { Immutable } from '@offirmo-private/ts-types'

import { LIB, NOTES_BASENAME } from '../consts'
import * as Notes from './notes'
import {
	State,
	create,
	on_folder_found,
	on_file_found,
	on_hash_computed,
	on_fs_stats_read,
	on_exif_read,
	on_fs_exploration_done_consolidate_data_and_backup_originals,
	get_pending_actions,
	discard_all_pending_actions,
	get_past_and_present_notes,
	normalize_medias_in_place,
	on_file_moved,
	on_notes_found,

	clean_up_duplicates,

	on_file_deleted,

	to_string,
	get_first_pending_action,
} from './db'
import {
	TEST_FILES_DIR_ABS,
} from '../__test_shared/real_files'
import { create_better_date, get_exif_datetime, get_timestamp_utc_ms_from } from '../services/better-date'
import * as File from './file'

/////////////////////

describe(`${LIB} - DB (root) state`, function() {
	const CREATION_DATE = create_better_date('tz:auto', 2017, 10, 20, 5, 1, 44, 625)
	const CREATION_DATE_MS = get_timestamp_utc_ms_from(CREATION_DATE)

	describe('de-duplication', function() {

		it('should detect duplicated files', function () {
			let state = create(TEST_FILES_DIR_ABS)

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

			state = on_exif_read(state, 'foo.jpg', { 'CreateDate': get_exif_datetime(CREATION_DATE) })
			state = on_exif_read(state, 'bar.jpg', { 'CreateDate': get_exif_datetime(CREATION_DATE) })
			state = on_exif_read(state, 'baz.jpg', { 'CreateDate': get_exif_datetime(CREATION_DATE) })

			state = on_fs_exploration_done_consolidate_data_and_backup_originals(state)
			/*state = on_media_file_notes_recovered(state, 'foo.jpg', null)
			state = on_media_file_notes_recovered(state, 'bar.jpg', null)
			state = on_media_file_notes_recovered(state, 'baz.jpg', null)*/

			expect(state.encountered_hash_count['hash01'], '01').to.equal(1)
			expect(state.encountered_hash_count['hash02'], '02').to.equal(2)

			state = clean_up_duplicates(state)

			//console.log(to_string(state))
			expect(state.queue.slice(-1)[0]).to.deep.equal({
				type: 'delete_file',
				id: 'baz.jpg'
			})

			state = on_file_deleted(state, 'baz.jpg')
			console.log(to_string(state))
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
		it.only('should be stable after the first round', function () {
			const DEBUG = true
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
			// no notes found

			expect(get_pending_actions(state)).to.have.lengthOf(3)
			state = on_hash_computed(state, file_ut_basename, 'hash01')
			state = on_fs_stats_read(state, file_ut_basename, {
				birthtimeMs: CREATION_DATE_MS,
				atimeMs:     CREATION_DATE_MS,
				mtimeMs:     CREATION_DATE_MS,
				ctimeMs:     CREATION_DATE_MS,
			})
			// load notes: none
			expect(get_pending_actions(state)).to.have.lengthOf(3)
			state = discard_all_pending_actions(state)

			state = on_fs_exploration_done_consolidate_data_and_backup_originals(state)
			DEBUG && console.log('exploration done.')
			expect(get_pending_actions(state)).to.have.lengthOf(1)
			persisted_notes = get_past_and_present_notes(state)
			state = discard_all_pending_actions(state)

			state = clean_up_duplicates(state)
			expect(get_pending_actions(state)).to.have.lengthOf(1)
			persisted_notes = get_past_and_present_notes(state)
			state = discard_all_pending_actions(state)

			state = normalize_medias_in_place(state)
			expect(get_pending_actions(state)).to.have.lengthOf(2)
			let next_id = File.get_ideal_basename(state.files[file_ut_basename])
			//console.log(state.files)
			state = on_file_moved(state, file_ut_basename, next_id)
			file_ut_basename = next_id
			persisted_notes = get_past_and_present_notes(state)
			state = discard_all_pending_actions(state)

			DEBUG && console.log('EO 1st round')
			expect(Object.keys(state.files)).to.deep.equal(['MM2019-07-31_21h00m15_screenshot.png'])
			DEBUG && console.log(to_string(state))
			DEBUG && console.log(Notes.to_string(persisted_notes))

			///////////////// SECOND ROUND /////////////////
			DEBUG && console.log('\n......................2nd round')

			state = create('.')

			// simulate exploration
			state = on_folder_found(state, '', '.')
			state = on_file_found(state, '.', file_ut_basename)
			state = on_file_found(state, '.', NOTES_BASENAME)

			//console.log(state.queue)
			expect(get_pending_actions(state)).to.have.lengthOf(4)
			state = on_hash_computed(state, file_ut_basename, 'hash01')
			state = on_fs_stats_read(state, file_ut_basename, {
				birthtimeMs: CREATION_DATE_MS,
				atimeMs:     CREATION_DATE_MS,
				mtimeMs:     CREATION_DATE_MS,
				ctimeMs:     CREATION_DATE_MS,
			})
			// notes found this time!
			state = on_notes_found(state, persisted_notes)
			expect(get_pending_actions(state)).to.have.lengthOf(4)
			state = discard_all_pending_actions(state)

			state = on_fs_exploration_done_consolidate_data_and_backup_originals(state)
			expect(get_pending_actions(state)).to.have.lengthOf(1)
			persisted_notes = get_past_and_present_notes(state)
			state = discard_all_pending_actions(state)

			console.log(to_string(state))
			console.log(Notes.to_string(persisted_notes))
			/*
			state = clean_up_duplicates(state)
			expect(get_pending_actions(state)).to.have.lengthOf(1)
			persisted_notes = get_past_and_present_notes(state)
			state = discard_all_pending_actions(state)

			state = normalize_medias_in_place(state)
			expect(get_pending_actions(state)).to.have.lengthOf(2)
			next_id = File.get_ideal_basename(state.files[file_ut_basename])
			expect(next_id).to.equal(file_ut_basename) // should be stable!!!
			state = on_file_moved(state, file_ut_basename, next_id)
			file_ut_basename = next_id
			persisted_notes = get_past_and_present_notes(state)
			state = discard_all_pending_actions(state)

			console.log(to_string(state))
			console.log(Notes.to_string(persisted_notes))*/
		})
	})
})
