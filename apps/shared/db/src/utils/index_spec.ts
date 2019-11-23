/////////////////////

import {expect} from 'chai'

import { LIB } from '../consts'
import { normalize_email } from '.'

/////////////////////

describe(`${LIB} - utils`, function() {

	describe('normalize_email()', function () {

		context('when not correct', () => {

			it('should reject - case 1', () => {
				const TEST_EMAIL = 'abcd'
				expect(() => normalize_email(TEST_EMAIL)).to.throw('Invalid email: no @')
			})

			it('should reject - case 2', () => {
				const TEST_EMAIL = 'abc@def@ghi'
				expect(() => normalize_email(TEST_EMAIL)).to.throw('Invalid email: more than one @')
			})

			it('should reject - case 3', () => {
				const TEST_EMAIL = '@'
				expect(() => normalize_email(TEST_EMAIL)).to.throw('Invalid email: bad domain')
			})
		})

		context('when correct', () => {

			it('should normalize', () => {
				const TEST_EMAIL = 'Abcd.Efgh+ijkl@Googlemail.Com'
				expect(normalize_email(TEST_EMAIL)).to.equal('abcdefgh@gmail.com')
			})
		})
	})
})
