import { expect } from 'chai'
import deepFreeze from 'deep-freeze-strict'

import { xxx_internal_reset_prng_cache } from '@oh-my-rpg/state-prng'

import { LIB } from '../../consts'
import { EngagementKey } from '../../engagement'
import {
	create,
	reseed,
	attempt_to_redeem_code,
} from '.'

import {
	_loose_all_energy,
	_ack_all_engagements
} from './internal'

describe(`${LIB} - reducer - codes`, function() {
	beforeEach(() => xxx_internal_reset_prng_cache())

	const CODES = [
		'TESTNOTIFS',
		'TESTACH',
		'BORED',
		'XYZZY',
		'PLUGH',
		'REBORNX',
		'REBORN',
		'ALPHATWINK'
	]

	CODES.forEach(code => {
		describe(`good code "${code}"`, function() {
			it('should not cause a crash', function() {
				const initial_state = deepFreeze(
					_ack_all_engagements(
						_loose_all_energy( // for BORED
							reseed(
								create()
							)
						)
					)
				)

				let final_state = attempt_to_redeem_code(initial_state, code)

				expect(final_state.u_state.engagement.queue.length).to.be.above(0)
				let notif = final_state.u_state.engagement.queue.slice(-1)[0]
				if (notif.engagement.key === EngagementKey['achievement-unlocked'])
					notif = final_state.u_state.engagement.queue.slice(-2)[0]
				//console.log(notif)
				expect(notif).to.have.nested.property('engagement.type', 'flow')
				expect(notif).to.have.nested.property('engagement.key', EngagementKey['code_redemption--succeeded'])
				expect(notif).to.have.nested.property('params.code', code)
			})
		})
	})

	describe(`bad code`, function() {
		it('should cause a crash', function() {
			const initial_state = deepFreeze(
				_ack_all_engagements(
					reseed(
						create()
					)
				)
			)

			let final_state = attempt_to_redeem_code(initial_state, 'irsetuisretuisrt')

			expect(final_state.u_state.engagement.queue.length).to.be.above(0)
			let notif = final_state.u_state.engagement.queue.slice(-1)[0]
			//console.log(notif)
			expect(notif).to.have.nested.property('engagement.type', 'flow')
			expect(notif).to.have.nested.property('engagement.key', EngagementKey['code_redemption--failed'])
			//expect(notif).to.have.nested.property('params.code', code)
		})
	})
})
