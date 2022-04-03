/////////////////////

import {expect} from 'chai'

import { NORMALIZERS } from '.'

////////////////////////////////////

const LIB = 'normalize-string'

describe(`${LIB} - utils`, function() {
	const { normalize_email_full, normalize_email_reasonable } = NORMALIZERS

	describe('normalize_email_full()', function () {

		context('when not correct', () => {

			it('should reject - "abcd"', () => {
				const TEST_EMAIL = 'abcd'
				expect(() => normalize_email_full(TEST_EMAIL)).to.throw('Invalid email: no @')
			})

			it('should reject - "abc@def@ghi"', () => {
				const TEST_EMAIL = 'abc@def@ghi'
				expect(() => normalize_email_full(TEST_EMAIL)).to.throw('Invalid email: more than one @')
			})

			it('should reject - "@"', () => {
				const TEST_EMAIL = '@'
				expect(() => normalize_email_full(TEST_EMAIL)).to.throw('Invalid email: bad domain')
			})
		})

		context('when correct', () => {

			it('should normalize - googlemail', () => {
				const TEST_EMAIL = 'Abcd.Efgh+ijkl@Googlemail. Com'
				expect(normalize_email_full(TEST_EMAIL)).to.equal('abcdefgh@gmail.com')
			})

			it('should normalize - gmail', () => {
				const TEST_EMAIL = 'Abcd.Efgh+ijkl@Gmail. Com'
				expect(normalize_email_full(TEST_EMAIL)).to.equal('abcdefgh@gmail.com')
			})

			it('should normalize - hotmail', () => {
				const TEST_EMAIL = 'Abcd.Efgh+ijkl@Hotmail. Com'
				expect(normalize_email_full(TEST_EMAIL)).to.equal('abcd.efgh@hotmail.com')
			})

			it('should normalize - live', () => {
				const TEST_EMAIL = 'Abcd.Efgh+ijkl@Live. Com'
				expect(normalize_email_full(TEST_EMAIL)).to.equal('abcdefgh@live.com')
			})

			it('should normalize - outlook', () => {
				const TEST_EMAIL = 'Abcd.Efgh+ijkl@Outlook. Com'
				expect(normalize_email_full(TEST_EMAIL)).to.equal('abcd.efgh@outlook.com')
			})

			it('should normalize - other', () => {
				const TEST_EMAIL = 'Abcd.Efgh+ijkl@Foo. Com'
				expect(normalize_email_full(TEST_EMAIL)).to.equal('abcd.efgh+ijkl@foo.com')
			})
		})
	})

	describe('normalize_email_reasonable()', function () {

		context('when not correct', () => {

			it('should reject - "abcd"', () => {
				const TEST_EMAIL = 'abcd'
				expect(() => normalize_email_reasonable(TEST_EMAIL)).to.throw('Invalid email: no @')
			})

			it('should reject - "abc@def@ghi"', () => {
				const TEST_EMAIL = 'abc@def@ghi'
				expect(() => normalize_email_reasonable(TEST_EMAIL)).to.throw('Invalid email: more than one @')
			})

			it('should reject - "@"', () => {
				const TEST_EMAIL = '@'
				expect(() => normalize_email_reasonable(TEST_EMAIL)).to.throw('Invalid email: bad domain')
			})
		})

		context('when correct', () => {

			it('should normalize - googlemail', () => {
				const TEST_EMAIL = 'Abcd.Efgh+ijkl@Googlemail. Com'
				expect(normalize_email_reasonable(TEST_EMAIL)).to.equal('abcd.efgh@gmail.com')
			})

			it('should normalize - gmail', () => {
				const TEST_EMAIL = 'Abcd.Efgh+ijkl@Gmail. Com'
				expect(normalize_email_reasonable(TEST_EMAIL)).to.equal('abcd.efgh@gmail.com')
			})

			it('should normalize - hotmail', () => {
				const TEST_EMAIL = 'Abcd.Efgh+ijkl@Hotmail. Com'
				expect(normalize_email_reasonable(TEST_EMAIL)).to.equal('abcd.efgh@hotmail.com')
			})

			it('should normalize - live', () => {
				const TEST_EMAIL = 'Abcd.Efgh+ijkl@Live. Com'
				expect(normalize_email_reasonable(TEST_EMAIL)).to.equal('abcd.efgh@live.com')
			})

			it('should normalize - outlook', () => {
				const TEST_EMAIL = 'Abcd.Efgh+ijkl@Outlook. Com'
				expect(normalize_email_reasonable(TEST_EMAIL)).to.equal('abcd.efgh@outlook.com')
			})

			it('should normalize - other', () => {
				const TEST_EMAIL = 'Abcd.Efgh+ijkl@Foo. Com'
				expect(normalize_email_reasonable(TEST_EMAIL)).to.equal('abcd.efgh+ijkl@foo.com')
			})
		})
	})
})
