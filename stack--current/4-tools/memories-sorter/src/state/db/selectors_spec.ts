import { expect } from 'chai'
import path from 'path'
import { Immutable } from '@offirmo-private/ts-types'

import { get_test_single_file_DB_state_generator } from '../../__test_shared/utils'
import { LIB } from '../../consts'
import * as Notes from '../notes'
import {
	clean_up_duplicates,
	create,
	is_folder_existing,
	is_file_existing,
	discard_all_pending_actions,
	get_first_pending_action,
	get_ideal_file_relative_path,
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
import {
	create_better_date,
	_get_exif_datetime,
	get_timestamp_utc_ms_from,
	get_compact_date,
} from '../../services/better-date'
import * as File from '../file'
import * as Folder from '../folder'

/////////////////////

describe(`${LIB} - DB (root) state`, function() {

	describe('selectors', function() {

		const CREATION_DATE = create_better_date('tz:auto', 2017, 10, 20, 5, 1, 44, 625)
		const CREATION_DATE_MS = get_timestamp_utc_ms_from(CREATION_DATE)
		//console.log(state.queue)
		//console.log(to_string(state))

		// TODO use the common test utils
		function _create_demo_state(file_basename = 'bar.xyz') {
			let file_parent = 'foo'
			let file_id = path.join(file_parent, file_basename)

			let state = create('root')

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

			return state
		}

		describe('is_folder_existing()', function() {

			it('should work', () => {
				let state = _create_demo_state()

				expect(is_folder_existing(state, '.')).to.be.true
				expect(is_folder_existing(state, 'foo')).to.be.true
				expect(is_folder_existing(state, 'bar')).to.be.false
				expect(is_folder_existing(state, 'foo/bar')).to.be.false
				expect(is_folder_existing(state, 'foo/bar.xyz')).to.be.false
			})
		})

		describe('is_file_existing()', function() {

			it('should work', () => {
				let state = _create_demo_state()

				expect(is_file_existing(state, '.')).to.be.false
				expect(is_file_existing(state, 'foo')).to.be.false
				expect(is_file_existing(state, 'foo/bar')).to.be.false
				expect(is_file_existing(state, 'foo/bar.xyz')).to.be.true
				expect(is_file_existing(state, 'foo/bar.xyz/hahaha')).to.be.false
			})
		})

		describe('get_ideal_file_relative_path()', function() {
			// intentionally pick a SUNDAY to showcase the auto-weekend
			const CREATION_DATE = create_better_date('tz:auto', 2016, 11, 20, 12, 12, 0, 12)
			const CREATION_DATE_MS = get_timestamp_utc_ms_from(CREATION_DATE)

			const stategen = get_test_single_file_DB_state_generator()
			beforeEach(() => {
				stategen.reset()
				stategen.inputs.file.dateⵧfsⵧcurrent‿tms = CREATION_DATE_MS
			})

			describe('copy markers handling', function() {

				it('should remove copy markers', () => {
					stategen.inputs.file.basenameⵧcurrent = 'bar - copie 3.xyz'

					let state = stategen.create_state()
					const file_id = stategen.get_file_id()

					// underlying function
					expect(File.get_ideal_basename(state.files[file_id]), 'get_ideal_basename').to.equal('bar.xyz')


					expect(get_ideal_file_relative_path(state, file_id), 'get_ideal_file_relative_path').to.equal(path.join(
						'- cant_recognize', 'foo',
						//'2016', '20161120 - foo',
						'bar.xyz',
					))
				})

				context('when a conflict happened and was handled by the underlying action', function() {

					it('should accept the potential renaming but still remove copy markers', () => {
						let file_parent = 'foo'
						let file_basename_a = 'bar.png'
						let file_basename_b = 'bar - copy 3.png'

						let file_id_a = path.join(file_parent, file_basename_a)
						let file_id_b = path.join(file_parent, file_basename_b)

						let state = create('root')

						state = on_folder_found(state, '', '.')
						state = on_folder_found(state, '', file_parent)
						state = on_file_found(state, '.', file_id_a)
						state = on_file_found(state, '.', file_id_b)
						state = on_hash_computed(state, file_id_a, 'hash01')
						state = on_hash_computed(state, file_id_b, 'hash02') // MUST have different hashes to be a real conflict!
						state = on_fs_stats_read(state, file_id_a, {
							birthtimeMs: CREATION_DATE_MS, // REM 2016/11/20 = a Sunday
							atimeMs:     CREATION_DATE_MS,
							mtimeMs:     CREATION_DATE_MS,
							ctimeMs:     CREATION_DATE_MS,
						})
						state = on_fs_stats_read(state, file_id_b, {
							birthtimeMs: CREATION_DATE_MS,
							atimeMs:     CREATION_DATE_MS,
							mtimeMs:     CREATION_DATE_MS,
							ctimeMs:     CREATION_DATE_MS,
						})
						state = on_fs_exploration_done_consolidate_data_and_backup_originals(state)

						// quick re-check of the underlying function
						expect(File.get_ideal_basename(state.files[file_id_a]), 'Fgib_a').to.equal('bar.png')
						expect(File.get_ideal_basename(state.files[file_id_b]), 'Fgib_b').to.equal('bar.png')
						expect(
							File.get_ideal_basename(state.files[file_id_b], { copy_marker: 'preserve'}),
							'Fgib_b_preserve',
						).to.equal('bar (3).png')

						// 1st file is fine, no conflict during normalization
						// not an actual move state = on_file_moved(state, file_id_a, [ file_parent, File.get_ideal_basename(state.files[file_id_a])].join(path.sep))
						// however, the second normalization discovers that there is a conflict and restores the marker
						let next_file_id_b = [ file_parent, File.get_ideal_basename(state.files[file_id_b], { copy_marker: 'preserve'})].join(path.sep)
						state = on_file_moved(state, file_id_b, next_file_id_b)
						file_id_b = next_file_id_b

						// however that doesn't impact the "ideal" name
						expect(get_ideal_file_relative_path(state, file_id_a)).to.equal(path.join(
							//Folder.SPECIAL_FOLDERⵧCANT_AUTOSORT__BASENAME, // due to not dated, not event
							//'foo',
							'2016',
							//'20161119 - weekend', NO! we have a folder = we keep its name and no need to extend the date
							'20161120 - foo',
							'bar.png',
						))
						expect(get_ideal_file_relative_path(state, file_id_b)).to.equal(path.join(
							//Folder.SPECIAL_FOLDERⵧCANT_AUTOSORT__BASENAME, // due to not dated, not event
							//'foo',
							'2016',
							'20161120 - foo',
							'bar.png',
						))
					})
				})
			})

			context('when media file', function() {

				// TODO how to simulate junk?
				context.skip('when confident in the date up to JUNK', function() {
					beforeEach(() => {
						stategen.inputs.file.basenameⵧcurrent = 'foo.png' // png = without EXIF = not confident
					})

					context('when already well placed -- in cantsort', function () {
						beforeEach(() => {
							stategen.inputs.file.parent_pathⵧcurrent‿relative = Folder.SPECIAL_FOLDERⵧCANT_AUTOSORT__BASENAME
						})

						it('should stay stable', () => {
							let state = stategen.create_state()
							const file_id = stategen.get_file_id()

							expect(File.get_ideal_basename(state.files[file_id])).to.equal('foo.png') // THIS TEST
							expect(File.get_best_creation_date‿meta(state.files[file_id]).confidence).to.equal('secondary') // THIS TEST

							expect(get_ideal_file_relative_path(state, file_id)).to.equal(path.join(
								Folder.SPECIAL_FOLDERⵧCANT_AUTOSORT__BASENAME,
								'foo.png'
							))
						})
					})

					context('when already well placed -- in an event folder', function () {
						beforeEach(() => {
							//stategen.inputs.extra_parent = '2017'
							stategen.inputs.file.parent_pathⵧcurrent‿relative = '2017/20171020 - something'
						})

						it('should stay stable', () => {
							let state = stategen.create_state()
							const file_id = stategen.get_file_id()

							expect(File.get_ideal_basename(state.files[file_id])).to.equal('foo.png') // THIS TEST
							expect(File.is_confident_in_date_enough_to__sort(state.files[file_id])).to.be.false // THIS TEST

							expect(get_ideal_file_relative_path(state, file_id)).to.equal(path.join(
								'2017',
								'20171020 - life',
								'foo.png'
							))
						})
					})

					context('when NOT already well placed -- in a special folder', function () {
						beforeEach(() => {
							stategen.inputs.file.parent_pathⵧcurrent‿relative = '- inbox'
						})

						it('should swap the special folder to "cantsort" while preserving the base and path', () => {
							let state = stategen.create_state()
							const file_id = stategen.get_file_id()

							expect(File.get_ideal_basename(state.files[file_id]), 'pr1').to.equal(stategen.inputs.file.basenameⵧcurrent) // THIS TEST
							expect(File.get_best_creation_date‿meta(state.files[file_id]).confidence, 'pr2').to.equal('secondary') // THIS TEST

							expect(get_ideal_file_relative_path(state, file_id)).to.equal(path.join(
								Folder.SPECIAL_FOLDERⵧCANT_AUTOSORT__BASENAME,
								'foo.png',
							))
						})
					})

					context('when NOT already well placed -- in a random other folder', function () {

						it('should move to "cantsort" while preserving the base and path', () => {
							let file_parent = 'hello'
							let file_basename = 'foo.png'
							let file_id = path.join(file_parent, file_basename)

							let state = create('root')

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
							expect(File.is_confident_in_date_enough_to__sort(state.files[file_id])).to.be.false // THIS TEST

							expect(get_ideal_file_relative_path(state, file_id)).to.equal(path.join(
								Folder.SPECIAL_FOLDERⵧCANT_AUTOSORT__BASENAME,
								'hello',
								'foo.png',
							))
						})
					})
				})

				context('when confident in the date up to SECONDARY', function() {
					beforeEach(() => {
						stategen.inputs.file.dateⵧexif = null
						stategen.inputs.file.basenameⵧcurrent = 'foo.png' // png = without EXIF = not confident
					})

					context('when already well placed -- in an event folder (manually sorted) REDUNDANT', function () {
						beforeEach(() => {
							// TODO review deletion of this UT
							stategen.inputs.file.parent_pathⵧcurrent‿relative = '2016/20161119 - something'
							stategen.inputs.file.dateⵧfsⵧcurrent‿tms = 1234 // to downgrade confidence
						})

						it('should stay stable', () => {
							// if already in a canonical event folder, assume it was manually sorted
							let state = stategen.create_state()
							const file_id = stategen.get_file_id()

							// pre-conditions
							expect(File.get_best_creation_date‿meta(state.files[file_id]).confidence).to.equal('secondary') // THIS TEST
							expect(File.get_ideal_basename(state.files[file_id])).to.equal('foo.png') // THIS TEST

							expect(get_ideal_file_relative_path(state, file_id)).to.equal(path.join(
								'2016',
								'20161119 - something',
								'foo.png'
							))
						})
					})

					context('when NOT already well placed -- in cantsort', function () {
						beforeEach(() => {
							stategen.inputs.file.parent_pathⵧcurrent‿relative = Folder.SPECIAL_FOLDERⵧCANT_AUTOSORT__BASENAME
						})

						it('should move to an event folder', () => {
							let state = stategen.create_state()
							const file_id = stategen.get_file_id()

							expect(File.get_best_creation_date‿meta(state.files[file_id]).confidence).to.equal('secondary') // THIS TEST
							expect(File.get_ideal_basename(state.files[file_id])).to.equal('foo.png') // THIS TEST

							expect(get_ideal_file_relative_path(state, file_id)).to.equal(path.join(
								'2016',
								'20161119 - weekend',
								'foo.png', // not renamed, secondary
							))
						})
					})

					context('when NOT already well placed -- in a special folder', function () {
						beforeEach(() => {
							stategen.inputs.file.parent_pathⵧcurrent‿relative = '- inbox'
						})

						it('should move to an event folder', () => {
							let state = stategen.create_state()
							const file_id = stategen.get_file_id()

							expect(File.get_best_creation_date‿meta(state.files[file_id]).confidence).to.equal('secondary') // THIS TEST
							expect(File.get_ideal_basename(state.files[file_id]), 'pr1').to.equal(stategen.inputs.file.basenameⵧcurrent) // THIS TEST

							expect(get_ideal_file_relative_path(state, file_id)).to.equal(path.join(
								'2016',
								'20161119 - weekend',
								'foo.png', // not renamed, secondary
							))
						})
					})

					context('when NOT already well placed -- in an OTHER event folder than the bcd (= manually sorted)', function () {
						beforeEach(() => {
							//stategen.inputs.extra_parent = '2017'
							stategen.inputs.file.parent_pathⵧcurrent‿relative = '2017/20171020 - something'
						})

						// TODO review
						it.skip('should stay stable', () => {
							let state = stategen.create_state()
							const file_id = stategen.get_file_id()

							// preconditions
							const bcdm = File.get_best_creation_date‿meta(state.files[file_id])
							expect(bcdm.confidence).to.equal('secondary') // THIS TEST
							expect(get_compact_date(bcdm.candidate, 'tz:embedded')).to.equal(20171020) // should have taken the date from the parent path
							expect(File.get_ideal_basename(state.files[file_id])).to.equal('foo.png') // THIS TEST

							expect(get_ideal_file_relative_path(state, file_id)).to.equal(path.join(
								'2017',
								'20171020 - something',
								'foo.png'
							))
						})
					})

					context('when NOT already well placed -- in a random other folder', function () {
						beforeEach(() => {
							stategen.inputs.file.parent_pathⵧcurrent‿relative = 'hello'
						})

						it('should move to an event folder', () => {
							let state = stategen.create_state()
							const file_id = stategen.get_file_id()

							const bcdm = File.get_best_creation_date‿meta(state.files[file_id])
							expect(bcdm.confidence).to.equal('secondary') // THIS TEST
							expect(get_compact_date(bcdm.candidate, 'tz:embedded')).to.equal(20161120) // should have taken the date from FS
							expect(File.get_ideal_basename(state.files[file_id]), 'pr1').to.equal(stategen.inputs.file.basenameⵧcurrent) // THIS TEST

							expect(get_ideal_file_relative_path(state, file_id)).to.equal(path.join(
								'2016',
								'20161120 - hello',
								'foo.png', // not renamed, secondary
							))
						})
					})

				})

				context('when confident in the date up to PRIMARY', function() {
					const EXPECTED_IDEAL_BASENAME = 'MM2016-11-20_12h12m00s012_hi.jpg'
					beforeEach(() => {
						stategen.inputs.file.basenameⵧcurrent = 'hi.jpg' // jpg = confidence will come from EXIF
						stategen.inputs.file.dateⵧexif = _get_exif_datetime(CREATION_DATE)
					})

					context('when already well placed -- normalized', function () {
						beforeEach(() => {
							stategen.inputs.file.parent_pathⵧcurrent‿relative = '2016/20161119 - nice weekend'
							stategen.inputs.file.basenameⵧcurrent = EXPECTED_IDEAL_BASENAME
						})

						it('should stay stable', () => {
							let state = stategen.create_state()
							const file_id = stategen.get_file_id()

							expect(File.get_best_creation_date‿meta(state.files[file_id]).confidence).to.equal('primary') // THIS TEST
							expect(File.get_ideal_basename(state.files[file_id])).to.equal(EXPECTED_IDEAL_BASENAME) // THIS TEST

							// stable
							expect(get_ideal_file_relative_path(state, file_id)).to.equal(path.join(
								'2016',
								'20161119 - nice weekend',
								EXPECTED_IDEAL_BASENAME,
							))
						})
					})

					context('when already well placed -- not normalized', function () {
						beforeEach(() => {
							stategen.inputs.file.parent_pathⵧcurrent‿relative = '2016/20161119 - nice weekend'
						})

						it('should stay stable except for the basename', () => {
							let state = stategen.create_state()
							let file_id = stategen.get_file_id()

							expect(File.get_best_creation_date‿meta(state.files[file_id]).confidence).to.equal('primary') // THIS TEST
							expect(File.get_ideal_basename(state.files[file_id])).not.to.equal(stategen.inputs.file.basenameⵧcurrent) // THIS TEST
							expect(File.get_ideal_basename(state.files[file_id])).to.equal(EXPECTED_IDEAL_BASENAME) // THIS TEST

							state = normalize_files_in_place(state)
							const expected_next_id = path.join(
								//stategen.inputs.extra_parent!,
								stategen.inputs.file.parent_pathⵧcurrent‿relative,
								EXPECTED_IDEAL_BASENAME,
							)
							state = on_file_moved(state, file_id, expected_next_id)
							file_id = expected_next_id
							state = discard_all_pending_actions(state)

							expect(get_ideal_file_relative_path(state, file_id)).to.equal(path.join(
								'2016',
								'20161119 - nice weekend',
								EXPECTED_IDEAL_BASENAME,
							))
						})

						it('should stay stable except for the basename -- bug 2021/01/19', () => {
							// TODO force PARAMS "ideal state"
							let file_basename = '20121007_06h14+06-JJ_2012_Montage_Terre_Sainte.xyz' // date in name = source of confidence, not a recognized media
							let file_parent__year = '2012'
							let file_parent__event = '20121006 - weekend'
							let file_id = path.join(file_parent__year, file_parent__event, file_basename)

							let state = create('root')

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
							expect(File.get_ideal_basename(state.files[file_id]), 'pr1').not.to.equal(file_basename) // THIS TEST
							expect(File.is_confident_in_date_enough_to__sort(state.files[file_id]), 'pr2').to.be.true // THIS TEST

							state = discard_all_pending_actions(state)
							state = normalize_files_in_place(state)
							//console.log(state.queue)
							expect(state.queue).to.have.lengthOf(1)
							const expected_next_id = path.join(file_parent__year, file_parent__event, File.get_ideal_basename(state.files[file_id]))
							state = on_file_moved(state, file_id, expected_next_id)
							file_id = expected_next_id
							file_basename = File.get_ideal_basename(state.files[file_id])
							state = discard_all_pending_actions(state)

							expect(get_ideal_file_relative_path(state, file_id)).to.equal(path.join(
								'- cant_recognize', // was moved here
								'2012',
								'20121006 - weekend',
								'JJ_2012_Montage_Terre_Sainte.xyz', // the unreliable processed date got cleaned
							))
						})
					})

					context('when NOT already well placed -- WRONGLY normalized', function () {
						beforeEach(() => {
							stategen.inputs.file.parent_pathⵧcurrent‿relative = '2017/20171020 - unrelated event'
							stategen.inputs.file.basenameⵧcurrent = 'MM2017-10-20_05h01m44s625_hi.jpg'
						})

						// TODO review
						it.skip('should be moved to the correct location and renormalized', () => {
							// justification: must be a bug from a previous pass
							let state = stategen.create_state()
							let file_id = stategen.get_file_id()

							// normalization in-place = prerequisite
							expect(File.get_ideal_basename(state.files[file_id]), 'pr1').to.equal(EXPECTED_IDEAL_BASENAME) // THIS TEST
							expect(File.is_confident_in_date_enough_to__sort(state.files[file_id]), 'pr2').to.be.true // THIS TEST

							// normalization in place
							state = normalize_files_in_place(state)
							const target_id = '2017/20171020 - unrelated event' + '/' + EXPECTED_IDEAL_BASENAME
							state = on_file_moved(state, file_id, target_id)
							file_id = target_id

							// stable
							expect(get_ideal_file_relative_path(state, file_id)).to.equal(path.join(
								'2016',
								'20161120 - unrelated event', // folder got requalified
								EXPECTED_IDEAL_BASENAME,
							))
						})
					})

					context('when NOT already well placed -- not normalized', function () {
						beforeEach(() => {
							stategen.inputs.file.parent_pathⵧcurrent‿relative = '2017/20171020 - unrelated event'
						})

						// TODO review
						it.skip('should be moved to the correct location and normalized', () => {
							let state = stategen.create_state()
							let file_id = stategen.get_file_id()

							// normalization in-place = prerequisite
							expect(File.get_ideal_basename(state.files[file_id])).to.equal(EXPECTED_IDEAL_BASENAME) // THIS TEST
							expect(File.is_confident_in_date_enough_to__sort(state.files[file_id])).to.be.true // THIS TEST

							// normalization in place
							state = normalize_files_in_place(state)
							const target_id = '2017/20171020 - unrelated event' + '/' + EXPECTED_IDEAL_BASENAME
							state = on_file_moved(state, file_id, target_id)
							file_id = target_id

							expect(get_ideal_file_relative_path(state, file_id)).to.equal(path.join(
								'2016',
								'20161120 - unrelated event', // folder got requalified
								EXPECTED_IDEAL_BASENAME,
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

						let state = create('root')

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

						let state = create('root')

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

						let state = create('root')

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
	})
})
