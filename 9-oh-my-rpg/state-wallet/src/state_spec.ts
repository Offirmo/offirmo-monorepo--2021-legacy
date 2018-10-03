import { expect } from 'chai'

import { LIB, SCHEMA_VERSION } from './consts'

import {
	Currency,
	State,
	ALL_CURRENCIES,

	create,
	add_amount,
	remove_amount,

	get_currency_amount,
	iterables_currency,
} from '.'

describe('@oh-my-rpg/state-wallet - reducer', function() {
	const EXPECTED_CURRENCY_SLOT_COUNT = 2

	describe('🆕 initial state', function() {

		it('should have correct defaults to 0', function() {
			const state = create()

			expect(state).to.deep.equal({
				schema_version: SCHEMA_VERSION,
				revision: 0,

				coin_count: 0,
				token_count: 0,
			})

			expect(ALL_CURRENCIES).to.have.lengthOf(EXPECTED_CURRENCY_SLOT_COUNT)

			ALL_CURRENCIES.forEach((currency: Currency) =>
				expect(get_currency_amount(state, currency), currency).to.equal(0))
		})
	})

	describe('📥 currency addition', function() {

		it('should work on initial state', function() {
			let state = create()
			state = add_amount(state, Currency.coin, 3)
			expect(get_currency_amount(state, Currency.coin), Currency.coin).to.equal(3)
			expect(get_currency_amount(state, Currency.token), Currency.token).to.equal(0)
		})

		it('should work on simple non-empty state', function() {
			let state = create()
			state = add_amount(state, Currency.coin, 3)
			state = add_amount(state, Currency.coin, 6)
			expect(get_currency_amount(state, Currency.coin), Currency.coin).to.equal(9)
			expect(get_currency_amount(state, Currency.token), Currency.token).to.equal(0)
		})

		it('should cap to a limit')
	})

	describe('📤 currency withdraw', function() {

		it('should throw on empty currency slot', function() {
			let state = create()
			function remove() {
				state = remove_amount(state, Currency.coin, 3)
			}
			expect(remove).to.throw('state-wallet: can’t remove more than available, no credit !')
		})

		it('should throw on currency slot too low', function() {
			let state = create()
			state = add_amount(state, Currency.coin, 3)
			function remove() {
				state = remove_amount(state, Currency.coin, 6)
			}
			expect(remove).to.throw('state-wallet: can’t remove more than available, no credit !')
		})

		it('should work in nominal case', function() {
			let state = create()
			state = add_amount(state, Currency.coin, 3)
			state = remove_amount(state, Currency.coin, 2)

			expect(get_currency_amount(state, Currency.coin), Currency.coin).to.equal(1)
			expect(get_currency_amount(state, Currency.token), Currency.token).to.equal(0)
		})
	})

	describe('misc currency iteration', function() {

		it('should yield all currency slots')
	})
})
