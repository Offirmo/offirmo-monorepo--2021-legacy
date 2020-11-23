import { expect } from 'chai'

import { get_current_year, get_params, Params } from './params'

describe('Params', function() {

	describe('utilities', function () {

		describe('get_current_year()', function () {

			it('should work', () => {
				const current_year = get_current_year()
				//console.log({ current_year })
				expect(current_year).to.be.a('number')
				expect(current_year).to.be.within(1900, 2100) // wide
				expect(current_year).to.be.within(2020, 2025) // practical while I'm the only dev
			})
		})
	})
})
