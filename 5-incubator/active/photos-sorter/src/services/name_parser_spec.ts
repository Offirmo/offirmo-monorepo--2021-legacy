import { expect } from 'chai'

import { LIB } from '../consts'
import {
	get_current_year,
} from '../params'
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
	get_copy_index,
	get_digit_pattern,
	is_normalized_media_basename,
	is_normalized_event_folder,
} from './name_parser'
import {
	get_human_readable_timestamp_auto,
	get_embedded_timezone,
	BetterDate,
	create_better_date,
	_clean_debug,
} from './better-date'
import { Immutable } from '@offirmo-private/ts-types'

/////////////////////

function ꓺ(...t: Array<string | undefined>): string {
	return t.filter(s => !!s).join(': ')
}

describe(`${LIB} - (base)name parser`, function() {
	function _clean_parse_result<T extends { date: undefined | BetterDate }>(result: Immutable<T>): Immutable<T> {
		if (result.date) {
			result = {
				...result,
				date: _clean_debug(result.date)
			}
		}

		return result
	}

	describe('_get_y2k_year_from_fragment()', function () {
		it('should work', () => {
			expect(_get_y2k_year_from_fragment('70')).to.equal(1970)
			expect(_get_y2k_year_from_fragment('99')).to.equal(1999)
			expect(_get_y2k_year_from_fragment('00')).to.equal(2000)
			expect(_get_y2k_year_from_fragment('01')).to.equal(2001)
			expect(_get_y2k_year_from_fragment('19')).to.equal(2019)

			const YYYY_UPPER_BOUND = get_current_year() + 1
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
				//.filter(name => name === 'IMG_20160327_102742 2.jpg') // TEMP XXDCU
				//.slice(0, 2) // TEMP XXDCU

			filenames.forEach(filename => {
				const expected = DATED_NAMES_SAMPLES[filename]
				const { _comment, human_ts_current_tz_for_tests, digit_blocks, date, is_date_ambiguous: is_ambiguous } = expected

				it(ꓺ('should correctly parse', `"${filename}"`, _comment), () => {
					const expected_result = {
						summary: 'perfect',
						reason: null,
						date,
						is_ambiguous,
					}
					const result = _clean_parse_result(_parse_digit_blocks(digit_blocks!, 'other'))
					//console.log(result)
					//console.log(expected_result)

					if (result.summary === 'perfect') {
						// ok
					}
					else {
						expected_result.summary = 'ok'
						if (result.summary !== expected_result.summary) {
							console.error('unexpected summary:', { filename, expected_result, result })
						}
						expect(result.summary, 'summary').to.equal(expected_result.summary)
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
			//.slice(1) // TEMP XXDCU

			filenames.forEach(filename => {
				const expected = UNDATED_NAMES_SAMPLES[filename]
				const {_comment, digit_blocks } = expected

				it(ꓺ('should correctly fail to parse', _comment, `"${filename}"`), () => {
					const expected_result: DigitsParseResult = {
						summary: 'no_match',
						reason: null,
						date: undefined,
						is_ambiguous: false,
					}
					const result = _clean_parse_result(_parse_digit_blocks(digit_blocks!, 'other'))
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
			const filenames = Object.keys(ALL_SAMPLES)
				//.filter(name => name === 'IMG_20160327_102742 2.jpg') // TEMP XXDCU

			filenames.forEach(filename => {

				it(`should work for "${filename}"`, () => {
					const { _comment, extension_lc } = ALL_SAMPLES[filename]

					expect(
						parse(filename, { type: 'file' }).extension_lc,
						`${[_comment, `"${filename}"`].join(': ')}`
					).to.equal(extension_lc)
				})
			})

			it('should work on dotfiles', () => {
				expect(parse('.test', { type: 'file' }).extension_lc)
					.to.equal('.test')
			})

			it('should work on extension-less files', () => {
				expect(parse('extensionless', { type: 'file' }).extension_lc)
					.to.equal('')
			})

			it('should work on dot ending', () => {
				expect(parse('dotending.', { type: 'file' }).extension_lc)
					.to.equal('.')
			})
		})

		describe('extraction of the date', function () {

			context('when possible', function () {
				const filenames = Object.keys(DATED_NAMES_SAMPLES)
					//.filter(k => k === 'Capture d’écran 2019-07-31 à 21.00.15.png') // TEMP XXDCU
					//.slice(1) // TEMP XXDCU

				filenames.forEach(filename => {
					const expected = DATED_NAMES_SAMPLES[filename]
					const { _comment } = expected

					it(ꓺ('should correctly parse and find the date', _comment, `"${filename}"`), () => {
						const result = _clean_parse_result(parse(filename, { type: 'file' }))
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
				//.slice(1) // TEMP XXDCU

				filenames.forEach(filename => {
					const expected = UNDATED_NAMES_SAMPLES[filename]
					const {_comment, human_ts_current_tz_for_tests, digit_blocks,...expected_result_part} = expected

					it(ꓺ('should correctly parse and not find anything', _comment, `"${filename}"`), () => {
						const expected_result: ParseResult = {
							original_name: filename,
							...expected_result_part,
						}

						const result = parse(filename, { type: 'file' })
						expect(
							result,
							`result for ${[_comment, `"${filename}"`].join(': ')}`
						).to.deep.equal(expected_result)
					})
				})
			})
		})

		describe('extraction of the TZ', function () {

			context('when possible', function () {
				const filenames = Object.keys(DATED_NAMES_SAMPLES)
				//.filter(k => k === 'Capture d’écran 2019-07-31 à 21.00.15.png') // TEMP XXDCU
				//.slice(1) // TEMP XXDCU

				filenames.forEach(filename => {
					const expected = DATED_NAMES_SAMPLES[filename]
					const { _comment, expected_tz } = expected
					if (!expected_tz)
						return

					it(ꓺ('should correctly extract or infer the TZ', _comment, `"${filename}"`), () => {
						const result = _clean_parse_result(parse(filename, { type: 'file' }))
						//console.log(result.date)
						expect(get_embedded_timezone(result.date!)).to.equal(expected_tz)
					})
				})
			})
		})

		describe('removal of non meaningful parts', function () {
			const filenames = Object.keys(NON_MEANINGFUL_NAMES_SAMPLES)
			//.slice(1) // TEMP XXDCU

			filenames.forEach(filename => {
				const expected = NON_MEANINGFUL_NAMES_SAMPLES[filename]
				const { _comment } = expected

				it(ꓺ('should correctly remove non meaningful parts', _comment, `"${filename}"`), () => {
					const result = _clean_parse_result(parse(filename, { type: 'file' }))
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
					//.filter(k => k === 'MM2019-07-31_21h00m15_screenshot.png') // TEMP XXDCU
					//.slice(1) // TEMP XXDCU

				filenames.forEach(filename => {
					const expected = DATED_NAMES_SAMPLES[filename]
					const { _comment, digit_blocks, human_ts_current_tz_for_tests, date, expected_tz, ...expected_result_part } = expected

					it(ꓺ(`should return a correct result`, _comment, `"${filename}"`), () => {
						const expected_result: ParseResult = {
							original_name: filename,
							date,
							...expected_result_part,
						}

						const result = _clean_parse_result(parse(filename, { type: 'file' }))
						expect(
							result,
							`full result for ${[_comment, `"${filename}"`].join(': ')}`
						).to.deep.equal(expected_result)
					})
				})

				it('should work -- manual bug case 01', () => {
					const BASENAME_UT = '20011125 - 00- voyage à Paris - 2001'
					const result = _clean_parse_result(parse(BASENAME_UT, { type: 'folder' }))
					expect(
						result,
					).to.deep.equal({
						original_name: BASENAME_UT,
						copy_index: undefined,
						date: _clean_debug(create_better_date('tz:auto', 2001, 11, 25)),
						date_digits: "20011125",
						digits_pattern: "xxxxxxxx",
						extension_lc: "",
						is_date_ambiguous: false,
						meaningful_part: '00- voyage à Paris - 2001',
					})
				})

				it('should work -- manual bug case 02', () => {
					const BASENAME_UT = 'WhatsApp Image 2019-06-23 at 01.30.52(1).jpeg'
					const result = _clean_parse_result(parse(BASENAME_UT, { type: 'file' }))
					expect(
						result,
					).to.deep.equal({
						original_name: BASENAME_UT,
						copy_index: 1,
						date: _clean_debug(create_better_date('tz:auto', 2019, 6, 23, 1, 30, 52)),
						date_digits: "20190623013052",
						digits_pattern: "xxxx-xx-xx at xx.xx.xx",
						extension_lc: ".jpeg",
						is_date_ambiguous: false,
						meaningful_part: 'WhatsApp Image',
					})
				})
			})

			context('when not possible', function () {
				const filenames = Object.keys(UNDATED_NAMES_SAMPLES)
				//.slice(1) // TEMP XXDCU

				filenames.forEach(filename => {
					const expected = UNDATED_NAMES_SAMPLES[filename]
					const {_comment, human_ts_current_tz_for_tests, digit_blocks, expected_tz, ...expected_result_part} = expected

					it(ꓺ(`should return a correct result`, _comment, `"${filename}"`), () => {
						const expected_result: ParseResult = {
							original_name: filename,
							...expected_result_part,
						}

						const result = _clean_parse_result(parse(filename, { type: 'file' }))
						expect(
							result,
							`full result for ${[_comment, `"${filename}"`].join(': ')}`
						).to.deep.equal(expected_result)
					})
				})
			})
		})
	})

	describe('get_copy_index()', function () {
		const filenames = Object.keys(ALL_SAMPLES)
		//.filter(name => name === 'IMG_20160327_102742 2.jpg') // TEMP XXDCU
		//.slice(0, 2) // TEMP XXDCU

		filenames.forEach(filename => {
			const expected = ALL_SAMPLES[filename]
			const { _comment, copy_index } = expected

			it(ꓺ(`should correctly extract the copy index #${copy_index} from`, `"${filename}"`, _comment), () => {
				const copy_index = get_copy_index(filename)

				expect( copy_index ).to.equal(expected.copy_index)
			})
		})
	})

	describe('get_digit_pattern()', function() {

		it('should work', () => {
			expect(get_digit_pattern('MM2019-07-31_21h00m15_screenshot.mp3'))
				.to.equal('MMxxxx-xx-xx_xxhxxmxx_screenshot.mpx')
		})
	})

	describe('is_normalized_media_basename()', function() {
		const T: { [k: string]: boolean } = {
			'MM2019-07-31_21h00m15_screenshot.mp3': true,
			'IMG-20151110-WA0000.jpg': false,
			'MM2019-07-31_21h00m15_screenshot': false,
			'MM2019-07-31_21h00m15_screenshot.': false,
			'MMs.mp3': false,
			'MM2000.mp3': false,
		}

		Object.keys(T).forEach(basename => {
			it(`should work for "${basename}"`, () => {
				expect(is_normalized_media_basename(basename))
					.to.equal(T[basename])
			})
		})
	})

	describe('is_normalized_event_folder()', function() {
		const T: { [k: string]: boolean } = {
			'2007/20070101 - foo': true,
			'2007/20070101 - 00- voyage à Paris': true,
			'2007/01012007 - foo': false,
			'foo': false,
			'2007': false,
			'2002/46- après-midi Victor/vaisselle': false,
			'2002/47- st. Nicolas 2002': false,
		}

		Object.keys(T).forEach(relpath => {
			it(`should work for "${relpath}"`, () => {
				expect(is_normalized_event_folder(relpath))
					.to.equal(T[relpath])
			})
		})
	})
})
