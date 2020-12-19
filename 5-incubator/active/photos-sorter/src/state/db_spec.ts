import { expect } from 'chai'
import path from 'path'

import { Immutable } from '@offirmo-private/ts-types'

import { LIB, NOTES_BASENAME } from '../consts'
import * as Notes from './notes'
import {
	State,
	clean_up_duplicates,
	create,
	discard_all_pending_actions,
	get_first_pending_action,
	get_ideal_file_relative_path,
	get_past_and_present_notes,
	get_pending_actions,
	normalize_medias_in_place,
	on_exif_read,
	on_file_deleted,
	on_file_found,
	on_file_moved,
	on_folder_found,
	on_fs_exploration_done_consolidate_data_and_backup_originals,
	on_fs_stats_read,
	on_hash_computed,
	on_notes_found,
	to_string,
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
	//console.log(state.queue)
	//console.log(to_string(state))

	describe('get_ideal_file_relative_path()', function() {

		context('when media file', function() {

			context('when NOT confident in the date', function() {

				context('when already well placed', function () {

					it('should stay stable', () => {
						let file_parent = '- cant_sort'
						let file_basename = 'foo.png'
						let file_id = path.join(file_parent, file_basename)

						let state = create(TEST_FILES_DIR_ABS)

						state = on_folder_found(state, '', '.')
						state = on_folder_found(state, '', file_parent)
						state = on_file_found(state, '.', file_id)
						state = on_hash_computed(state, file_id, 'hash01')
						state = on_fs_stats_read(state, file_id, {
							birthtimeMs: CREATION_DATE_MS,
							atimeMs:     CREATION_DATE_MS,
							mtimeMs:     CREATION_DATE_MS,
							ctimeMs:     CREATION_DATE_MS,
						})
						state = on_fs_exploration_done_consolidate_data_and_backup_originals(state)

						expect(File.get_ideal_basename(state.files[file_id])).to.equal(file_basename) // THIS TEST
						expect(File.get_confidence_in_date(state.files[file_id])).to.be.false // THIS TEST

						expect(get_ideal_file_relative_path(state, file_id)).to.equal(path.join(
							'- cant_sort',
							'foo.png'
						))
					})
				})

				context('when NOT already well placed -- in a special folder', function () {

					it('should swap the special folder to "cantsort" while preserving the base and path', () => {
						let file_parent = '- inbox'
						let file_basename = 'foo.png'
						let file_id = path.join(file_parent, file_basename)

						let state = create(TEST_FILES_DIR_ABS)

						state = on_folder_found(state, '', '.')
						state = on_folder_found(state, '', file_parent)
						state = on_file_found(state, '.', file_id)
						state = on_hash_computed(state, file_id, 'hash01')
						state = on_fs_stats_read(state, file_id, {
							birthtimeMs: CREATION_DATE_MS,
							atimeMs:     CREATION_DATE_MS,
							mtimeMs:     CREATION_DATE_MS,
							ctimeMs:     CREATION_DATE_MS,
						})
						state = on_fs_exploration_done_consolidate_data_and_backup_originals(state)

						expect(File.get_ideal_basename(state.files[file_id])).to.equal(file_basename) // THIS TEST
						expect(File.get_confidence_in_date(state.files[file_id])).to.be.false // THIS TEST

						expect(get_ideal_file_relative_path(state, file_id)).to.equal(path.join(
							'- cant_sort',
							'foo.png',
						))
					})
				})

				context('when NOT already well placed -- in a random other folder', function () {

					it('should move to "cantsort" while preserving the base and path', () => {
						let file_parent = 'hello'
						let file_basename = 'foo.png'
						let file_id = path.join(file_parent, file_basename)

						let state = create(TEST_FILES_DIR_ABS)

						state = on_folder_found(state, '', '.')
						state = on_folder_found(state, '', file_parent)
						state = on_file_found(state, '.', file_id)
						state = on_hash_computed(state, file_id, 'hash01')
						state = on_fs_stats_read(state, file_id, {
							birthtimeMs: CREATION_DATE_MS,
							atimeMs:     CREATION_DATE_MS,
							mtimeMs:     CREATION_DATE_MS,
							ctimeMs:     CREATION_DATE_MS,
						})
						state = on_fs_exploration_done_consolidate_data_and_backup_originals(state)

						expect(File.get_ideal_basename(state.files[file_id])).to.equal(file_basename) // THIS TEST
						expect(File.get_confidence_in_date(state.files[file_id])).to.be.false // THIS TEST

						expect(get_ideal_file_relative_path(state, file_id)).to.equal(path.join(
							'- cant_sort',
							'hello',
							'foo.png',
						))
					})
				})
			})

			context('when confident in the date', function() {

				context('when already well placed -- normalized', function () {

					it('should stay stable', () => {
						let file_parent__year = '2017'
						let file_parent__event = '20171020 - foo'
						let file_basename = 'MM2017-10-20_05h01m44s625_foo.png'
						let file_id = path.join(file_parent__year, file_parent__event, file_basename)

						let state = create(TEST_FILES_DIR_ABS)

						state = on_folder_found(state, '', '.')
						state = on_folder_found(state, '', file_parent__year)
						state = on_folder_found(state, file_parent__year, file_parent__event)
						state = on_file_found(state, '.', file_id)
						state = on_hash_computed(state, file_id, 'hash01')
						state = on_fs_stats_read(state, file_id, {
							birthtimeMs: CREATION_DATE_MS,
							atimeMs:     CREATION_DATE_MS,
							mtimeMs:     CREATION_DATE_MS,
							ctimeMs:     CREATION_DATE_MS,
						})
						state = on_fs_exploration_done_consolidate_data_and_backup_originals(state)
						state = discard_all_pending_actions(state)

						// normalization in-place
						expect(File.get_ideal_basename(state.files[file_id])).to.equal(file_basename) // THIS TEST
						expect(File.get_confidence_in_date(state.files[file_id])).to.be.true // THIS TEST

						// stable
						expect(get_ideal_file_relative_path(state, file_id)).to.equal(path.join(
							'2017',
							'20171020 - foo',
							'MM2017-10-20_05h01m44s625_foo.png',
						))
					})
				})

				context('when already well placed -- not normalized', function () {

					it('should stay stable except for the basename', () => {
						let file_basename = 'IMG_20171020.png' // date in name = source of confidence
						let file_parent__year = '2017'
						let file_parent__event = '20171020 - foo'
						let file_id = path.join(file_parent__year, file_parent__event, file_basename)

						let state = create(TEST_FILES_DIR_ABS)

						state = on_folder_found(state, '', '.')
						state = on_folder_found(state, '', file_parent__year)
						state = on_folder_found(state, file_parent__year, file_parent__event)
						state = on_file_found(state, '.', file_id)
						state = on_hash_computed(state, file_id, 'hash01')
						state = on_fs_stats_read(state, file_id, {
							birthtimeMs: CREATION_DATE_MS,
							atimeMs:     CREATION_DATE_MS,
							mtimeMs:     CREATION_DATE_MS,
							ctimeMs:     CREATION_DATE_MS,
						})
						state = on_fs_exploration_done_consolidate_data_and_backup_originals(state)

						// normalization in-place is a prerequisite
						expect(File.get_ideal_basename(state.files[file_id])).not.to.equal(file_basename) // THIS TEST
						expect(File.get_confidence_in_date(state.files[file_id])).to.be.true // THIS TEST

						state = normalize_medias_in_place(state)
						const expected_next_id = path.join(file_parent__year, file_parent__event, File.get_ideal_basename(state.files[file_id]))
						state = on_file_moved(state, file_id, expected_next_id)
						file_id = expected_next_id
						file_basename = File.get_ideal_basename(state.files[file_id])
						state = discard_all_pending_actions(state)

						expect(get_ideal_file_relative_path(state, file_id)).to.equal(path.join(
							'2017',
							'20171020 - foo',
							'MM2017-10-20_05h01m44s625.png',
						))
					})
				})

				context('when NOT already well placed -- normalized', function () {

					it('should be moved to the correct location', () => {
						let file_basename = 'MM2017-10-20_05h01m44s625_hi.png'
						let file_parent__year = '2018'
						let file_parent__event = 'foo'
						let file_id = path.join(file_parent__year, file_parent__event, file_basename)

						let state = create(TEST_FILES_DIR_ABS)

						state = on_folder_found(state, '', '.')
						state = on_folder_found(state, '', file_parent__year)
						state = on_folder_found(state, file_parent__year, file_parent__event)
						state = on_file_found(state, '.', file_id)
						state = on_hash_computed(state, file_id, 'hash01')
						state = on_fs_stats_read(state, file_id, {
							birthtimeMs: CREATION_DATE_MS,
							atimeMs:     CREATION_DATE_MS,
							mtimeMs:     CREATION_DATE_MS,
							ctimeMs:     CREATION_DATE_MS,
						})
						state = on_fs_exploration_done_consolidate_data_and_backup_originals(state)

						// normalization in-place
						expect(File.get_ideal_basename(state.files[file_id])).to.equal(file_basename) // THIS TEST
						expect(File.get_confidence_in_date(state.files[file_id])).to.be.true // THIS TEST
						state = discard_all_pending_actions(state)

						// stable
						expect(get_ideal_file_relative_path(state, file_id)).to.equal(path.join(
							'2017',
							'20171020 - foo',
							'MM2017-10-20_05h01m44s625_hi.png',
						))
					})
				})

				context('when NOT already well placed -- not normalized', function () {

					it('should be moved to the correct location', () => {
						let file_basename = 'foo.jpg'
						let file_parent__1 = 'bar'
						let file_parent__2 = 'baz'
						let file_id = path.join(file_parent__1, file_parent__2, file_basename)

						let state = create(TEST_FILES_DIR_ABS)

						state = on_folder_found(state, '', '.')
						state = on_folder_found(state, '', file_parent__1)
						state = on_folder_found(state, file_parent__1, file_parent__2)
						state = on_file_found(state, '.', file_id)
						state = on_hash_computed(state, file_id, 'hash01')
						state = on_fs_stats_read(state, file_id, {
							birthtimeMs: CREATION_DATE_MS,
							atimeMs:     CREATION_DATE_MS,
							mtimeMs:     CREATION_DATE_MS,
							ctimeMs:     CREATION_DATE_MS,
						})
						state = on_exif_read(state, file_id, { // src of confidence
							'CreateDate': get_exif_datetime(CREATION_DATE)
						})
						state = on_fs_exploration_done_consolidate_data_and_backup_originals(state)

						// normalization in-place = prerequisite
						expect(File.get_ideal_basename(state.files[file_id])).not.to.equal(file_basename) // THIS TEST
						expect(File.get_confidence_in_date(state.files[file_id])).to.be.true // THIS TEST
						state = normalize_medias_in_place(state)
						const expected_next_id = path.join(file_parent__1, file_parent__2, File.get_ideal_basename(state.files[file_id]))
						state = on_file_moved(state, file_id, expected_next_id)
						file_id = expected_next_id
						file_basename = File.get_ideal_basename(state.files[file_id])
						state = discard_all_pending_actions(state)

						expect(get_ideal_file_relative_path(state, file_id)).to.equal(path.join(
							'2017',
							'20171020 - baz',
							'MM2017-10-20_05h01m44s625_foo.jpg',
						))
					})
				})
			})
		})

		context('when NOT media file', function() {

			context('when already well placed', function () {

				it('should stay stable', () => {
					let file_parent = '- cant_recognize'
					let file_basename = 'foo.xyz'
					let file_id = path.join(file_parent, file_basename)

					let state = create(TEST_FILES_DIR_ABS)

					state = on_folder_found(state, '', '.')
					state = on_folder_found(state, '', file_parent)
					state = on_file_found(state, '.', file_id)
					state = on_hash_computed(state, file_id, 'hash01')
					state = on_fs_stats_read(state, file_id, {
						birthtimeMs: CREATION_DATE_MS,
						atimeMs:     CREATION_DATE_MS,
						mtimeMs:     CREATION_DATE_MS,
						ctimeMs:     CREATION_DATE_MS,
					})
					state = on_fs_exploration_done_consolidate_data_and_backup_originals(state)

					expect(File.is_media_file(state.files[file_id])).to.be.false // THIS TEST
					expect(File.get_ideal_basename(state.files[file_id])).to.equal(file_basename) // THIS TEST

					expect(get_ideal_file_relative_path(state, file_id)).to.equal(path.join(
						'- cant_recognize',
						'foo.xyz',
					))
				})
			})

			context('when NOT already well placed -- in a special folder', function () {

				it('should swap the special folder to "cant_recognize" while preserving the base and path', () => {
					let file_parent = '- inbox'
					let file_basename = 'foo.xyz'
					let file_id = path.join(file_parent, file_basename)

					let state = create(TEST_FILES_DIR_ABS)

					state = on_folder_found(state, '', '.')
					state = on_folder_found(state, '', file_parent)
					state = on_file_found(state, '.', file_id)
					state = on_hash_computed(state, file_id, 'hash01')
					state = on_fs_stats_read(state, file_id, {
						birthtimeMs: CREATION_DATE_MS,
						atimeMs:     CREATION_DATE_MS,
						mtimeMs:     CREATION_DATE_MS,
						ctimeMs:     CREATION_DATE_MS,
					})
					state = on_fs_exploration_done_consolidate_data_and_backup_originals(state)

					expect(File.is_media_file(state.files[file_id])).to.be.false // THIS TEST
					expect(File.get_ideal_basename(state.files[file_id])).to.equal(file_basename) // THIS TEST

					expect(get_ideal_file_relative_path(state, file_id)).to.equal(path.join(
						'- cant_recognize',
						'foo.xyz',
					))
				})
			})

			context('when NOT already well placed -- in a random other folder', function () {

				it('should move to "cantsort" while preserving the base and path', () => {
					let file_parent = 'hello'
					let file_basename = 'foo.xyz'
					let file_id = path.join(file_parent, file_basename)

					let state = create(TEST_FILES_DIR_ABS)

					state = on_folder_found(state, '', '.')
					state = on_folder_found(state, '', file_parent)
					state = on_file_found(state, '.', file_id)
					state = on_hash_computed(state, file_id, 'hash01')
					state = on_fs_stats_read(state, file_id, {
						birthtimeMs: CREATION_DATE_MS,
						atimeMs:     CREATION_DATE_MS,
						mtimeMs:     CREATION_DATE_MS,
						ctimeMs:     CREATION_DATE_MS,
					})
					state = on_fs_exploration_done_consolidate_data_and_backup_originals(state)

					expect(File.is_media_file(state.files[file_id])).to.be.false // THIS TEST
					expect(File.get_ideal_basename(state.files[file_id])).to.equal(file_basename) // THIS TEST

					expect(get_ideal_file_relative_path(state, file_id)).to.equal(path.join(
						'- cant_recognize',
						'hello',
						'foo.xyz',
					))
				})
			})
		})
	})

	describe('de-duplication', function() {

		it('should detect duplicated and clean media files', function () {
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
			/*state = on_file_notes_recovered(state, 'foo.jpg', null)
			state = on_file_notes_recovered(state, 'bar.jpg', null)
			state = on_file_notes_recovered(state, 'baz.jpg', null)*/

			expect(state.encountered_hash_count['hash01'], '01').to.equal(1)
			expect(state.encountered_hash_count['hash02'], '02').to.equal(2)

			state = discard_all_pending_actions(state)
			state = clean_up_duplicates(state)

			//console.log(to_string(state))
			expect(get_pending_actions(state)).to.have.lengthOf(2)
			expect(get_first_pending_action(state)).to.deep.equal({
				type: 'delete_file',
				id: 'baz.jpg'
			})
			//console.log(state.queue)

			state = on_file_deleted(state, 'baz.jpg')
			//console.log(to_string(state))
		})

		it('should also work on non media files', function () {
			let state = create(TEST_FILES_DIR_ABS)

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
			expect(get_pending_actions(state)).to.have.lengthOf(2)
			expect(get_first_pending_action(state)).to.deep.equal({
				type: 'delete_file',
				id: 'foo/description.txt',
			})
			//console.log(state.queue)

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
			expect(get_pending_actions(state)).to.have.lengthOf(1)
			let next_id = File.get_ideal_basename(state.files[file_ut_basename])
			//console.log(next_id, state.files)
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

			state = clean_up_duplicates(state)
			expect(get_pending_actions(state)).to.have.lengthOf(1)
			persisted_notes = get_past_and_present_notes(state)
			state = discard_all_pending_actions(state)

			next_id = File.get_ideal_basename(state.files[file_ut_basename])
			expect(next_id).to.equal(file_ut_basename) // should be stable!!!

			//console.log(to_string(state))
			//console.log(Notes.to_string(persisted_notes))
		})
	})
})
