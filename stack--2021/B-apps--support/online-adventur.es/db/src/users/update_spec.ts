/////////////////////
import {expect} from 'chai'

import { LIB } from '../consts'
import get_db from '../db'
import { TABLE__USERS } from './consts'
import {
	create_user,
	get_base_user_from_netlify_user,
} from './create'
import {
	ensure_user_through_netlify,
} from './update'
import {
	get_test_base_user_01,
	get_test_netlify_user_01,
	get_test_netlify_user_01_alt,
	cleanup,
} from './_test_helpers'
import { extract_base, sanitize_persisted } from './common'
import { get_by_email } from './read'

////////////////////////////////////

describe(`${LIB} - ${TABLE__USERS} - update`, function() {
	before(cleanup)
	afterEach(cleanup)

	describe('ensure_user_through_netlify()', function () {

		it('should work when no user', async () => {
			const base_n = get_test_netlify_user_01()

			const user = await ensure_user_through_netlify(base_n, get_db())

			expect(extract_base(user)).to.deep.equal(get_base_user_from_netlify_user(base_n))
		})

		it('should link to an existing user if any', async () => {
			const base = get_test_base_user_01()
			const existing_user_id = await create_user(base)

			const user = await ensure_user_through_netlify(get_test_netlify_user_01(), get_db())

			expect(user.id).to.equal(existing_user_id)
			expect(extract_base(user)).to.deep.equal(sanitize_persisted(base))
		})

		it('should work when everything already there', async () => {
			const base_n = get_test_netlify_user_01()

			const user_1 = await ensure_user_through_netlify(base_n, get_db())
			const user_2 = await ensure_user_through_netlify(base_n, get_db())

			expect(extract_base(user_1)).to.deep.equal(get_base_user_from_netlify_user(base_n))
			expect(extract_base(user_2)).to.deep.equal(get_base_user_from_netlify_user(base_n))
		})

		it('should update the existing user if any', async () => {
			const old_base = get_test_base_user_01()
			const existing_user_id = await create_user(old_base)

			const new_base_n = get_test_netlify_user_01({
				full_name: 'John  Smith',
				roles: ['unit-tests--users--test-role'],
			})

			const expected_final_data = {
				...get_base_user_from_netlify_user(new_base_n),
				called: sanitize_persisted(old_base).called, // not replaced once set
				roles: [ 'test', 'unit-tests--users--test-role' ] // merged
			}

			const user_through_netlify = await ensure_user_through_netlify(new_base_n, get_db())
			// note: what is returned is inferred, must be = DB but technically not read from it
			//console.log({ old_base, new_base_n, user_through_netlify })

			expect(user_through_netlify.id).to.equal(existing_user_id)
			expect(user_through_netlify.roles)
				.to.deep.equal(Array.from(new Set([...old_base.roles, ...new_base_n.roles])).sort())
			expect(extract_base(user_through_netlify), 'eu-nb').to.deep.equal(expected_final_data)
			expect(extract_base(user_through_netlify), 'eu-ob').not.to.deep.equal(sanitize_persisted(old_base))

			// re-read from DB
			const updated_user = await get_by_email(new_base_n.email)
			//console.log('final test', {user_through_netlify, updated_user})
			expect(updated_user).not.to.be.null
			expect(updated_user!.id).to.equal(existing_user_id)
			expect(extract_base(updated_user!), 'uu-ob').not.to.deep.equal(sanitize_persisted(old_base))
			expect(extract_base(updated_user!), 'uu-nb').to.deep.equal(expected_final_data)
		})

		it('should link to an existing user even if its from a different netlify profile', async () => {
			const base = get_test_base_user_01()
			const existing_user_id = await create_user(base)

			const user_1 = await ensure_user_through_netlify(get_test_netlify_user_01(), get_db())

			expect(user_1.id).to.equal(existing_user_id)
			expect(extract_base(user_1)).to.deep.equal(sanitize_persisted(base))

			const user_2 = await ensure_user_through_netlify(get_test_netlify_user_01_alt(), get_db())

			expect(user_2.id).to.equal(existing_user_id)
			expect(extract_base(user_2)).to.deep.equal(sanitize_persisted(base))
		})
	})
})
