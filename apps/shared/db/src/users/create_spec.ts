/////////////////////

import {expect} from 'chai'

import { LIB } from '../consts'
import { BaseUser } from './types'
import { create_user } from './create'
import { delete_user_by_email } from './delete'

/////////////////////

describe(`${LIB} - create`, function() {

	function get_test_base_user(p: Partial<BaseUser> = {}): Readonly<BaseUser> {
		return {
			called: 'The Tester',
			email: 'test@test.io',
			avatar_url: 'https://some.gravatar/test',
			roles: [],
			...p,
		}
	}

	async function cleanup() {
		await delete_user_by_email(get_test_base_user().email)
	}

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
})
