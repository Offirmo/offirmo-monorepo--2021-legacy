import { Enum } from 'typescript-string-enums'
import { expect } from 'chai'

import { AchievementStatus, AchievementDefinition } from '@tbrpg/state--progress'
import { xxx_internal_reset_prng_cache } from '@oh-my-rpg/state-prng'

import { LIB } from '../../consts'
import { State, UState } from '../../types'
import { create } from '..'
import { _refresh_achievements } from '.'
import ACHIEVEMENT_DEFINITIONS from '../../data/achievements'


describe(`${LIB} - reducer`, function() {
	beforeEach(() => xxx_internal_reset_prng_cache())

	describe('_refresh_achievements()', function() {

		context('🚫  when having no new achievements', function() {

			it('should not change the state at all', () => {
				const state = create() // includes an initial refresh

				// a second time
				const new_state = _refresh_achievements(state)

				expect(new_state).to.equal(state) // immutability
			})
		})

		context('✅  when having new achievements', function() {

			it('should generate only a bunch of basic achievements', () => {
				let state = create()

				// trigger an achievement out of band (would never happen for real)
				state = {
					...state,
					u_state: {
						...state.u_state,
						avatar: {
							...state.u_state.avatar,
							name: 'Foo',
						},
					},
				}

				const new_state = _refresh_achievements(state)

				expect(new_state).not.to.equal(state) // immutability
			})
		})
	})

	describe('achievements', function() {
		ACHIEVEMENT_DEFINITIONS.forEach((definition: AchievementDefinition<UState>) => {
			describe(`achievements "${definition.name}"`, function() {
				it('should be testable and not throw', () => {
					const state = create()

					const status = definition.get_status(state.u_state)
					expect(Enum.isType(AchievementStatus, status)).to.be.true
				})
			})
		})

		describe('statistics', function() {
			it(`achievements count: ${ACHIEVEMENT_DEFINITIONS.length}`)
		})
	})
})
