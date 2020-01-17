import { expect } from 'chai'

import { LIB } from '../consts'
import { DATED_NAMES_SAMPLES } from './__test_shared/filenames'
import {
	parse,
	ParseResult,
} from './name_parser'

/////////////////////

describe(`${LIB} - name parser`, function() {

	describe('extraction of the extension', function () {
		it('should work', () => {
			const filenames = Object.keys(DATED_NAMES_SAMPLES)
			filenames.forEach(filename => {
				const { _comment, extension_lc } = DATED_NAMES_SAMPLES[filename]

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
		it.only('should work', () => {
			const filenames = Object.keys(DATED_NAMES_SAMPLES)
				.slice(5) // TEMP XXX
			filenames.forEach(filename => {
				const { _comment, ...rest } = DATED_NAMES_SAMPLES[filename]
				const expected: ParseResult = {
					original_name: filename,
					...rest,
				}

				expect(
					parse(filename, true).digits,
					`${[_comment, `"${filename}"`].join(': ')}`
				).to.equal(expected.digits)
			})
		})
	})
})
