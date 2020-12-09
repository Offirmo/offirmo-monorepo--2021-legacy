import { expect } from 'chai'

import { Immutable } from '@offirmo-private/ts-types'

import { LIB } from '../consts'
import {
	State,
	create,
	on_folder_found,
	on_file_found,
	on_hash_computed,
	on_media_file_notes_recovered,

	clean_up_duplicates,

	on_file_deleted,

	to_string,
} from './db'
import {
	TEST_FILES_DIR_ABS,
} from '../__test_shared/real_files'

/////////////////////

describe(`${LIB} - root state`, function() {


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

			state = on_media_file_notes_recovered(state, 'foo.jpg', null)
			state = on_media_file_notes_recovered(state, 'bar.jpg', null)
			state = on_media_file_notes_recovered(state, 'baz.jpg', null)

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
})
