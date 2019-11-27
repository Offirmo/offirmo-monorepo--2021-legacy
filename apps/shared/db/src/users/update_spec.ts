/////////////////////

import {expect} from 'chai'

import { LIB } from '../consts'
import { BaseUser, NetlifyUser } from './types'
import get_db from '../db'
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

		it.only('should work when no user', async () => {
			const base = get_test_base_user()
			const merged_user = await ensure_user_through_netlify(TEST_NETLIFY_ID, base, get_db())
			console.log(merged_user)
		})

		it('should link to an existing user', async () => {
			const existing_user_id = await create_user( get_test_base_user())
			const { own_id, user_id } = await create_user_through_netlify(TEST_NETLIFY_ID, get_test_base_user(), get_db())
			expect(own_id).to.equal(TEST_NETLIFY_ID)
			expect(user_id).to.equal(existing_user_id)
		})

		it('should work when existing user', async () => {
			const base = get_test_base_user()
			const id = await create_user(base)
			expect(id).not.to.be.null
			expect(id).to.be.above(0)
			const merged_user = await ensure_user_through_netlify(TEST_NETLIFY_ID, base, get_db())
			console.log(merged_user)
		})

		it('should update the user if needed', async () => {

		})
	})

	describe('ensure_user_up_to_date()', () => {

	})
})
