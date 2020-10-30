import { expect } from 'chai'
import { enforce_immutability } from '@offirmo-private/state-utils'

import { LIB } from './consts'
import {
	is_code,
	is_code_redeemable,
	create,
	attempt_to_redeem_code,
} from '.'

import { CodesConditions, CODESPECS_BY_KEY } from './test'

/////////////////////

describe(`${LIB} - selectors`, function() {

	describe('is_code()', function() {

		context('when the code is not a string', function() {

			it('should return false', () => {
				const fut: any = is_code
				expect(fut()).to.be.false
				expect(fut(null)).to.be.false
				expect(fut(42)).to.be.false
			})
		})

		context('when the code normalizes to an empty string', function() {

			it('should return false', () => {
				expect(is_code(' 	 ')).to.be.false
				expect(is_code(' - ')).to.be.false
			})
		})

		context('when the code is correct', function() {

			it('should return true', () => {
				expect(is_code(' TESTNEVER')).to.be.true
			})
		})
	})

	describe('is_code_redeemable()', function() {

		// using is_code() so no need to re-test
		//context('when the code is not valid')

		context('when the code is known', function() {
			const BASE_INFOS = enforce_immutability<CodesConditions>({
				has_energy_depleted: false,
				good_play_count: 0,
				is_alpha_player: true,
				is_player_since_alpha: true,
			})

			describe('count integrated condition', function() {

				it('should return true until the limit is met - once', () => {
					let state = create()
					const code_spec = CODESPECS_BY_KEY['TESTONCE']
					expect(is_code_redeemable(state, code_spec, BASE_INFOS), '#1').to.be.true
					state = attempt_to_redeem_code(state, code_spec, BASE_INFOS)
					expect(is_code_redeemable(state, code_spec, BASE_INFOS), '#2').to.be.false
				})

				it('should return true until the limit is met - twice', () => {
					let state = create()
					const code_spec = CODESPECS_BY_KEY['TESTTWICE']
					expect(is_code_redeemable(state,code_spec, BASE_INFOS), '#1').to.be.true
					state = attempt_to_redeem_code(state, code_spec, BASE_INFOS)
					expect(is_code_redeemable(state,code_spec, BASE_INFOS), '#2').to.be.true
					state = attempt_to_redeem_code(state, code_spec, BASE_INFOS)
					expect(is_code_redeemable(state,code_spec, BASE_INFOS), '#3').to.be.false
				})
			})

			describe('is_redeemable custom condition', function() {

				context('when the conditions are met', function() {

					it('should always return true', () => {
						const code_spec = CODESPECS_BY_KEY['TESTALWAYS']
						expect(is_code_redeemable(create(),code_spec, BASE_INFOS)).to.be.true
					})
				})

				context('when the condition are NOT met', function() {

					it('should return false', () => {
						const code_spec = CODESPECS_BY_KEY['TESTNEVER']
						expect(is_code_redeemable(create(),code_spec, BASE_INFOS)).to.be.false
					})
				})
			})
		})
	})
})
