/////////////////////
import {expect} from 'chai'

import { LIB } from '../consts'
import { BaseUser, PNetlifyUser } from './types'
import get_db from '../db'
import { delete_user_by_email } from './delete'
import {
	create_user,
	netlify_to_base_user,
} from './create'
import {
	ensure_user_through_netlify,
	ensure_user_up_to_date,
} from './update'
import {
	TEST_NETLIFY_ID,
	get_test_base_user_01,
	get_test_netlify_user_01,
	cleanup,
} from './_common_spec'
import {extract_base_user, sanitize_persisted} from "./common";
import {get_user_by_email} from "./read";

////////////////////////////////////

describe(`${LIB} - users - update`, function() {
	before(cleanup)
	afterEach(cleanup)

	describe('ensure_user_through_netlify()', function () {

		it('should work when no user', async () => {
			const base_n = get_test_netlify_user_01()

			const user = await ensure_user_through_netlify(base_n, get_db())

			expect(extract_base_user(user)).to.deep.equal(netlify_to_base_user(base_n))
		})

		it('should link to an existing user if any', async () => {
			const base = get_test_base_user_01()
			const existing_user_id = await create_user(base)

			const user = await ensure_user_through_netlify(get_test_netlify_user_01(), get_db())

			expect(user.id).to.equal(existing_user_id)
			expect(extract_base_user(user)).to.deep.equal(sanitize_persisted(base))
		})

		it.only('should update the existing user if any', async () => {
			const old_base = get_test_base_user_01()
			const existing_user_id = await create_user(old_base)

			const new_base_n = get_test_netlify_user_01({
				full_name: 'John  Smith',
				roles: ['foo'],
			})

			const user_through_netlify = await ensure_user_through_netlify(new_base_n, get_db())
			//console.log({ old_base, new_base_n, user_through_netlify })

			expect(user_through_netlify.id).to.equal(existing_user_id)
			expect(user_through_netlify.roles)
				.to.deep.equal(Array.from(new Set([...old_base.roles, ...new_base_n.roles])).sort())
			expect(extract_base_user(user_through_netlify), 'eu-nb').to.deep.equal(netlify_to_base_user(new_base_n))
			expect(extract_base_user(user_through_netlify), 'eu-ob').not.to.deep.equal(sanitize_persisted(old_base))

			const updated_user = await get_user_by_email(new_base_n.email)
			console.log({user_through_netlify, updated_user})
			expect(updated_user).not.to.be.null
			expect(updated_user!.id).to.equal(existing_user_id)
			expect(extract_base_user(updated_user!), 'uu-ob').not.to.deep.equal(sanitize_persisted(old_base))
			expect(extract_base_user(updated_user!), 'uu-nb').to.deep.equal(netlify_to_base_user(new_base_n))
			expect(extract_base_user(updated_user!), 'uu-eu').to.deep.equal(extract_base_user(user_through_netlify))
		})
	})
})
