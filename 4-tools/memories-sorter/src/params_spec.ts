import assert from 'tiny-invariant'
import { expect } from 'chai'

import { CURRENT_YEAR, get_params, Params } from './params'

describe('Params', function() {

	describe('get_params()', function() {
		assert(!get_params().expect_perfect_state, 'code should not be in debug mode')

		it('should work')
	})


	describe('utilities', function () {

		describe('get_current_year()', function () {

			it('should work', () => {
				//console.log({ CURRENT_YEAR })
				expect(CURRENT_YEAR).to.be.a('number')
				expect(CURRENT_YEAR).to.be.within(1900, 2100) // wide
				expect(CURRENT_YEAR).to.be.within(2020, 2025) // practical while I'm the only dev
			})
		})
	})
})
