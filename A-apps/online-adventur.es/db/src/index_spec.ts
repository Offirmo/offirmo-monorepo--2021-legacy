/////////////////////

import { expect } from 'chai'
import { LIB } from './consts'
import get_db from './db'

import { create_user, get_by_email } from './users'
import { cleanup, get_test_base_user_01, get_test_netlify_user_01 } from './users/_test_helpers'

////////////////////////////////////

describe(`${LIB}`, function() {

	describe('transactions', function() {
		before(cleanup)
		afterEach(cleanup)

		it('should indeed rollback on failure', async () => {
			let user_id_1: any
			let user_id_2: any

			const base = get_test_base_user_01()

			return get_db().transaction(async trx => {
					return Promise.all([
						create_user(base, trx).then(id => user_id_1 = id),
						create_user(base, trx).then(id => user_id_2 = id),
					])
				})
				.then(
					res => {
						//console.log('transaction success', { res, user_id_1, user_id_2 })
						throw new Error('Unexpected success!')
					},
					async err => {
						//console.log('transaction failure', { err, user_id_1, user_id_2 })

						expect(user_id_1 && user_id_2).not.to.be.ok
						expect(err.message).to.contain('duplicate')

						const cancelled_user = await get_by_email(base.raw_email)
						expect(cancelled_user).to.be.null // bc the transaction reverted
					},
				)

		})
	})
})
