import { expect } from 'chai'

import { LIB_ID, SCHEMA_VERSION } from './consts'

import {
	State,

	create,
} from '.'

describe('🤕 ❤️  Meta state - reducer', function() {

	describe('🆕  initial state', function() {
		const TEST_UUID_v1 = 'uu1dgqu3h0FydqWyQ~6cYv3g'

		it('should have correct defaults and a unique uuid', function() {
			let state = create()

			// uuid is random
			expect(state.uuid).to.have.lengthOf(TEST_UUID_v1.length)

			state = {
				...state,
				uuid: TEST_UUID_v1
			}

			expect(state).to.deep.equal({
				schema_version: SCHEMA_VERSION,
				revision: 0,

				uuid: TEST_UUID_v1,
				name: 'anonymous',
				email: null,
				allow_telemetry: true,
			})
		})
	})
})
