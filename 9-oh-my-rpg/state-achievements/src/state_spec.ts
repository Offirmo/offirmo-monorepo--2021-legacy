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

describe('state - reducer', function() {
	const EXPECTED_CURRENCY_SLOT_COUNT = 2

	describe('🆕 initial state', function() {

		it('should have correct defaults', function() {
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
})
