/////////////////////

import {expect} from 'chai'

import { LIB } from '../consts'
import { BaseUser, NetlifyUser } from './types'
import { delete_user_by_email } from './delete'
import {
	create_netlify_user,
	create_user,
	create_user_through_netlify,
} from './create'
import {
	ensure_user_through_netlify,
	ensure_user_up_to_date,
} from './update'
import { TEST_NETLIFY_ID, get_test_base_user, cleanup } from './_shared_spec'

/////////////////////

describe(`${LIB} - users - update`, function() {
	before(cleanup)
	afterEach(cleanup)

	describe('ensure_user_through_netlify()', function () {

		it('should work when no user', async () => {
			const base = get_test_base_user()
			const merged_user = await ensure_user_through_netlify(TEST_NETLIFY_ID, base)
			console.log(merged_user)
		})

		it('should work when existing user', async () => {
			const base = get_test_base_user()
			const id = await create_user(base)
			expect(id).not.to.be.null
			expect(id).to.be.above(0)
			const merged_user = await ensure_user_through_netlify(TEST_NETLIFY_ID, base)
			console.log(merged_user)
		})

		it('should update the user if needed', async () => {

		})
	})

	describe('ensure_user_up_to_date()', () => {

	})
})
