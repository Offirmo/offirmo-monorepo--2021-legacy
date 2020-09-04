import chalk from 'chalk'
import { inject_lib__chalk } from './injectable-lib--chalk'
inject_lib__chalk(chalk)
import { expect } from 'chai'


import {
	cmp,
} from './utils'


describe('@offirmo-private/prettify-any - utils', function() {

	describe('cmp()', function() {

		it('should work with numbers', () => {
			expect(cmp(0, 0), 'equal').to.equal(0)
			expect(cmp(0, 2.4), 'ordered 1').to.equal(-1)
			expect(cmp(-2, 0), 'ordered 2').to.equal(-1)
			expect(cmp(2, 0), 'reverse').to.equal(1)
		})

		it('should work with strings', () => {
			expect(cmp('a', 'a'), 'equal').to.equal(0)
			expect(cmp('a', 'b'), 'ordered').to.equal(-1)
			expect(cmp('z', 'a'), 'reverse').to.equal(1)
		})

		it('should work with symbols', () => {
			const a = Symbol('a') as any
			const b = Symbol('b') as any
			expect(cmp(a, a), 'equal').to.equal(0)
			expect(cmp(a, b), 'ordered').to.equal(-1)
			expect(cmp(b, a), 'reverse').to.equal(1)
		})

		it('should work with any possible object keys', () => {
			const str = '0' as any
			const sym = Symbol('0') as any
			const num = 0 as any

			expect(cmp(num, str), '1').to.equal(-1)
			expect(cmp(str, sym), '2').to.equal(-1)
			expect(cmp(num, sym), '3').to.equal(-1)
		})
	})
})
