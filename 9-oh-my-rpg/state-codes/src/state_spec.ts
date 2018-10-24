import deepFreeze from "deep-freeze-strict"
import { expect } from 'chai'

import { SCHEMA_VERSION } from './consts'
import {
	CodesConditions,
	State,
	is_code,
	is_code_redeemable,
	create,
	redeem_code,
} from '.'
import { get_lib_SEC } from './sec'

describe('@oh-my-rpg/state-codes - reducer', function() {

	describe('🆕  initial state', function() {

		it('should have correct defaults', function() {
			const state = create(get_lib_SEC())
			expect(state).to.deep.equal({
				schema_version: SCHEMA_VERSION,
				revision: 0,

				redeemed_codes: {},
			})
		})
	})

	describe('code redemption', function() {
		const BASE_INFOS: Readonly<CodesConditions> = deepFreeze({
			good_play_count: 0,
			is_alpha_player: true,
			is_player_since_alpha: true,
		})

		context('when the code is unknown or when the conditions are NOT met', function() {

			// no need to test detailed, see selectors
			it('should reject and not update the state', () => {
				let state = create()
				let SEC = get_lib_SEC()

				const do_it = () => redeem_code(SEC, state, 'TESTNEVER', BASE_INFOS)
				expect(do_it).to.throw('This code is either non-existing or non redeemable at the moment')
				expect(state.redeemed_codes).to.deep.equal({})
				expect(state.revision).to.equal(0)
			})
		})

		context('when the conditions are met', function() {

			it('should update the state', () => {
				let state = create()
				let SEC = get_lib_SEC()
				const code = 'TESTALWAYS'

				state = redeem_code(SEC, state, code, BASE_INFOS)

				expect(state.redeemed_codes).to.have.property(code)
				expect(state.redeemed_codes[code]).to.have.property('redeem_count', 1)
				expect(state.redeemed_codes[code]).to.have.property('last_redeem_date_minutes')
				expect(state.revision).to.equal(1)

				state = redeem_code(SEC, state, code, BASE_INFOS)

				expect(state.redeemed_codes).to.have.property(code)
				expect(state.redeemed_codes[code]).to.have.property('redeem_count', 2)
				expect(state.redeemed_codes[code]).to.have.property('last_redeem_date_minutes')
				expect(state.revision).to.equal(2)
			})
		})
	})
})
