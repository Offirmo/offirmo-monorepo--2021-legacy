import { expect } from 'chai'
import { enforce_immutability } from '@offirmo-private/state-utils'
import { get_UTC_timestamp_ms } from '@offirmo-private/timestamps'

import { xxx_internal_reset_prng_cache } from '@oh-my-rpg/state-prng'

import { LIB } from '../consts'
import {create, State} from '..'
import {
	get_available_classes,
	will_next_play_be_good_at,
} from './game'
import { CharacterClass } from '@tbrpg/state--character'
import {
	_lose_all_energy,
} from '../reducers/internal'


describe(`${LIB} - selectors - game`, function() {
	beforeEach(() => xxx_internal_reset_prng_cache())

	describe('get_available_classes()', function() {

		it('should return class strings', () => {
			const { u_state } = enforce_immutability<State>(create())

			const klasses = get_available_classes(u_state)

			expect(klasses).to.be.an('array')
			klasses.forEach(k => {
				expect(k, k).to.be.a('string')
				expect(k.length, k).to.be.above(3)
			})
		})

		it('should filter out novice', () => {
			const { u_state } = enforce_immutability<State>(create())

			const klasses = get_available_classes(u_state)

			expect(klasses.includes(CharacterClass.novice)).to.be.false
		})
	})

	describe('will_next_play_be_good_at()', function() {

		it('should return a correct boolean', () => {
			let state = enforce_immutability<State>(create())

			expect(will_next_play_be_good_at(state, get_UTC_timestamp_ms())).to.be.true

			state = _lose_all_energy(state)
			expect(will_next_play_be_good_at(state, get_UTC_timestamp_ms())).to.be.false
		})

		it('should properly take into account the given time', () => {
			let state = enforce_immutability<State>(create())

			state = _lose_all_energy(state)
			expect(will_next_play_be_good_at(state, get_UTC_timestamp_ms())).to.be.false

			expect(will_next_play_be_good_at(state, get_UTC_timestamp_ms() + 4 * 3600 * 1000)).to.be.true
		})
	})
})
