import { expect } from 'chai'
/*
import { LIB } from '../consts'
import {
	YEAR_RE,
	MONTH_RE,
	DAY_RE,
	COMPACT_DATE_RE_STR,
	extract_compact_date,
	starts_with_human_timestamp_ms,
} from './matchers'
import {SimpleYYYYMMDD} from '../types'

/////////////////////

type TCBool = { [k: string]: boolean }

describe(`${LIB} - matchers`, function() {

	describe('year regexp', function () {
		it('should work', () => {
			const TEST_CASES: TCBool = {
				'0': false,
				'123': false,
				'01900': false,
				'1900': true,
				'1990': true,
				'2000': true,
				'2099': true,
				'2100': false,
				'9999': false,
				'19500': false,
			}
			Object.keys(TEST_CASES).forEach(tc => {
				//console.log( { tc, x: TEST_CASES[tc], m: tc.match(YEAR_RE) } )
				if (TEST_CASES[tc])
					expect(tc.match(YEAR_RE), tc).to.be.an('array')
				else
					expect(tc.match(YEAR_RE), tc).to.equal(null)
			})
		})
	})

	describe('month regexp', function () {
		it('should work', () => {
			const TEST_CASES: TCBool = {
				'0': false,
				//'00': false, don't care this corner case
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
				if (TEST_CASES[tc])
					expect(tc.match(MONTH_RE), tc).to.be.an('array')
				else
					expect(tc.match(MONTH_RE), tc).to.equal(null)
			})
		})
	})

	describe('day regexp', function () {
		it('should work', () => {
			const TEST_CASES: TCBool = {
				'0': false,
				//'00': false, don't care this corner case
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
				if (TEST_CASES[tc])
					expect(tc.match(DAY_RE), tc).to.be.an('array')
				else
					expect(tc.match(DAY_RE), tc).to.equal(null)
			})
		})
	})

	describe('compact date regexp', function () {
		it('should work', () => {
			const TEST_CASES: TCBool = {
				'IMG_20130525.JPG': true,
				'20180603_taronga_vivd.gif': true,
				'TR81801414546EGJ.jpg': false,
			}
			Object.keys(TEST_CASES).forEach(tc => {
				//console.log( { tc, x: TEST_CASES[tc], m: tc.match(COMPACT_DATE_RE_STR) } )
				if (TEST_CASES[tc])
					expect(tc.match(COMPACT_DATE_RE_STR), tc).to.be.an('array')
				else
					expect(tc.match(COMPACT_DATE_RE_STR), tc).to.equal(null)
			})
		})
	})

	describe('extract_compact_date()', function () {
		it('should work', () => {
			const TEST_CASES: { [k: string]: ReturnType<typeof extract_compact_date>  } = {
				'IMG_20130525.JPG': 20130525,
				'20180603_taronga_vivd.gif': 20180603,
				'TR81801414546EGJ.jpg': null,
			}
			Object.keys(TEST_CASES).forEach(tc => {
				expect(extract_compact_date(tc), tc).to.equal(TEST_CASES[tc])
			})
		})
	})

	describe('starts_with_human_timestamp_ms()', function () {
		it('should work', () => {
			const TEST_CASES: TCBool = {
				'IMG_3211.JPG': false,
				'TR81801414546EGJ.jpg': false,
				'20180603_taronga_vivd.gif': false,
				'20181121_06h00+45.632.jpg': true,
			}
			Object.keys(TEST_CASES).forEach(tc => {
				//console.log( { tc, x: TEST_CASES[tc], m: tc.match(YEAR_RE) } )
				expect(starts_with_human_timestamp_ms(tc), tc).to.equal(TEST_CASES[tc])
			})
		})
	})
})
*/
