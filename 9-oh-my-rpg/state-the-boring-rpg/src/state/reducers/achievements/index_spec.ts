import { Enum } from 'typescript-string-enums'
import { expect } from 'chai'

import { AchievementStatus, AchievementDefinition } from '@oh-my-rpg/state-progress'
import { xxx_internal_reset_prng_cache } from '@oh-my-rpg/state-prng'

import {
	Currency,
	get_currency_amount,
} from '@oh-my-rpg/state-wallet'

import { State } from '../../../types'
import { create, refresh_achievements } from '../state'
import ACHIEVEMENT_DEFINITIONS from '../../../data/achievements'

describe('@oh-my-rpg/state-the-boring-rpg - reducer / achievements', function() {
	beforeEach(() => xxx_internal_reset_prng_cache())

	describe('refresh_achievements()', function() {

		context('🚫  when having no new achievements', function() {

			it('should not change the state at all', () => {
				const state = refresh_achievements(create())

				// a second time
				const new_state = refresh_achievements(state)

				expect(new_state).to.equal(state) // immutability
			})
		})

		context('✅  when having new achievements', function() {

			it('should generate only a bunch of basic achievements', () => {
				const state = create()

				const new_state = refresh_achievements(state)

				expect(new_state).not.to.equal(state) // immutability

			})
		})
	})

	describe('achievements', function() {
		ACHIEVEMENT_DEFINITIONS.forEach((definition: AchievementDefinition<State>) => {
			describe(`achievements "${definition.name}"`, function() {
				it('should be testable and not throw', () => {
					let state = create()

					const status = definition.get_status(state)
					expect(Enum.isType(AchievementStatus, status)).to.be.true
				})
			})
		})

		describe('statistics', function() {
			it(`achievements count: ${ACHIEVEMENT_DEFINITIONS.length}`)
		})
	})
})
