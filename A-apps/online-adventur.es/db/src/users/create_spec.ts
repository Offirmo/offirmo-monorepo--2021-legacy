/////////////////////

import {expect} from 'chai'

import { LIB } from '../consts'
import get_db from '../db'
import { TABLE__USERS } from './consts'
import {
	create_netlify_user,
	create_user,
	create_user_through_netlify,
} from './create'
import {
	EMAIL_01_ALT,
	TEST_NETLIFY_ID,
	get_test_base_netlify_user,
	get_test_base_user_01,
	get_test_netlify_user_01,
	cleanup,
} from './_test_helpers'

////////////////////////////////////

describe(`${LIB} - ${TABLE__USERS} - create`, function() {

	before(cleanup)
	afterEach(cleanup)

	describe('create_user()', function () {

		it('should work in nominal condition', async () => {
			const base = get_test_base_user_01()
			const id = await create_user(base)
			expect(id).not.to.be.null
			expect(id).to.be.above(0)
		})

		it('should NOT work if duplicated email - normal', async () => {
			const base = get_test_base_user_01()

			await create_user(base)
			await expect(create_user(base)).to.be.rejectedWith('duplicate')
		})

		it('should NOT work if duplicated email - variant', async () => {
			await create_user(get_test_base_user_01())
			await expect(create_user(get_test_base_user_01({raw_email: EMAIL_01_ALT})))
				.to.be.rejectedWith('duplicate')
		})
	})

	describe('create_netlify_user()', () => {
		let test_user_id = -1
		beforeEach(async () => {
			test_user_id = await create_user(get_test_base_user_01())
		})

		it('should work in nominal condition', async () => {
			const { own_id, user_id } = await create_netlify_user(get_test_base_netlify_user(test_user_id))
			expect(own_id).to.equal(TEST_NETLIFY_ID)
			expect(user_id).to.equal(test_user_id)
		})

		it('should NOT work if duplicated', async () => {
			await create_netlify_user(get_test_base_netlify_user(test_user_id))
			await expect(create_netlify_user(get_test_base_netlify_user(test_user_id))).to.be.rejectedWith('duplicate')
		})
	})

	describe('create_user_through_netlify()', () => {

		context('when it’s a new user', () => {

			it('should work', async () => {
				const { own_id, user_id } = await create_user_through_netlify(get_test_netlify_user_01(), get_db())
				expect(own_id).to.equal(TEST_NETLIFY_ID)
				expect(user_id).to.be.above(0)
			})
		})

		context('when this netlify user already exists', async () => {

			it('should crash and not create duplicate data (transaction)', async () => {
				await create_user_through_netlify(get_test_netlify_user_01(), get_db())
				await expect(create_user_through_netlify(get_test_netlify_user_01(), get_db()))
					.to.be.rejectedWith('duplicate')
			})
		})

		context('when a user with this email already exists', async () => {

			// REM: the "clever" implementation is "ensure_xxx"
			it('should crash and not create duplicate data', async () => {
				await create_user(get_test_base_user_01())
				await expect(create_user_through_netlify(get_test_netlify_user_01(), get_db()))
					.to.be.rejectedWith('duplicate')
			})
		})
	})
})
