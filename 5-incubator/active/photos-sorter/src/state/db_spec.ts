import { expect } from 'chai'

import { Immutable } from '@offirmo-private/ts-types'

import { LIB } from '../consts'
import {
	State,
	create,
	on_folder_found,
	on_file_found,
	on_hash_computed,
	on_fs_stats_read,
	on_exif_read,
	on_fs_exploration_done,

	consolidate_and_backup_original_data,

	clean_up_duplicates,

	on_file_deleted,

	to_string,
} from './db'
import {
	TEST_FILES_DIR_ABS,
} from '../__test_shared/real_files'
import { create_better_date, get_exif_datetime, get_timestamp_utc_ms_from } from '../services/better-date'

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

			state = on_fs_exploration_done(state)
			/*state = on_media_file_notes_recovered(state, 'foo.jpg', null)
			state = on_media_file_notes_recovered(state, 'bar.jpg', null)
			state = on_media_file_notes_recovered(state, 'baz.jpg', null)*/

			expect(state.encountered_hash_count['hash01'], '01').to.equal(1)
			expect(state.encountered_hash_count['hash02'], '02').to.equal(2)

			state = consolidate_and_backup_original_data(state)
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
})
