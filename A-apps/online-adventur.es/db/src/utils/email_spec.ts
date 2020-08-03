/////////////////////

import { expect } from 'chai'
import { NORMALIZERS } from '@offirmo-private/normalize-string'

import { LIB } from '../consts'
import { get_gravatar_url, normalize_email_safe, normalize_email_reasonable, normalize_email_full } from './email'

////////////////////////////////////

describe(`${LIB} - utils/email`, function() {
	const TEST_EMAIL = 'foo.bar+baz@googlemail. Com'
	const TEST_EMAIL_OFFIRMO_ALT = 'offirmo.net+xyz@gmail. Com'

	describe('normalize_email_safe()', function() {
		it('should work', () => {
			expect(normalize_email_safe(TEST_EMAIL))
				.to.equal(NORMALIZERS.normalize_email_safe(TEST_EMAIL))
		})
		it('should normalize offirmo.net+xxx@gmail.com appropriately', () => {
			expect(normalize_email_safe(TEST_EMAIL_OFFIRMO_ALT))
				.to.equal(NORMALIZERS.normalize_email_safe(TEST_EMAIL_OFFIRMO_ALT))
		})
	})

	describe('normalize_email_reasonable()', function() {
		it('should work', () => {
			expect(normalize_email_reasonable(TEST_EMAIL))
				.to.equal(NORMALIZERS.normalize_email_reasonable(TEST_EMAIL))
		})
		it('should normalize offirmo.net+xxx@gmail.com appropriately', () => {
			expect(normalize_email_reasonable(TEST_EMAIL_OFFIRMO_ALT))
				.to.equal(NORMALIZERS.normalize_email_safe(TEST_EMAIL_OFFIRMO_ALT))
		})
	})

	describe('normalize_email_full()', function() {
		it('should work', () => {
			expect(normalize_email_full(TEST_EMAIL))
				.to.equal(NORMALIZERS.normalize_email_full(TEST_EMAIL))
		})
		it('should normalize offirmo.net+xxx@gmail.com appropriately', () => {
			expect(normalize_email_full(TEST_EMAIL_OFFIRMO_ALT))
				.to.equal(NORMALIZERS.normalize_email_safe(TEST_EMAIL_OFFIRMO_ALT))
		})
	})
})
