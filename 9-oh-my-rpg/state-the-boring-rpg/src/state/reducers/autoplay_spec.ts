import { expect } from 'chai'

import prettify_json from '@offirmo/prettify-json'
import { xxx_internal_reset_prng_cache } from '@oh-my-rpg/state-prng'

import { LIB } from '../../consts'
import { create } from '.'
import { _autoplay } from './autoplay'

describe(`${LIB} - reducer`, function() {
	beforeEach(() => xxx_internal_reset_prng_cache())

	describe.only('autoplay', function() {

		it('should allow playing a huge number of time', () => {
			let state = create()

			try {
				for (let i = 0; i < 1000; ++i) {
					state = _autoplay(state)
				}
			}
			catch (err) {
				console.log(prettify_json(state))
				throw err
			}

			console.log(prettify_json(state))
		})

		it('should automatically make decisions')
	})
})
