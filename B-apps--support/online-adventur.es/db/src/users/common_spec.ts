/////////////////////

import {expect} from 'chai'

import { LIB } from '../consts'
import { TABLE__USERS } from './consts'
import { _infer_avatar_url, _infer_called, _sanitize_called } from './common'
import { get_test_base_user_01 } from './_test_helpers'

////////////////////////////////////

describe(`${LIB} - ${TABLE__USERS} - common`, function() {

	describe('infer_avatar_url()', function() {

		it('should work', () => {
			expect(_infer_avatar_url(
				get_test_base_user_01({
					raw_email: 'foo.bar+test@gmail.Com'
				})
			)).to.equal('https://unavatar.now.sh/foo.bar@gmail.com')
		})
	})

	describe('infer_called()', function() {

		it('should work', () => {
			expect(_infer_called(
				get_test_base_user_01({
					raw_email: 'foo.bar@gmail.Com'
				})
			)).to.equal('Foo Bar')
		})
	})

	describe('sanitize_called()', function() {

		it('should work', () => {
			expect(_sanitize_called(
				_infer_called(get_test_base_user_01({
					raw_email: 'foo.bar@gmail.Com'
				}))
			)).to.equal('Foo Bar')
		})
	})
})
