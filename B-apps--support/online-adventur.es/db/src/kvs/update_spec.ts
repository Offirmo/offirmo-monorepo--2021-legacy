/////////////////////

import { expect, assert } from 'chai'

import {
	DEMO_ROOT_STATE,
} from '@offirmo-private/state-utils/dist/src.es2019.cjs/_test_helpers'

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
	set_kv_entry_intelligently,
	sync_kv_entry,
} from './update'
import {
	get,
} from './read'

////////////////////////////////////

describe(`${LIB} - ${TABLE__KEY_VALUES} - update`, function() {
	let user_id = -1
	let TEST_USER1_ID = -1
	let TEST_USER2_ID = -1
	before(user_cleanup)
	beforeEach(async () => {
		user_id = TEST_USER1_ID = await create_user(get_test_base_user_01())
		TEST_USER2_ID = await create_user(get_test_base_user_02())
	})
	afterEach(user_cleanup)

	const key = 'unit-tests--kv--test-key'
	const TEST_BASE_DATA_1 = { bar: 42 }
	const TEST_BASE_DATA_2 = { bar: { baz: 42 }}
	const TEST_BASE_DATA_3a = { foo: { bar: { baz: 42 }}}
	const TEST_BASE_DATA_3b = { foo: { bar: { baz: 33 }}}

	const TEST_ADV_DATA_v10_103 = {
		...DEMO_ROOT_STATE,
	}
	const TEST_ADV_DATA_v10_123 = {
		...DEMO_ROOT_STATE,
		u_state: {
			...DEMO_ROOT_STATE.u_state,
			revision: 123,
		}
	}
	const TEST_ADV_DATA_v10_124 = {
		...DEMO_ROOT_STATE,
		u_state: {
			...DEMO_ROOT_STATE.u_state,
			revision: 124,
		}
	}
	const TEST_ADV_DATA_v10_125 = {
		...DEMO_ROOT_STATE,
		u_state: {
			...DEMO_ROOT_STATE.u_state,
			revision: 125,
		}
	}

	const TEST_ADV_DATA_v1_1 = {
		...DEMO_ROOT_STATE,
		schema_version: 1,
		u_state: {
			...DEMO_ROOT_STATE.u_state,
			revision: 1,
		},
	}
	let TEST_ADV_DATA_v1_2 = {
		...DEMO_ROOT_STATE,
		schema_version: 1,
		u_state: {
			...DEMO_ROOT_STATE.u_state,
			revision: 2,
		}
	}
	let TEST_ADV_DATA_v2_10 = {
		...DEMO_ROOT_STATE,
		schema_version: 2,
		u_state: {
			...DEMO_ROOT_STATE.u_state,
			revision: 10,
		}
	}
	let TEST_ADV_DATA_v2_11 = {
		...DEMO_ROOT_STATE,
		schema_version: 2,
		u_state: {
			...DEMO_ROOT_STATE.u_state,
			revision: 11,
		}
	}
	let TEST_ADV_DATA_v3_30 = {
		...DEMO_ROOT_STATE,
		schema_version: 3,
		u_state: {
			...DEMO_ROOT_STATE.u_state,
			revision: 30,
		}
	}
	let TEST_ADV_DATA_v3_31 = {
		...DEMO_ROOT_STATE,
		schema_version: 3,
		u_state: {
			...DEMO_ROOT_STATE.u_state,
			revision: 31,
		}
	}


	describe('upsert()', function () {

		it('should work in create condition -- just the value', async () => {
			await upsert_kv_entry({
				user_id,
				key,
				value: TEST_BASE_DATA_3b,
			})

			const actual = (await get({ user_id, key }))!
			expect(actual.value).to.deep.equal(TEST_BASE_DATA_3b)
			expect(actual.bkp__recent).to.deep.equal(null)
			expect(actual.bkp__old).to.deep.equal(null)
			expect(actual.bkp__older).to.deep.equal(null)
		})

		it('should work in create condition -- all the fields', async () => {
			await upsert_kv_entry({
				user_id,
				key,
				value: TEST_BASE_DATA_3b,
				bkp__recent: TEST_BASE_DATA_3a,
				bkp__old: TEST_BASE_DATA_2,
				bkp__older: TEST_BASE_DATA_1,
			})

			const actual = (await get({ user_id, key }))!
			expect(actual.value).to.deep.equal(TEST_BASE_DATA_3b)
			expect(actual['bkp__recent']).to.deep.equal(TEST_BASE_DATA_3a)
			expect(actual.bkp__old).to.deep.equal(TEST_BASE_DATA_2)
			expect(actual.bkp__older).to.deep.equal(TEST_BASE_DATA_1)
		})

		it('should work in update condition -- just the value', async () => {
			await upsert_kv_entry({
				user_id,
				key,
				value: TEST_BASE_DATA_1,
			})
			await upsert_kv_entry({
				user_id,
				key,
				value: TEST_BASE_DATA_2,
			})
			const actual = (await get({ user_id, key }))!
			expect(actual.value).to.deep.equal(TEST_BASE_DATA_2)
			expect(actual['bkp__recent']).to.deep.equal(null) // upsert is the base version, no auto bkp__recent / pre-version
			expect(actual.bkp__old).to.deep.equal(null)
			expect(actual.bkp__older).to.deep.equal(null)
		})

		it('should work in update condition -- all the fields', async () => {
			await upsert_kv_entry({
				user_id,
				key,
				value: TEST_BASE_DATA_3a,
				bkp__recent: TEST_BASE_DATA_3b,
				bkp__old: TEST_BASE_DATA_1,
				bkp__older: TEST_BASE_DATA_2,
			})
			await upsert_kv_entry({
				user_id,
				key,
				value: TEST_BASE_DATA_3b,
				bkp__recent: TEST_BASE_DATA_3a,
				bkp__old: TEST_BASE_DATA_2,
				bkp__older: TEST_BASE_DATA_1,
			})
			const actual = (await get({ user_id, key }))!
			expect(actual.value).to.deep.equal(TEST_BASE_DATA_3b)
			expect(actual['bkp__recent']).to.deep.equal(TEST_BASE_DATA_3a)
			expect(actual.bkp__old).to.deep.equal(TEST_BASE_DATA_2)
			expect(actual.bkp__older).to.deep.equal(TEST_BASE_DATA_1)
		})
	})

	describe('set_kv_entry_intelligently()', function () {

		context('on basic json', function() {

			it('should work in create condition', async () => {
				await set_kv_entry_intelligently({
					user_id,
					key,
					value: TEST_BASE_DATA_1,
				})

				const actual = (await get({ user_id, key }))!
				expect(actual.value).to.deep.equal(TEST_BASE_DATA_1)
				expect(actual['bkp__recent']).to.deep.equal(null)
				expect(actual.bkp__old).to.deep.equal(null)
				expect(actual.bkp__older).to.deep.equal(null)
			})

			it('should do nothing on identical data', async () => {
				await set_kv_entry_intelligently({
					user_id,
					key,
					value: TEST_BASE_DATA_1,
				})

				let actual = (await get({ user_id, key }))!
				expect(actual.value).to.deep.equal(TEST_BASE_DATA_1)
				expect(actual['bkp__recent']).to.deep.equal(null)
				expect(actual.bkp__old).to.deep.equal(null)
				expect(actual.bkp__older).to.deep.equal(null)

				await set_kv_entry_intelligently({
					user_id,
					key,
					value: TEST_BASE_DATA_1,
				})

				actual = (await get({ user_id, key }))!
				expect(actual.value).to.deep.equal(TEST_BASE_DATA_1)
				expect(actual['bkp__recent']).to.deep.equal(null)
				expect(actual.bkp__old).to.deep.equal(null)
				expect(actual.bkp__older).to.deep.equal(null)
			})

			it('should always work in update condition -- change x3 = minor bkp pipeline', async () => {
				let actual = (await get({ user_id, key }))!
				//console.log('0', actual)

				await set_kv_entry_intelligently({
					user_id,
					key,
					value: TEST_BASE_DATA_1,
				})
				actual = (await get({ user_id, key }))!
				//console.log('1', actual)

				await set_kv_entry_intelligently({
					user_id,
					key,
					value: TEST_BASE_DATA_2,
				})
				actual = (await get({ user_id, key }))!
				//console.log('2', actual)

				expect(actual.value).to.deep.equal(TEST_BASE_DATA_2)
				expect(actual['bkp__recent']).to.deep.equal(TEST_BASE_DATA_1)
				expect(actual.bkp__old).to.deep.equal(null)
				expect(actual.bkp__older).to.deep.equal(null)

				await set_kv_entry_intelligently({
					user_id,
					key,
					value: TEST_BASE_DATA_3a,
				})
				actual = (await get({ user_id, key }))!
				//console.log('3a', actual)

				expect(actual.value).to.deep.equal(TEST_BASE_DATA_3a)
				expect(actual['bkp__recent']).to.deep.equal(TEST_BASE_DATA_2)
				expect(actual.bkp__old).to.deep.equal(null)
				expect(actual.bkp__older).to.deep.equal(null)
			})
		})

		context('on advanced Offirmo’s states', function() {

			it('should work in create condition', async () => {
				await set_kv_entry_intelligently({
					user_id,
					key,
					value: DEMO_ROOT_STATE,
				})

				const actual = (await get({ user_id, key }))!
				expect(actual.value).to.deep.equal(DEMO_ROOT_STATE)
				expect(actual.bkp__recent).to.deep.equal(null)
				expect(actual.bkp__old).to.deep.equal(null)
				expect(actual.bkp__older).to.deep.equal(null)
			})

			it('should do nothing on identical data', async () => {
				await set_kv_entry_intelligently({
					user_id,
					key,
					value: DEMO_ROOT_STATE,
				})

				let actual = (await get({ user_id, key }))!
				expect(actual.value).to.deep.equal(DEMO_ROOT_STATE)
				expect(actual.bkp__recent).to.deep.equal(null)
				expect(actual.bkp__old).to.deep.equal(null)
				expect(actual.bkp__older).to.deep.equal(null)

				await set_kv_entry_intelligently({
					user_id,
					key,
					value: DEMO_ROOT_STATE,
				})

				actual = (await get({ user_id, key }))!
				expect(actual.value).to.deep.equal(DEMO_ROOT_STATE)
				expect(actual.bkp__recent).to.deep.equal(null)
				expect(actual.bkp__old).to.deep.equal(null)
				expect(actual.bkp__older).to.deep.equal(null)
			})

			it('should work in update condition -- same schema version x3 = minor bkp pipeline', async () => {
				await set_kv_entry_intelligently({
					user_id,
					key,
					value: TEST_ADV_DATA_v10_103,
				})

				await set_kv_entry_intelligently({
					user_id,
					key,
					value: TEST_ADV_DATA_v10_123,
				})
				let actual = (await get({ user_id, key }))!
				expect(actual.value, 'v1').to.deep.equal(TEST_ADV_DATA_v10_123)
				expect(actual.bkp__recent, 'r1').to.deep.equal(TEST_ADV_DATA_v10_103)
				expect(actual.bkp__old, 'o1').to.deep.equal(null)
				expect(actual.bkp__older, 'oo1').to.deep.equal(null)

				await set_kv_entry_intelligently({
					user_id,
					key,
					value: TEST_ADV_DATA_v10_124,
				})
				actual = (await get({ user_id, key }))!
				expect(actual.value, 'v2').to.deep.equal(TEST_ADV_DATA_v10_124)
				expect(actual.bkp__recent, 'r2').to.deep.equal(TEST_ADV_DATA_v10_123)
				expect(actual.bkp__old, 'o2').to.deep.equal(null)
				expect(actual.bkp__older, 'oo2').to.deep.equal(null)

				await set_kv_entry_intelligently({
					user_id,
					key,
					value: TEST_ADV_DATA_v10_125,
				})
				actual = (await get({ user_id, key }))!
				expect(actual.value, 'v3').to.deep.equal(TEST_ADV_DATA_v10_125)
				expect(actual.bkp__recent, 'r3').to.deep.equal(TEST_ADV_DATA_v10_124)
				expect(actual.bkp__old, 'o3').to.deep.equal(null)
				expect(actual.bkp__older, 'oo3').to.deep.equal(null)
			})

			it('should work in update condition -- only increasing schema version x3 = major bkp pipeline', async () => {
				let actual = (await get({ user_id, key }))!
				//console.log('0', actual)
				expect(actual).to.be.null

				let TEST_ADV_DATA_1 = {
					...DEMO_ROOT_STATE,
					u_state: {
						...DEMO_ROOT_STATE.u_state,
						schema_version: 1,
					},
					t_state: {
						...DEMO_ROOT_STATE.t_state,
						schema_version: 1,
					},
				}
				let TEST_ADV_DATA_2 = {
					...DEMO_ROOT_STATE,
					u_state: {
						...DEMO_ROOT_STATE.u_state,
						schema_version: 3,
						//revision: 123,
					},
					t_state: {
						...DEMO_ROOT_STATE.t_state,
						schema_version: 3,
					},
				}
				let TEST_ADV_DATA_3 = {
					...DEMO_ROOT_STATE,
					u_state: {
						...DEMO_ROOT_STATE.u_state,
						schema_version: 4,
						//revision: 124,
					},
					t_state: {
						...DEMO_ROOT_STATE.t_state,
						schema_version: 4,
					},
				}
				let TEST_ADV_DATA_4 = {
					...DEMO_ROOT_STATE,
					u_state: {
						...DEMO_ROOT_STATE.u_state,
						schema_version: 7,
						//revision: 125,
					},
					t_state: {
						...DEMO_ROOT_STATE.t_state,
						schema_version: 7,
					},
				}

				await set_kv_entry_intelligently({
					user_id,
					key,
					value: TEST_ADV_DATA_1,
				})
				actual = (await get({ user_id, key }))!
				//console.log('1', actual)

				await set_kv_entry_intelligently({
					user_id,
					key,
					value: TEST_ADV_DATA_2,
				})
				actual = (await get({ user_id, key }))!
				//console.log('2', actual)

				expect(actual.value, 'v2').to.deep.equal(TEST_ADV_DATA_2)
				expect(actual.bkp__recent, 'r2').to.deep.equal(null)
				expect(actual.bkp__old, 'o2').to.deep.equal(TEST_ADV_DATA_1)
				expect(actual.bkp__older, 'oo2').to.deep.equal(null)

				await set_kv_entry_intelligently({
					user_id,
					key,
					value: TEST_ADV_DATA_3,
				})
				actual = (await get({ user_id, key }))!
				expect(actual.value, 'v3').to.deep.equal(TEST_ADV_DATA_3)
				expect(actual.bkp__recent, 'r3').to.deep.equal(null)
				expect(actual.bkp__old, 'o3').to.deep.equal(TEST_ADV_DATA_2)
				expect(actual.bkp__older, 'oo3').to.deep.equal(TEST_ADV_DATA_1)

				await set_kv_entry_intelligently({
					user_id,
					key,
					value: TEST_ADV_DATA_4,
				})
				actual = (await get({ user_id, key }))!
				expect(actual.value, 'v4').to.deep.equal(TEST_ADV_DATA_4)
				expect(actual.bkp__recent, 'r4').to.deep.equal(null)
				expect(actual.bkp__old, 'o4').to.deep.equal(TEST_ADV_DATA_3)
				expect(actual.bkp__older, 'oo4').to.deep.equal(TEST_ADV_DATA_2)
			})

			it('should work in update condition -- real case, increasing everything = full bkp pipeline', async () => {
				const user_id = TEST_USER1_ID
				let actual = (await get({ user_id, key }))!
				//console.log('0', actual)

				await set_kv_entry_intelligently({ user_id, key, value: TEST_ADV_DATA_v1_1 })
				actual = (await get({ user_id, key }))!
				//console.log('1', actual)

				await set_kv_entry_intelligently({ user_id, key, value: TEST_ADV_DATA_v1_2 })
				actual = (await get({ user_id, key }))!
				//console.log('2', actual)

				await set_kv_entry_intelligently({ user_id, key, value: TEST_ADV_DATA_v2_10 })
				actual = (await get({ user_id, key }))!
				//console.log('3', actual)

				await set_kv_entry_intelligently({ user_id, key, value: TEST_ADV_DATA_v2_11 })
				actual = (await get({ user_id, key }))!
				//console.log('4', actual)

				await set_kv_entry_intelligently({ user_id, key, value: TEST_ADV_DATA_v3_30 })
				actual = (await get({ user_id, key }))!
				//console.log('5', actual)

				await set_kv_entry_intelligently({ user_id, key, value: TEST_ADV_DATA_v3_31 })
				actual = (await get({ user_id, key }))!
				//console.log('6', actual)

				actual = (await get({ user_id, key }))!
				//console.log(actual)
				expect(actual.value,       'v').to.deep.equal(TEST_ADV_DATA_v3_31)
				expect(actual.bkp__recent, 'r').to.deep.equal(TEST_ADV_DATA_v3_30)
				expect(actual.bkp__old,    'o').to.deep.equal(TEST_ADV_DATA_v2_11)
				expect(actual.bkp__older, 'oo').to.deep.equal(TEST_ADV_DATA_v1_2)
			})

			it('should throw on older data -- minor', async () => {
				await set_kv_entry_intelligently({
					user_id,
					key,
					value: TEST_ADV_DATA_v10_123,
				})

				await expect(set_kv_entry_intelligently({
					user_id,
					key,
					value: TEST_ADV_DATA_v10_103,
				})).to.be.rejectedWith('investment')

				// no change in db
				let actual = (await get({ user_id, key }))!
				expect(actual.value, 'v1').to.deep.equal(TEST_ADV_DATA_v10_123)
				expect(actual.bkp__recent, 'r1').to.deep.equal(null)
				expect(actual.bkp__old, 'o1').to.deep.equal(null)
				expect(actual.bkp__older, 'oo1').to.deep.equal(null)
			})

			it('should throw on older data -- major', async () => {
				await set_kv_entry_intelligently({
					user_id,
					key,
					value: TEST_ADV_DATA_v3_30,
				})

				await expect(set_kv_entry_intelligently({
					user_id,
					key,
					value: TEST_ADV_DATA_v2_11,
				})).to.be.rejectedWith('investment')

				// no change in db
				let actual = (await get({ user_id, key }))!
				expect(actual.value, 'v1').to.deep.equal(TEST_ADV_DATA_v3_30)
				expect(actual.bkp__recent, 'r1').to.deep.equal(null)
				expect(actual.bkp__old, 'o1').to.deep.equal(null)
				expect(actual.bkp__older, 'oo1').to.deep.equal(null)
			})
		})
	})

	describe('sync_kv_entry()', function() {

		context('on basic json', function() {

			it('should always work in create, update and identical situation', async () => {
				let latest = await sync_kv_entry<any>({
					user_id,
					key,
					value: TEST_BASE_DATA_1,
				})
				expect(latest).to.deep.equal(TEST_BASE_DATA_1)
				expect((await get({ user_id, key }))!.value).to.deep.equal(TEST_BASE_DATA_1)

				// "newer" (no real order since basic json)
				latest = await sync_kv_entry<any>({
					user_id,
					key,
					value: TEST_BASE_DATA_2,
				})
				expect(latest).to.deep.equal(TEST_BASE_DATA_2)
				expect((await get({ user_id, key }))!.value).to.deep.equal(TEST_BASE_DATA_2)

				// "older" (no real order since basic json)
				latest = await sync_kv_entry<any>({
					user_id,
					key,
					value: TEST_BASE_DATA_1,
				})
				expect(latest).to.deep.equal(TEST_BASE_DATA_1)
				expect((await get({ user_id, key }))!.value).to.deep.equal(TEST_BASE_DATA_1)

				// identical
				latest = await sync_kv_entry<any>({
					user_id,
					key,
					value: TEST_BASE_DATA_1,
				})
				expect(latest).to.deep.equal(TEST_BASE_DATA_1)
				expect((await get({ user_id, key }))!.value).to.deep.equal(TEST_BASE_DATA_1)
			})
		})

		context('on advanced Offirmo’s states', function() {

			it('should work and UPDATE in create, rev-same and rev-update situation', async () => {
				// create
				let latest = await sync_kv_entry({
					user_id,
					key,
					value: TEST_ADV_DATA_v1_1,
				})
				let actual = (await get({ user_id, key }))!
				expect(actual.value, 'v0').to.deep.equal(TEST_ADV_DATA_v1_1)
				expect(latest).to.deep.equal(actual.value)
				expect(actual.bkp__recent, 'r0').to.deep.equal(null)
				expect(actual.bkp__old, 'o0').to.deep.equal(null)
				expect(actual.bkp__older, 'oo0').to.deep.equal(null)

				// update minor
				latest = await sync_kv_entry({
					user_id,
					key,
					value: TEST_ADV_DATA_v1_2,
				})
				actual = (await get({ user_id, key }))!
				expect(actual.value, 'v1').to.deep.equal(TEST_ADV_DATA_v1_2)
				expect(latest).to.deep.equal(actual.value)
				expect(actual.bkp__recent, 'r1').to.deep.equal(TEST_ADV_DATA_v1_1)
				expect(actual.bkp__old, 'o1').to.deep.equal(null)
				expect(actual.bkp__older, 'oo1').to.deep.equal(null)

				// update major
				latest = await sync_kv_entry({
					user_id,
					key,
					value: TEST_ADV_DATA_v3_30,
				})
				actual = (await get({ user_id, key }))!
				expect(actual.value, 'v2').to.deep.equal(TEST_ADV_DATA_v3_30)
				expect(latest).to.deep.equal(actual.value)
				expect(actual.bkp__recent, 'r2').to.deep.equal(null)
				expect(actual.bkp__old, 'o2').to.deep.equal(TEST_ADV_DATA_v1_2)
				expect(actual.bkp__older, 'oo2').to.deep.equal(null)

				// identical
				latest = await sync_kv_entry({
					user_id,
					key,
					value: TEST_ADV_DATA_v3_30,
				})
				actual = (await get({ user_id, key }))!
				expect(actual.value, 'v3').to.deep.equal(TEST_ADV_DATA_v3_30)
				expect(latest).to.deep.equal(actual.value)
				expect(actual.bkp__recent, 'r3').to.deep.equal(null)
				expect(actual.bkp__old, 'o3').to.deep.equal(TEST_ADV_DATA_v1_2)
				expect(actual.bkp__older, 'oo3').to.deep.equal(null)
			})

			it('should work and SKIP in reverse situation', async () => {
				// create
				let latest = await sync_kv_entry({
					user_id,
					key,
					value: TEST_ADV_DATA_v3_31,
				})
				let actual = (await get({ user_id, key }))!
				expect(actual.value, 'v0').to.deep.equal(TEST_ADV_DATA_v3_31)
				expect(latest).to.deep.equal(actual.value)
				expect(actual.bkp__recent, 'r0').to.deep.equal(null)
				expect(actual.bkp__old, 'o0').to.deep.equal(null)
				expect(actual.bkp__older, 'oo0').to.deep.equal(null)

				// older: minor
				latest = await sync_kv_entry({
					user_id,
					key,
					value: TEST_ADV_DATA_v3_30,
				})
				actual = (await get({ user_id, key }))!
				// write skipped!
				expect(actual.value, 'v1').to.deep.equal(TEST_ADV_DATA_v3_31)
				expect(latest).to.deep.equal(actual.value)
				expect(actual.bkp__recent, 'r1').to.deep.equal(null)
				expect(actual.bkp__old, 'o1').to.deep.equal(null)
				expect(actual.bkp__older, 'oo1').to.deep.equal(null)

				// older: major
				latest = await sync_kv_entry({
					user_id,
					key,
					value: TEST_ADV_DATA_v1_2,
				})
				actual = (await get({ user_id, key }))!
				// write skipped!
				expect(actual.value, 'v1').to.deep.equal(TEST_ADV_DATA_v3_31)
				expect(latest).to.deep.equal(actual.value)
				expect(actual.bkp__recent, 'r1').to.deep.equal(null)
				expect(actual.bkp__old, 'o1').to.deep.equal(null)
				expect(actual.bkp__older, 'oo1').to.deep.equal(null)
			})
		})
	})
})
