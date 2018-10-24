import { expect } from 'chai'
import deepFreeze from 'deep-freeze-strict'

import {
	CodesConditions,
	is_code,
	is_code_redeemable,
	create,
	redeem_code,
} from '.'
import { get_lib_SEC } from './sec'


describe('@oh-my-rpg/state-codes - selectors', function() {

	describe('is_code()', function() {

		context('when the code is not a string', function() {

			it('should return false', () => {
				const fut: any = is_code
				expect(fut()).to.be.false
				expect(fut(null)).to.be.false
				expect(fut(42)).to.be.false
			})
		})

		context('when the code is unknown', function() {

			it('should return false', () => {
				expect(is_code('FOO')).to.be.false
			})
		})

		context('when the code is known', function() {

			it('should return true', () => {
				expect(is_code('TESTNEVER')).to.be.true
			})
		})
	})

	describe('is_code_redeemable()', function() {

		// should be using is_code() so no need to re-test
		context('when the code is not valid or not known', function() {

			it('should return false', () => {
				const fut: any = is_code_redeemable
				expect(fut()).to.be.false
				expect(fut({}, null)).to.be.false
				expect(fut({}, 42)).to.be.false
				expect(fut({}, 'FOO')).to.be.false
			})
		})

		context('when the code is known', function() {
			const BASE_INFOS: Readonly<CodesConditions> = deepFreeze({
				good_play_count: 0,
				is_alpha_player: true,
				is_player_since_alpha: true,
			})

			describe('count integrated condition', function() {

				it('should return true until the limit is met - once', () => {
					let state = create()
					let SEC = get_lib_SEC()
					expect(is_code_redeemable(state,'TESTONCE', BASE_INFOS), '#1').to.be.true
					state = redeem_code(SEC, state, 'TESTONCE', BASE_INFOS)
					expect(is_code_redeemable(state,'TESTONCE', BASE_INFOS), '#2').to.be.false
				})

				it('should return true until the limit is met - twice', () => {
					let state = create()
					let SEC = get_lib_SEC()
					expect(is_code_redeemable(state,'TESTTWICE', BASE_INFOS), '#1').to.be.true
					state = redeem_code(SEC, state, 'TESTTWICE', BASE_INFOS)
					expect(is_code_redeemable(state,'TESTTWICE', BASE_INFOS), '#2').to.be.true
					state = redeem_code(SEC, state, 'TESTTWICE', BASE_INFOS)
					expect(is_code_redeemable(state,'TESTTWICE', BASE_INFOS), '#3').to.be.false
				})
			})

			describe('is_redeemable custom condition', function() {

				context('when the conditions are met', function() {

					it('should always return true', () => {
						expect(is_code_redeemable(create(),'TESTALWAYS', BASE_INFOS)).to.be.true
					})
				})

				context('when the condition are NOT met', function() {

					it('should return false', () => {
						expect(is_code_redeemable(create(),'TESTNEVER', BASE_INFOS)).to.be.false
					})
				})
			})
		})
	})
})
