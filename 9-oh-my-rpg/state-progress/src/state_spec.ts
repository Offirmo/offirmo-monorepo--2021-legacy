import { expect } from 'chai'

import { SCHEMA_VERSION } from './consts'
import {
	AchievementStatus,
	create,
	on_played,
	on_achieved,
} from '.'
import { get_lib_SEC } from './sec'

describe('@oh-my-rpg/state-progress - reducer', function() {

	describe('🆕  initial state', function() {

		it('should have correct defaults', function() {
			const state = create(get_lib_SEC())
			expect(state).to.deep.equal({
				schema_version: SCHEMA_VERSION,
				revision: 0,

				wiki: null,
				flags: null,
				achievements: {},

				statistics: {
					good_play_count: 0,
					bad_play_count: 0,
					encountered_adventures: {},
					encountered_monsters: {},
					good_play_count_by_active_class: {},
					bad_play_count_by_active_class: {},
					has_account: false,
					is_registered_alpha_player: false,
				}
			})
		})
	})

	describe('on_played', function() {

		context('bad', function() {

			it('should correct updates relevant values', function() {
				let state = create(get_lib_SEC())

				state = on_played(state, {
					good: false,
					adventure_key: 'foo_adv',
					encountered_monster_key: null,
					active_class: 'foo',
				})

				expect(state.statistics).to.deep.equal({
					good_play_count: 0,
					bad_play_count: 1,
					encountered_adventures: {
						'foo_adv': true,
					},
					encountered_monsters: {},
					good_play_count_by_active_class: {},
					bad_play_count_by_active_class: {
						'foo': 1,
					},
					has_account: false,
					is_registered_alpha_player: false,
				})
			})
		})

		context('good', function() {

			it('should correct updates relevant values', function() {
				let state = create(get_lib_SEC())

				state = on_played(state, {
					good: true,
					adventure_key: 'foo_adv',
					encountered_monster_key: null,
					active_class: 'foo',
				})

				expect(state.statistics).to.deep.equal({
					good_play_count: 1,
					bad_play_count: 0,
					encountered_adventures: {
						'foo_adv': true,
					},
					encountered_monsters: {},
					good_play_count_by_active_class: {
						'foo': 1,
					},
					bad_play_count_by_active_class: {
					},
					has_account: false,
					is_registered_alpha_player: false,
				})

				state = on_played(state, {
					good: true,
					adventure_key: 'foo_adv',
					encountered_monster_key: 'foo_mon',
					active_class: 'foo',
				})

				expect(state.statistics).to.deep.equal({
					good_play_count: 2,
					bad_play_count: 0,
					encountered_adventures: {
						'foo_adv': true,
					},
					encountered_monsters: {
						'foo_mon': true,
					},
					good_play_count_by_active_class: {
						'foo': 2,
					},
					bad_play_count_by_active_class: {
					},
					has_account: false,
					is_registered_alpha_player: false,
				})
			})
		})
	})

	describe('on_achieved', function() {

		it('should correct updates relevant values', function() {
			let state = create(get_lib_SEC())

			state = on_achieved(state, 'foo', AchievementStatus.revealed)

			expect(state.achievements).to.deep.equal({
				foo: AchievementStatus.revealed,
			})

			state = on_achieved(state, 'bar', AchievementStatus.revealed)
			state = on_achieved(state, 'foo', AchievementStatus.unlocked)

			expect(state.achievements).to.deep.equal({
				bar: AchievementStatus.revealed,
				foo: AchievementStatus.unlocked,
			})
		})
	})
})
