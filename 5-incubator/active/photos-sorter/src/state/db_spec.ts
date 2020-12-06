import { expect } from 'chai'

import { Immutable } from '@offirmo-private/ts-types'

import { LIB } from '../consts'
import {
	State,
	create,
	on_folder_found,
	on_file_found,
	on_hash_computed,
	to_string,
} from './db'
import {
	TEST_FILES_DIR_ABS,
} from '../__test_shared/real_files'
import { RelativePath } from '../types'
import { FileHash } from '../services/hash'
import logger from '../services/logger'
import * as File from './file'

/////////////////////

describe(`${LIB} - root state`, function() {


	describe('de-duplication', function() {

		it.only('should detect duplicated files', function () {
			let state = create(TEST_FILES_DIR_ABS)

			state = on_folder_found(state, '.', '.')
			state = on_file_found(state, '.', 'foo.jpg')
			state = on_file_found(state, '.', 'bar.jpg')
			state = on_file_found(state, '.', 'baz.jpg')
			state = on_hash_computed(state, 'foo.jpg', 'hash01')
			state = on_hash_computed(state, 'bar.jpg', 'hash02')
			state = on_hash_computed(state, 'bar.jpg', 'hash01')

			expect(state.encountered_hashes['hash01'], '01').to.be.true
			expect(state.encountered_hashes['hash02'], '02').to.be.false

			console.log(to_string(state))
		})
	})
})
