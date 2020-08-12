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
	upsert_kv_entry,
	set_kv_entry,
} from './update'
import {
	get,
	get_value,
} from './read'

////////////////////////////////////

describe(`${LIB} - ${TABLE__KEY_VALUES} - update`, function() {
	let TEST_USER1_ID = -1
	let TEST_USER2_ID = -1
	before(user_cleanup)
	beforeEach(async () => {
		TEST_USER1_ID = await create_user(get_test_base_user_01())
		TEST_USER2_ID = await create_user(get_test_base_user_02())
	})
	afterEach(user_cleanup)

	const TEST_DATA_1 = { bar: 42 }
	const TEST_DATA_2 = { bar: { baz: 42 }}
	const TEST_DATA_3 = { foo: { bar: { baz: 42 }}}

	describe('upsert()', function () {

		it('should work in create condition', async () => {
			await upsert_kv_entry({
				user_id: TEST_USER1_ID,
				key: 'foo',
				value: TEST_DATA_1,
			})

			const actual = await get({ user_id: TEST_USER1_ID, key: 'foo' })
			expect(actual.value).to.deep.equal(TEST_DATA_1)
			expect(actual['bkp']).to.deep.equal(null)
			expect(actual['v-1']).to.deep.equal(null)
			expect(actual['v-2']).to.deep.equal(null)
		})

		it('should work in update condition', async () => {
			await upsert_kv_entry({
				user_id: TEST_USER1_ID,
				key: 'foo',
				value: TEST_DATA_1,
			})
			await upsert_kv_entry({
				user_id: TEST_USER1_ID,
				key: 'foo',
				value: TEST_DATA_2,
			})
			const actual = await get({ user_id: TEST_USER1_ID, key: 'foo' })
			expect(actual.value).to.deep.equal(TEST_DATA_2)
			expect(actual['bkp']).to.deep.equal(null)
			expect(actual['v-1']).to.deep.equal(null)
			expect(actual['v-2']).to.deep.equal(null)
		})
	})

	describe('set_kv_entry()', function () {

		it('should work in create condition', async () => {
			await set_kv_entry({
				user_id: TEST_USER1_ID,
				key: 'foo',
				value: TEST_DATA_1,
			})

			const actual = await get({ user_id: TEST_USER1_ID, key: 'foo' })
			expect(actual.value).to.deep.equal(TEST_DATA_1)
			expect(actual['bkp']).to.deep.equal(null)
			expect(actual['v-1']).to.deep.equal(null)
			expect(actual['v-2']).to.deep.equal(null)
		})

		it.only('should work in update condition', async () => {
			await set_kv_entry({
				user_id: TEST_USER1_ID,
				key: 'foo',
				value: TEST_DATA_1,
			})
			await set_kv_entry({
				user_id: TEST_USER1_ID,
				key: 'foo',
				value: TEST_DATA_2,
			})

			const actual = await get({ user_id: TEST_USER1_ID, key: 'foo' })
			expect(actual.value).to.deep.equal(TEST_DATA_2)
			expect(actual['bkp']).to.deep.equal(TEST_DATA_1)
			expect(actual['v-1']).to.deep.equal(null)
			expect(actual['v-2']).to.deep.equal(null)
		})
	})
})
