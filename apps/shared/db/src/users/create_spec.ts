/////////////////////

import {expect} from 'chai'

import { LIB } from '../consts'
import {
	create_netlify_user,
	create_user,
	create_user_through_netlify,
} from './create'
import { TEST_NETLIFY_ID, get_test_base_user, cleanup } from './_shared_spec'

/////////////////////

describe(`${LIB} - users - create`, function() {
	before(cleanup)
	afterEach(cleanup)

	describe('create_user()', function () {

		it('should work in nominal condition', async () => {
			const base = get_test_base_user()
			const id = await create_user(base)
			expect(id).not.to.be.null
			expect(id).to.be.above(0)
		})

		it('should NOT work if duplicated email - normal', async () => {
			const base = get_test_base_user()

			await create_user(base)
			expect(create_user(base)).to.be.rejectedWith('duplicate')
		})

		it('should NOT work if duplicated email - variant', async () => {
			await create_user( get_test_base_user())
			expect(create_user(get_test_base_user({email: 'Test@Test. Io'})))
				.to.be.rejectedWith('duplicate')
		})
	})

	describe('create_netlify_user()', () => {
		// TODO
	})

	describe('create_user_through_netlify()', () => {

		context('when its a new user', () => {

			it('should work', async () => {
				const ids = await create_user_through_netlify(TEST_NETLIFY_ID, get_test_base_user())
			})
		})

		context('when this netlify user already exists', async () => {

			it('should crash and not create duplicate data (transaction)', async () => {
				await create_user_through_netlify(TEST_NETLIFY_ID, get_test_base_user())
				expect(create_user_through_netlify(TEST_NETLIFY_ID, get_test_base_user()))
					.to.be.rejectedWith('duplicate')

				// TODO read
			})
		})

		context('when a user with this email already exists', async () => {

			it('should crash and not create duplicate data (transaction)', async () => {
				await create_user(get_test_base_user())
				expect(create_user_through_netlify(TEST_NETLIFY_ID, get_test_base_user()))
					.to.be.rejectedWith('duplicate')

				// TODO read
			})
		})


	})
})
