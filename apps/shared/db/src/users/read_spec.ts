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
	get_full_user_through_netlify,
	get_user_by_email,
} from './read'
import { TEST_NETLIFY_ID, get_test_base_user, cleanup } from './_shared_spec'

/////////////////////

describe(`${LIB} - users - read`, () => {
	before(cleanup)
	afterEach(cleanup)

	describe('get_user_by_email()', function () {

		it('should work', async () => {
			const base = get_test_base_user()
			const id = await create_user(base)

			const user = await get_user_by_email(base.email)
			expect(user).not.to.be.null
			//console.log(user)
			expect(user!.id).to.equal(id)
			const {
				called,
				email,
				avatar_url,
				roles,
			} = user!
			expect({
				called,
				email,
				avatar_url,
				roles,
			}).to.deep.equal(get_test_base_user())
		})
	})

	describe('get_full_user_through_netlify()', function () {

		it('should work', async () => {
			const base = get_test_base_user()
			const cres = await create_user_through_netlify(TEST_NETLIFY_ID, base, get_db())
			console.log({ cres })

			const merged_user = await get_full_user_through_netlify(TEST_NETLIFY_ID)
			console.log({ merged_user })
			expect(merged_user?.id).to.equal(cres.user_id)
		})
	})
})
