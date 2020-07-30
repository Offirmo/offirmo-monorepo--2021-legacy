/////////////////////

import {expect} from 'chai'

import { LIB } from '../consts'
import { get_test_netlify_user_01, get_test_netlify_user_01_alt } from './_test_helpers'
import { normalize_email_full, normalize_email_reasonable, normalize_email_safe } from '../utils'

////////////////////////////////////

describe(`${LIB} - users - test helpers`, function() {

	describe('duplicate netlify account', function() {

		it('should have the same normalized email starting from "reasonable"', () => {
			const nu = get_test_netlify_user_01()
			const nu_alt = get_test_netlify_user_01_alt()

			// not equal below reasonable
			expect(nu.email).not.to.equal(nu_alt.email)
			expect(normalize_email_safe(nu.email), 'safe').not.to.equal(normalize_email_safe(nu_alt.email))

			// equal above reasonable
			expect(normalize_email_reasonable(nu.email), 'reasonable').to.equal(normalize_email_reasonable(nu_alt.email))
			expect(normalize_email_full(nu.email), 'full').to.equal(normalize_email_full(nu_alt.email))
		})
	})
})
