import { expect } from 'chai'

import { xxx_internal_reset_prng_cache } from '@oh-my-rpg/state-prng'


import { LIB } from '../consts'

import {
	get_available_energy_float,
} from '../selectors'

import {
	_lose_all_energy,
} from './internal'

import {
	create,
} from '.'

describe(`${LIB} - reducer - internals`, function() {
	beforeEach(() => xxx_internal_reset_prng_cache())

	describe('_lose_all_energy', function() {
		it('should work', () => {
			let state = create()

			expect(get_available_energy_float(state.t_state)).to.equal(7.)

			state = _lose_all_energy(state)

			expect(get_available_energy_float(state.t_state)).to.equal(0.)
		})
	})
})
