/////////////////////

import {expect} from 'chai'

import { LIB } from '../consts'
import { _infer_avatar_url, _infer_called, _sanitize_called } from './common'
import { get_test_base_user_01 } from './_test_helpers'

////////////////////////////////////

describe(`${LIB} - users - common`, function() {

	describe('infer_avatar_url()', function() {

		it('should work', () => {
			expect(_infer_avatar_url(
				get_test_base_user_01({
					raw_email: 'offirmo.net+test@gmail.Com'
				})
			)).to.equal('https://unavatar.now.sh/offirmo.net@gmail.com')
		})
	})

	describe('infer_called()', function() {

		it('should work', () => {
			expect(_infer_called(
				get_test_base_user_01({
					raw_email: 'offirmo.net+test@gmail.Com'
				})
			)).to.equal('Offirmo Net')
		})
	})

	describe('sanitize_called()', function() {

		it('should work', () => {
			expect(_sanitize_called(
				_infer_called(get_test_base_user_01({
					raw_email: 'offirmo.net+test@gmail.Com'
				}))
			)).to.equal('Offirmo Net')
		})
	})
})
