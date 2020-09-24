/////////////////////

import {expect} from 'chai'

import { LIB } from '../consts'
import get_db from '../db'
import { TABLE__USERS } from './consts'
import {
	create_user,
	create_user_through_netlify,
} from './create'
import {
	get_by_netlify,
	get_by_email,
} from './read'
import {
	TEST_NETLIFY_ID,
	get_test_base_user_01,
	get_test_netlify_user_01,
	cleanup
} from './_test_helpers'
import { sanitize_persisted } from './common'

/////////////////////

describe(`${LIB} - ${TABLE__USERS} - read`, () => {
	before(cleanup)
	afterEach(cleanup)

	describe('get_by_email()', function () {

		it('should work if existing', async () => {
			const base = get_test_base_user_01()
			const id = await create_user(base)

			const user = await get_by_email(base.raw_email)
			expect(user).not.to.be.null
			//console.log(user)
			expect(user!.id).to.equal(id)
			const {
				called,
				raw_email,
				normalized_email,
				avatar_url,
				roles,
			} = user!

			expect({
				called,
				raw_email,
				normalized_email,
				avatar_url,
				roles,
			}).to.deep.equal(sanitize_persisted(get_test_base_user_01()))
		})

		it('should work if NOT existing', async () => {
			const base = get_test_base_user_01()

			const user = await get_by_email(base.raw_email)
			expect(user).to.be.null
		})
	})

	describe('get_by_netlify()', function () {

		it('should work when all existing', async () => {
			const base = get_test_netlify_user_01()
			const cres = await create_user_through_netlify(base, get_db())
			console.log({ cres })

			const user = await get_by_netlify({netlify_id: TEST_NETLIFY_ID})
			//console.log({ user })
			expect(user?.id).to.equal(cres.user_id)
		})

		it('should return null when NO Netlify user NOR user', async () => {
			const user = await get_by_netlify({netlify_id: TEST_NETLIFY_ID})
			expect(user).to.be.null
		})

		it('should return null when no Netlify even if existing user', async () => {
			const base = get_test_base_user_01()
			const user_id = await create_user(base)

			const user = await get_by_netlify({netlify_id: TEST_NETLIFY_ID, email: base.raw_email})
			expect(user).to.be.null
		})
	})

	describe('auto-sanitization', function() {
		it('should work', async () => {
			const base = get_test_base_user_01()
			await create_user(base)

			const user = await get_by_email(base.raw_email)

			const {
				called,
				raw_email,
				normalized_email,
				avatar_url,
				roles,
			} = user!

			expect({
				called,
				raw_email,
				normalized_email,
				avatar_url,
				roles,
			}).not.to.deep.equal(get_test_base_user_01())

			expect({
				called,
				raw_email,
				normalized_email,
				avatar_url,
				roles,
			}).to.deep.equal(sanitize_persisted(get_test_base_user_01()))
		})
	})
})
