/////////////////////

import { expect, assert } from 'chai'

import {
	BASE_EXAMPLE,
	ROOT_EXAMPLE,
} from '@offirmo-private/state/dist/src.es2019.cjs/_test_helpers'

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

	const TEST_BASE_DATA_1 = { bar: 42 }
	const TEST_BASE_DATA_2 = { bar: { baz: 42 }}
	const TEST_BASE_DATA_3a = { foo: { bar: { baz: 42 }}}
	const TEST_BASE_DATA_3b = { foo: { bar: { baz: 33 }}}

	describe('upsert()', function () {

		it('should work in create condition -- simple', async () => {
			await upsert_kv_entry({
				user_id: TEST_USER1_ID,
				key: 'foo',
				value: TEST_BASE_DATA_3b,
			})

			const actual = (await get({ user_id: TEST_USER1_ID, key: 'foo' }))!
			expect(actual.value).to.deep.equal(TEST_BASE_DATA_3b)
			expect(actual.bkp__recent).to.deep.equal(null)
			expect(actual.bkp__old).to.deep.equal(null)
			expect(actual.bkp__older).to.deep.equal(null)
		})

		it('should work in create condition -- complex', async () => {
			await upsert_kv_entry({
				user_id: TEST_USER1_ID,
				key: 'foo',
				value: TEST_BASE_DATA_3b,
				bkp__recent: TEST_BASE_DATA_3a,
				bkp__old: TEST_BASE_DATA_2,
				bkp__older: TEST_BASE_DATA_1,
			})

			const actual = (await get({ user_id: TEST_USER1_ID, key: 'foo' }))!
			expect(actual.value).to.deep.equal(TEST_BASE_DATA_3b)
			expect(actual['bkp__recent']).to.deep.equal(TEST_BASE_DATA_3a)
			expect(actual.bkp__old).to.deep.equal(TEST_BASE_DATA_2)
			expect(actual.bkp__older).to.deep.equal(TEST_BASE_DATA_1)
		})

		it('should work in update condition -- simple', async () => {
			await upsert_kv_entry({
				user_id: TEST_USER1_ID,
				key: 'foo',
				value: TEST_BASE_DATA_1,
			})
			await upsert_kv_entry({
				user_id: TEST_USER1_ID,
				key: 'foo',
				value: TEST_BASE_DATA_2,
			})
			const actual = (await get({ user_id: TEST_USER1_ID, key: 'foo' }))!
			expect(actual.value).to.deep.equal(TEST_BASE_DATA_2)
			expect(actual['bkp__recent']).to.deep.equal(null) // upsert is the base version, no auto bkp__recent / pre-version
			expect(actual.bkp__old).to.deep.equal(null)
			expect(actual.bkp__older).to.deep.equal(null)
		})

		it('should work in update condition -- complex', async () => {
			await upsert_kv_entry({
				user_id: TEST_USER1_ID,
				key: 'foo',
				value: TEST_BASE_DATA_3a,
				bkp__recent: TEST_BASE_DATA_3b,
				bkp__old: TEST_BASE_DATA_1,
				bkp__older: TEST_BASE_DATA_2,
			})
			await upsert_kv_entry({
				user_id: TEST_USER1_ID,
				key: 'foo',
				value: TEST_BASE_DATA_3b,
				bkp__recent: TEST_BASE_DATA_3a,
				bkp__old: TEST_BASE_DATA_2,
				bkp__older: TEST_BASE_DATA_1,
			})
			const actual = (await get({ user_id: TEST_USER1_ID, key: 'foo' }))!
			expect(actual.value).to.deep.equal(TEST_BASE_DATA_3b)
			expect(actual['bkp__recent']).to.deep.equal(TEST_BASE_DATA_3a)
			expect(actual.bkp__old).to.deep.equal(TEST_BASE_DATA_2)
			expect(actual.bkp__older).to.deep.equal(TEST_BASE_DATA_1)
		})
	})

	describe('set_kv_entry()', function () {

		context('on basic json', function() {

			it('should work in create condition', async () => {
				await set_kv_entry({
					user_id: TEST_USER1_ID,
					key: 'foo',
					value: TEST_BASE_DATA_1,
				})

				const actual = (await get({ user_id: TEST_USER1_ID, key: 'foo' }))!
				expect(actual.value).to.deep.equal(TEST_BASE_DATA_1)
				expect(actual['bkp__recent']).to.deep.equal(null)
				expect(actual.bkp__old).to.deep.equal(null)
				expect(actual.bkp__older).to.deep.equal(null)
			})

			it('should do nothing on identical data', async () => {
				await set_kv_entry({
					user_id: TEST_USER1_ID,
					key: 'foo',
					value: TEST_BASE_DATA_1,
				})

				let actual = (await get({ user_id: TEST_USER1_ID, key: 'foo' }))!
				expect(actual.value).to.deep.equal(TEST_BASE_DATA_1)
				expect(actual['bkp__recent']).to.deep.equal(null)
				expect(actual.bkp__old).to.deep.equal(null)
				expect(actual.bkp__older).to.deep.equal(null)

				await set_kv_entry({
					user_id: TEST_USER1_ID,
					key: 'foo',
					value: TEST_BASE_DATA_1,
				})

				actual = (await get({ user_id: TEST_USER1_ID, key: 'foo' }))!
				expect(actual.value).to.deep.equal(TEST_BASE_DATA_1)
				expect(actual['bkp__recent']).to.deep.equal(null)
				expect(actual.bkp__old).to.deep.equal(null)
				expect(actual.bkp__older).to.deep.equal(null)
			})

			it('should work in update condition -- change x3 = minor bkp pipeline', async () => {
				await set_kv_entry({
					user_id: TEST_USER1_ID,
					key: 'foo',
					value: TEST_BASE_DATA_1,
				})
				await set_kv_entry({
					user_id: TEST_USER1_ID,
					key: 'foo',
					value: TEST_BASE_DATA_2,
				})

				let actual = (await get({ user_id: TEST_USER1_ID, key: 'foo' }))!
				expect(actual.value).to.deep.equal(TEST_BASE_DATA_2)
				expect(actual['bkp__recent']).to.deep.equal(TEST_BASE_DATA_1)
				expect(actual.bkp__old).to.deep.equal(null)
				expect(actual.bkp__older).to.deep.equal(null)

				await set_kv_entry({
					user_id: TEST_USER1_ID,
					key: 'foo',
					value: TEST_BASE_DATA_3a,
				})

				actual = (await get({ user_id: TEST_USER1_ID, key: 'foo' }))!
				expect(actual.value).to.deep.equal(TEST_BASE_DATA_3a)
				expect(actual['bkp__recent']).to.deep.equal(TEST_BASE_DATA_2)
				expect(actual.bkp__old).to.deep.equal(null)
				expect(actual.bkp__older).to.deep.equal(null)
			})
		})

		context('on advanced Offirmo’s states', function() {

			it('should work in create condition', async () => {
				await set_kv_entry({
					user_id: TEST_USER1_ID,
					key: 'foo',
					value: ROOT_EXAMPLE,
				})

				const actual = (await get({ user_id: TEST_USER1_ID, key: 'foo' }))!
				expect(actual.value).to.deep.equal(ROOT_EXAMPLE)
				expect(actual.bkp__recent).to.deep.equal(null)
				expect(actual.bkp__old).to.deep.equal(null)
				expect(actual.bkp__older).to.deep.equal(null)
			})

			it('should do nothing on identical data', async () => {
				await set_kv_entry({
					user_id: TEST_USER1_ID,
					key: 'foo',
					value: ROOT_EXAMPLE,
				})

				let actual = (await get({ user_id: TEST_USER1_ID, key: 'foo' }))!
				expect(actual.value).to.deep.equal(ROOT_EXAMPLE)
				expect(actual.bkp__recent).to.deep.equal(null)
				expect(actual.bkp__old).to.deep.equal(null)
				expect(actual.bkp__older).to.deep.equal(null)

				await set_kv_entry({
					user_id: TEST_USER1_ID,
					key: 'foo',
					value: ROOT_EXAMPLE,
				})

				actual = (await get({ user_id: TEST_USER1_ID, key: 'foo' }))!
				expect(actual.value).to.deep.equal(ROOT_EXAMPLE)
				expect(actual.bkp__recent).to.deep.equal(null)
				expect(actual.bkp__old).to.deep.equal(null)
				expect(actual.bkp__older).to.deep.equal(null)
			})

			it('should work in update condition -- same schema version x3 = minor bkp pipeline', async () => {
				let TEST_ADV_DATA_0 = {
					...ROOT_EXAMPLE,
				}
				let TEST_ADV_DATA_1 = {
					...ROOT_EXAMPLE,
					u_state: {
						...ROOT_EXAMPLE.u_state,
						revision: 123,
					}
				}
				let TEST_ADV_DATA_2 = {
					...ROOT_EXAMPLE,
					u_state: {
						...ROOT_EXAMPLE.u_state,
						revision: 124,
					}
				}
				let TEST_ADV_DATA_3 = {
					...ROOT_EXAMPLE,
					u_state: {
						...ROOT_EXAMPLE.u_state,
						revision: 125,
					}
				}

				await set_kv_entry({
					user_id: TEST_USER1_ID,
					key: 'foo',
					value: TEST_ADV_DATA_0,
				})

				await set_kv_entry({
					user_id: TEST_USER1_ID,
					key: 'foo',
					value: TEST_ADV_DATA_1,
				})
				let actual = (await get({ user_id: TEST_USER1_ID, key: 'foo' }))!
				expect(actual.value, 'v1').to.deep.equal(TEST_ADV_DATA_1)
				expect(actual.bkp__recent, 'r1').to.deep.equal(TEST_ADV_DATA_0)
				expect(actual.bkp__old, 'o1').to.deep.equal(null)
				expect(actual.bkp__older, 'oo1').to.deep.equal(null)

				await set_kv_entry({
					user_id: TEST_USER1_ID,
					key: 'foo',
					value: TEST_ADV_DATA_2,
				})
				actual = (await get({ user_id: TEST_USER1_ID, key: 'foo' }))!
				expect(actual.value, 'v2').to.deep.equal(TEST_ADV_DATA_2)
				expect(actual.bkp__recent, 'r2').to.deep.equal(TEST_ADV_DATA_1)
				expect(actual.bkp__old, 'o2').to.deep.equal(null)
				expect(actual.bkp__older, 'oo2').to.deep.equal(null)

				await set_kv_entry({
					user_id: TEST_USER1_ID,
					key: 'foo',
					value: TEST_ADV_DATA_3,
				})
				actual = (await get({ user_id: TEST_USER1_ID, key: 'foo' }))!
				expect(actual.value, 'v3').to.deep.equal(TEST_ADV_DATA_3)
				expect(actual.bkp__recent, 'r3').to.deep.equal(TEST_ADV_DATA_2)
				expect(actual.bkp__old, 'o3').to.deep.equal(null)
				expect(actual.bkp__older, 'oo3').to.deep.equal(null)
			})

			it('should work in update condition -- only increasing schema version x3 = major bkp pipeline', async () => {
				let TEST_ADV_DATA_0 = {
					...ROOT_EXAMPLE,
					schema_version: 1,
				}
				let TEST_ADV_DATA_1 = {
					...ROOT_EXAMPLE,
					schema_version: 3,
					u_state: {
						...ROOT_EXAMPLE.u_state,
						revision: 123,
					}
				}
				let TEST_ADV_DATA_2 = {
					...ROOT_EXAMPLE,
					schema_version: 4,
					u_state: {
						...ROOT_EXAMPLE.u_state,
						revision: 124,
					}
				}
				let TEST_ADV_DATA_3 = {
					...ROOT_EXAMPLE,
					schema_version: 7,
					u_state: {
						...ROOT_EXAMPLE.u_state,
						revision: 125,
					}
				}

				await set_kv_entry({
					user_id: TEST_USER1_ID,
					key: 'foo',
					value: TEST_ADV_DATA_0,
				})

				await set_kv_entry({
					user_id: TEST_USER1_ID,
					key: 'foo',
					value: TEST_ADV_DATA_1,
				})
				let actual = (await get({ user_id: TEST_USER1_ID, key: 'foo' }))!
				expect(actual.value, 'v1').to.deep.equal(TEST_ADV_DATA_1)
				expect(actual.bkp__recent, 'r1').to.deep.equal(null)
				expect(actual.bkp__old, 'o1').to.deep.equal(TEST_ADV_DATA_0)
				expect(actual.bkp__older, 'oo1').to.deep.equal(null)

				await set_kv_entry({
					user_id: TEST_USER1_ID,
					key: 'foo',
					value: TEST_ADV_DATA_2,
				})
				actual = (await get({ user_id: TEST_USER1_ID, key: 'foo' }))!
				expect(actual.value, 'v2').to.deep.equal(TEST_ADV_DATA_2)
				expect(actual.bkp__recent, 'r2').to.deep.equal(null)
				expect(actual.bkp__old, 'o2').to.deep.equal(TEST_ADV_DATA_1)
				expect(actual.bkp__older, 'oo2').to.deep.equal(TEST_ADV_DATA_0)

				await set_kv_entry({
					user_id: TEST_USER1_ID,
					key: 'foo',
					value: TEST_ADV_DATA_3,
				})
				actual = (await get({ user_id: TEST_USER1_ID, key: 'foo' }))!
				expect(actual.value, 'v3').to.deep.equal(TEST_ADV_DATA_3)
				expect(actual.bkp__recent, 'r3').to.deep.equal(null)
				expect(actual.bkp__old, 'o3').to.deep.equal(TEST_ADV_DATA_2)
				expect(actual.bkp__older, 'oo3').to.deep.equal(TEST_ADV_DATA_1)
			})

			it('should work in update condition -- increasing everything = full bkp pipeline', async () => {
				let TEST_ADV_DATA_1a = {
					...ROOT_EXAMPLE,
					schema_version: 1,
					u_state: {
						...ROOT_EXAMPLE.u_state,
						revision: 1,
					},
				}
				let TEST_ADV_DATA_1b = {
					...ROOT_EXAMPLE,
					schema_version: 1,
					u_state: {
						...ROOT_EXAMPLE.u_state,
						revision: 2,
					}
				}
				let TEST_ADV_DATA_2a = {
					...ROOT_EXAMPLE,
					schema_version: 2,
					u_state: {
						...ROOT_EXAMPLE.u_state,
						revision: 10,
					}
				}
				let TEST_ADV_DATA_2b = {
					...ROOT_EXAMPLE,
					schema_version: 2,
					u_state: {
						...ROOT_EXAMPLE.u_state,
						revision: 11,
					}
				}
				let TEST_ADV_DATA_3a = {
					...ROOT_EXAMPLE,
					schema_version: 3,
					u_state: {
						...ROOT_EXAMPLE.u_state,
						revision: 30,
					}
				}
				let TEST_ADV_DATA_3b = {
					...ROOT_EXAMPLE,
					schema_version: 3,
					u_state: {
						...ROOT_EXAMPLE.u_state,
						revision: 31,
					}
				}

				const user_id = TEST_USER1_ID
				const key = 'foo'
				await set_kv_entry({ user_id, key, value: TEST_ADV_DATA_1a })
				await set_kv_entry({ user_id, key, value: TEST_ADV_DATA_1b })
				await set_kv_entry({ user_id, key, value: TEST_ADV_DATA_2a })
				await set_kv_entry({ user_id, key, value: TEST_ADV_DATA_2b })
				await set_kv_entry({ user_id, key, value: TEST_ADV_DATA_3a })
				await set_kv_entry({ user_id, key, value: TEST_ADV_DATA_3b })

				const actual = (await get({ user_id, key }))!
				expect(actual.value,       'v').to.deep.equal(TEST_ADV_DATA_3b)
				expect(actual.bkp__recent, 'r').to.deep.equal(TEST_ADV_DATA_3a)
				expect(actual.bkp__old,    'o').to.deep.equal(TEST_ADV_DATA_2b)
				expect(actual.bkp__older, 'oo').to.deep.equal(TEST_ADV_DATA_1b)
			})
		})
	})
})
