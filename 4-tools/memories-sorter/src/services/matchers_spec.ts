import { expect } from 'chai'

import { LIB } from '../consts'
import { CURRENT_YEAR } from '../params'
import {
	is_day_fragment,
	is_month_fragment,
	is_year,
	is_YYYYMMDD,
	is_DDMMYYYY,
} from './matchers'

/////////////////////

type TCBool = { [k: string]: boolean }

describe(`${LIB} - matchers`, function() {

	describe('is_year()', function () {

		it('should fail on invalid strings', () => {
			[
				'',
				'0',
				'0000',
				'-0',
				2000,
				-1,
				NaN,
				'abcd',
				'02000',
			].forEach(bad_case =>
				expect(is_year(bad_case as any), String(bad_case)).to.be.false
			)
		})

		it('should have a lower limit', () => {
			expect(is_year('1000')).to.be.false
			expect(is_year('1825')).to.be.false
			expect(is_year('1826')).to.be.true
		})

		it('should have an upper limit', () => {
			expect(is_year(String(CURRENT_YEAR + 1))).to.be.true
			expect(is_year(String(CURRENT_YEAR + 2))).to.be.false
			expect(is_year('2100')).to.be.false
		})

		it('should work on reasonable years', () => {
			expect(is_year('1890')).to.be.true
			expect(is_year('1999')).to.be.true
			expect(is_year('2020')).to.be.true
			expect(is_year(String(CURRENT_YEAR))).to.be.true
			expect(is_year(String(CURRENT_YEAR + 1))).to.be.true
		})
	})

	describe('is_month_fragment()', function () {

		it('should work', () => {
			const TEST_CASES: TCBool = {
				'': false,
				'0': false,
				'00': false,
				'1': false,
				'001': false,
				'01': true,
				'02': true,
				'03': true,
				'04': true,
				'05': true,
				'06': true,
				'07': true,
				'08': true,
				'09': true,
				'10': true,
				'11': true,
				'12': true,
				'13': false,
				'99': false,
			}
			Object.keys(TEST_CASES).forEach(tc => {
				//console.log( { tc, x: TEST_CASES[tc], m: tc.match(YEAR_RE) } )
				expect(is_month_fragment(tc), tc).to.equal(TEST_CASES[tc])
			})
		})
	})

	describe('is_day_fragment()', function () {

		it('should work', () => {
			const TEST_CASES: TCBool = {
				'': false,
				'0': false,
				'00': false,
				'1': false,
				'001': false,
				'03': true,
				'09': true,
				'10': true,
				'010': false,
				'11': true,
				'19': true,
				'20': true,
				'21': true,
				'29': true,
				'30': true,
				'31': true,
				'32': false,
				'99': false,
			}
			Object.keys(TEST_CASES).forEach(tc => {
				//console.log( { tc, x: TEST_CASES[tc], m: tc.match(YEAR_RE) } )
				expect(is_day_fragment(tc), tc).to.equal(TEST_CASES[tc])
			})
		})
	})

	describe('is_YYYYMMDD()', function () {

		it('should work', () => {
			const TEST_CASES: TCBool = {
				'': false,
				'0': false,
				'1': false,
				'17001231': false,
				'19901231': true,
				'19900101': true,
				'19900001': false,
				'19900532': false,
				'1990530': false,
				'20200116': true,
				'29082013': false, // DDMMYYYY
				'08292013': false, // MMDDYYYY
			}
			Object.keys(TEST_CASES).forEach(tc => {
				//console.log( { tc, x: TEST_CASES[tc], m: tc.match(YEAR_RE) } )
				expect(is_YYYYMMDD(tc), tc).to.equal(TEST_CASES[tc])
			})
		})
	})

	describe('is_DDMMYYYY()', function () {

		it('should work', () => {
			const TEST_CASES: TCBool = {
				'': false,
				'0': false,
				'1': false,
				'17001231': false,
				'31121990': true,
				'01011990': true,
				'01001990': false,
				'32051990': false,
				'3051990': false,
				'16012020': true,
				'08292013': false, // MMDDYYYY
				'19900101': false, // YYYYMMDD
			}
			Object.keys(TEST_CASES).forEach(tc => {
				//console.log( { tc, x: TEST_CASES[tc], m: tc.match(YEAR_RE) } )
				expect(is_DDMMYYYY(tc), tc).to.equal(TEST_CASES[tc])
			})
		})
	})
})
