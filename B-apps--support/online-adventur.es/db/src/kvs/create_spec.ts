/////////////////////

import { expect, assert } from 'chai'

import { LIB } from '../consts'
import get_db from '../db'
import {
	get_test_base_user_01,
	get_test_base_user_02,
	cleanup as user_cleanup,
} from '../users/_test_helpers'
import { create_user } from '../users'
import { TABLE__KEY_VALUES } from './consts'
import {
	create_kv_entry
} from './create'
import {
	get_value,
} from './read'

////////////////////////////////////

describe(`${LIB} - ${TABLE__KEY_VALUES} - create`, function() {
	let TEST_USER1_ID = -1
	let TEST_USER2_ID = -1
	const key = 'unit-tests--kv--test-key'
	before(user_cleanup)
	beforeEach(async () => {
		TEST_USER1_ID = await create_user(get_test_base_user_01())
		TEST_USER2_ID = await create_user(get_test_base_user_02())
	})
	afterEach(user_cleanup)


	const TEST_DATA = { bar: { baz: 42 }}

	describe('create_kv_entry()', function () {

		it('should work in nominal condition', async () => {
			await create_kv_entry({
				user_id: TEST_USER1_ID,
				key,
				value: TEST_DATA,
			})

			const data = await get_value({
				user_id: TEST_USER1_ID,
				key,
			})
			//console.log(data)
			expect(data).to.deep.equal(TEST_DATA)
		})

		it('should NOT work if duplicated key - same user', async () => {
			await create_kv_entry({
				user_id: TEST_USER1_ID,
				key,
				value: TEST_DATA,
			})

			await expect(create_kv_entry({
				user_id: TEST_USER1_ID,
				key,
				value: {'baz': 33},
			})).to.be.rejectedWith('duplicate')

			expect(await get_value({ user_id: TEST_USER1_ID, key })).to.deep.equal(TEST_DATA)
		})

		it('should work if duplicated key but different user', async () => {
			await create_kv_entry({
				user_id: TEST_USER1_ID,
				key,
				value: TEST_DATA,
			})
			await create_kv_entry({
				user_id: TEST_USER2_ID,
				key,
				value: TEST_DATA,
			})

			expect(await get_value({ user_id: TEST_USER1_ID, key })).to.deep.equal(TEST_DATA)
			expect(await get_value({ user_id: TEST_USER2_ID, key })).to.deep.equal(TEST_DATA)
		})
	})
})
