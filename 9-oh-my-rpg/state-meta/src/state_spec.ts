import { expect } from 'chai'

import { LIB, SCHEMA_VERSION } from './consts'

import {
	State,
	create,
} from '.'

describe(`${LIB} - reducer`, function() {

	describe('🆕  initial state', function() {

		it('should have correct defaults', function() {
			const state = create()

			expect(state).to.deep.equal({
				schema_version: SCHEMA_VERSION,
				revision: 0,

				slot_id: 0,

				is_web_diversity_supporter: false,
				is_logged_in: false,
				roles: [],
			})
		})
	})
})
