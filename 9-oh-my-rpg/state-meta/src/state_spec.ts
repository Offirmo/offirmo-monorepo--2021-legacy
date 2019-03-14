import { expect } from 'chai'

import { LIB, SCHEMA_VERSION } from './consts'

import {
	State,
	create,
} from '.'

describe(`${LIB} - reducer`, function() {

	describe('🆕  initial state', function() {

		it('should have correct defaults', function() {
			let state = create()

			expect(state).to.deep.equal({
				schema_version: SCHEMA_VERSION,
				revision: 0,

				persistence_id: undefined,

				is_web_diversity_supporter: false,
				is_logged_in: false,
				roles: [],
			})
		})
	})
})
