import { expect } from 'chai'

import { LIB } from '../consts'
import {
	DATED_NAMES_SAMPLES,
	UNDATED_NAMES_SAMPLES,
	NON_MEANINGFUL_NAMES_SAMPLES,
	ALL_SAMPLES,
} from '../__test_shared/filenames'
import {
	_get_y2k_year_from_fragment,
	_parse_digit_blocks,
	DigitsParseResult,
	parse,
	ParseResult,
} from './name_parser'
import {
	get_current_year,
	get_human_readable_timestamp_auto,
} from './better-date'

/////////////////////

describe(`${LIB} - (base)name parser`, function() {

	describe('_get_y2k_year_from_fragment()', function () {
		it('should work', () => {
			expect(_get_y2k_year_from_fragment('70')).to.equal(1970)
			expect(_get_y2k_year_from_fragment('99')).to.equal(1999)
			expect(_get_y2k_year_from_fragment('00')).to.equal(2000)
			expect(_get_y2k_year_from_fragment('01')).to.equal(2001)
			expect(_get_y2k_year_from_fragment('19')).to.equal(2019)

			const YYYY_UPPER_BOUND = get_current_year() + 1
			const YY_UPPER_BOUND = YYYY_UPPER_BOUND - 2000
			if (YYYY_UPPER_BOUND >= 2069) {
				expect(_get_y2k_year_from_fragment('69')).to.equal(2069)
			}
			else {
				expect(_get_y2k_year_from_fragment('69')).to.equal(null) // outside of param range
			}
			expect(_get_y2k_year_from_fragment('1')).to.equal(null)
		})
	})

	describe('_parse_digit_blocks()', function () {

		context('when possible', function () {
			const filenames = Object.keys(DATED_NAMES_SAMPLES)
				//.slice(0, 2) // TEMP XXX
			filenames.forEach(filename => {
				const expected = DATED_NAMES_SAMPLES[filename]
				const { _comment, human_ts_current_tz_for_tests, digit_blocks, date, is_date_ambiguous: is_ambiguous } = expected

				it(['should correctly parse', `"${filename}"`, _comment].filter(s => !!s).join(': '), () => {
					const expected_result = {
						summary: 'perfect',
						reason: null,
						date,
						is_ambiguous,
					}
					const result = _parse_digit_blocks(digit_blocks!, 'other')
					//console.log({ result })

					if (result.summary === 'perfect') {
						// ok
					}
					else {
						expected_result.summary = 'ok'
						expect(result.summary).to.equal('ok')
					}

					expect(
						get_human_readable_timestamp_auto(result.date!, 'tz:embedded'),
						`human ts`
					).to.equal(human_ts_current_tz_for_tests)
					//console.log(result.date!.toISOString())
					//console.log(date!.toISOString())
					expect(
						result,
						`full result`
					).to.deep.equal(expected_result)
				})
			})
		})

		context('when not possible', function () {
			const filenames = Object.keys(UNDATED_NAMES_SAMPLES)
			//.slice(1) // TEMP XXX

			filenames.forEach(filename => {
				const expected = UNDATED_NAMES_SAMPLES[filename]
				const {_comment, human_ts_current_tz_for_tests, digit_blocks, ...expected_result_part} = expected

				it(`should correctly fail to parse: ${[_comment, `"${filename}"`].join(': ')}`, () => {
					const expected_result: DigitsParseResult = {
						summary: 'no_match',
						reason: null,
						date: undefined,
						is_ambiguous: false,
					}
					const result = _parse_digit_blocks(digit_blocks!, 'other')
					//console.log({ result })
					expect(result.reason).not.to.be.null
					expected_result.reason = result.reason
					if (result.summary !== 'no_match') {
						expected_result.summary = 'need_more'
					}

					expect(
						result,
						`full result for ${[_comment, `"${filename}"`].join(': ')}`
					).to.deep.equal(expected_result)
				})
			})
		})
	})

	describe('parse()', function () {
		describe('extraction of the extension', function () {
			it('should work', () => {
				const filenames = Object.keys(ALL_SAMPLES)
				filenames.forEach(filename => {
					const { _comment, extension_lc } = ALL_SAMPLES[filename]

					expect(
						parse(filename).extension_lc,
						`${[_comment, `"${filename}"`].join(': ')}`
					).to.equal(extension_lc)
				})
			})

			it('should work on dotfiles', () => {
				expect(parse('.test').extension_lc)
					.to.equal('.test')
			})

			it('should work on extension-less files', () => {
				expect(parse('extensionless').extension_lc)
					.to.equal('')
			})

			it('should work on dot ending', () => {
				expect(parse('dotending.').extension_lc)
					.to.equal('.')
			})
		})

		describe('extraction of the date', function () {

			context('when possible', function () {
				const filenames = Object.keys(DATED_NAMES_SAMPLES)
				//.slice(1) // TEMP XXX

				filenames.forEach(filename => {
					const expected = DATED_NAMES_SAMPLES[filename]
					const {_comment, human_ts_current_tz_for_tests, ...expected_result_part} = expected

					it(`should correctly parse and find the date: ${[_comment, `"${filename}"`].join(': ')}`, () => {
						const expected_result: ParseResult = {
							original_name: filename,
							...expected_result_part,
						}

						const result = parse(filename, true)
						expect(
							result.date_digits,
							`digits for ${[_comment, `"${filename}"`].join(': ')}`
						).to.equal(expected.date_digits)
						expect(
							get_human_readable_timestamp_auto(result.date!, 'tz:embedded'),
							`human ts for ${[_comment, `"${filename}"`].join(': ')}`
						).to.equal(expected.human_ts_current_tz_for_tests)
					})
				})
			})

			context('when not possible', function () {

				const filenames = Object.keys(UNDATED_NAMES_SAMPLES)
				//.slice(1) // TEMP XXX

				filenames.forEach(filename => {
					const expected = UNDATED_NAMES_SAMPLES[filename]
					const {_comment, human_ts_current_tz_for_tests, digit_blocks,...expected_result_part} = expected

					it(`should correctly parse and not find anything: ${[_comment, `"${filename}"`].join(': ')}`, () => {
						const expected_result: ParseResult = {
							original_name: filename,
							...expected_result_part,
						}

						const result = parse(filename, true)
						expect(
							result,
							`result for ${[_comment, `"${filename}"`].join(': ')}`
						).to.deep.equal(expected_result)
					})
				})
			})
		})

		describe('removal of non meaningful parts', function () {
			const filenames = Object.keys(NON_MEANINGFUL_NAMES_SAMPLES)
			//.slice(1) // TEMP XXX

			filenames.forEach(filename => {
				const expected = NON_MEANINGFUL_NAMES_SAMPLES[filename]
				const {_comment, human_ts_current_tz_for_tests, ...expected_result_part} = expected

				it(`should correctly remove non meaningful parts: ${[_comment, `"${filename}"`].join(': ')}`, () => {
					const result = parse(filename, true)
					expect(
						result.meaningful_part,
						`meaningful part for ${[_comment, `"${filename}"`].join(': ')}`
					).to.equal('foo')
					expect(result.date).to.be.undefined
				})
			})
		})

		describe('all together', function () {

			context('when possible', function () {
				const filenames = Object.keys(DATED_NAMES_SAMPLES)
				//.slice(1) // TEMP XXX

				filenames.forEach(filename => {
					const expected = DATED_NAMES_SAMPLES[filename]
					const {_comment, human_ts_current_tz_for_tests, digit_blocks, ...expected_result_part} = expected

					it(`should return a correct result: ${[_comment, `"${filename}"`].join(': ')}`, () => {
						const expected_result: ParseResult = {
							original_name: filename,
							...expected_result_part,
						}

						const result = parse(filename, true)
						expect(
							result,
							`full result for ${[_comment, `"${filename}"`].join(': ')}`
						).to.deep.equal(expected_result)
					})
				})
			})

			context('when not possible', function () {

				const filenames = Object.keys(UNDATED_NAMES_SAMPLES)
				//.slice(1) // TEMP XXX

				filenames.forEach(filename => {
					const expected = UNDATED_NAMES_SAMPLES[filename]
					const {_comment, human_ts_current_tz_for_tests, digit_blocks, ...expected_result_part} = expected

					it(`should return a correct result: ${[_comment, `"${filename}"`].join(': ')}`, () => {
						const expected_result: ParseResult = {
							original_name: filename,
							...expected_result_part,
						}

						const result = parse(filename, true)
						expect(
							result,
							`full result for ${[_comment, `"${filename}"`].join(': ')}`
						).to.deep.equal(expected_result)
					})
				})
			})
		})

	})

})
