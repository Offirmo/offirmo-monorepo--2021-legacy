import { expect } from 'chai'

import { xxx_internal_reset_prng_cache } from '@oh-my-rpg/state-prng'
import * as RichText from '@offirmo-private/rich-text-format'
import { EngagementType } from '@oh-my-rpg/state-engagement'

import { LIB } from '../../consts'
import {
	//create,
	EngagementKey,
	get_engagement_message,
} from '../..'


describe(`${LIB} - engagement messages`, function() {
	beforeEach(() => xxx_internal_reset_prng_cache())

	describe('tip--first_play', function() {

		it('should suggest to play', () => {
			//const state = create()
			const doc = get_engagement_message({
				uid: 0,
				engagement: {
					key: EngagementKey['tip--first_play'],
					type: EngagementType.flow,
				},
				params: {},
			})
			const str = RichText.to_text(doc!)
			//console.log(`"${str}"`)
			expect(str).to.include('Tip:')
			expect(str).to.include('Select play')
		})
	})

	/*
		context('when the user has already played', function() {

			context('when the user has an unequipped better weapon', function() {
				it('should suggest to install it')
			})
		})

		context('when none of the above', function() {
			it('should not suggest anything')
		})
	})*/
})
