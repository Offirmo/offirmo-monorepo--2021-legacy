import { expect } from 'chai'

import { xxx_internal_reset_prng_cache } from '@oh-my-rpg/state-prng'
import { enforce_immutability } from '@offirmo-private/state-utils'

import { LIB } from '../consts'
import { EngagementKey } from '../data/engagement'
import {
	create,
	reseed,
	attempt_to_redeem_code,
} from '.'

import {
	_lose_all_energy,
	_ack_all_engagements,
} from './internal'
import {State} from '../types'

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
		'ALPHATWINK',
	]/*.filter(c => c === 'REBORNX')*/

	CODES.forEach(code => {
		describe(`good code "${code}"`, function() {
			it('should not cause a crash', function() {
				const initial_state = enforce_immutability<State>(
					_ack_all_engagements(
						_lose_all_energy( // for BORED
							reseed(
								create(),
							),
						),
					),
				)

				let state = initial_state
				state = attempt_to_redeem_code(state, code)

				expect(state.u_state.engagement.queue.length).to.be.above(0)
				let notif = state.u_state.engagement.queue.slice(-1)[0]
				if (notif.engagement.key === EngagementKey['achievement-unlocked'])
					notif = state.u_state.engagement.queue.slice(-2)[0]
				//console.log(notif)
				expect(notif).to.have.nested.property('engagement.type', 'flow')
				expect(notif).to.have.nested.property('engagement.key', EngagementKey['code_redemption--succeeded'])
				expect(notif).to.have.nested.property('params.code', code)

				// 2nd attempt, sometimes shows bugs
				state = attempt_to_redeem_code(state, code)
			})
		})
	})

	describe('good code with redemption limit', function() {
		// bug seen, v0.59
		it('should correctly crash on second attempt', () => {
			const initial_state = enforce_immutability<State>(
				_ack_all_engagements(
					reseed(
						create(),
					),
				),
			)

			let state = initial_state
			//console.log('attempt #1')
			state = attempt_to_redeem_code(state, 'alphatwink')
			//console.log('attempt #2')
			state = attempt_to_redeem_code(state, 'alphatwink')
			const notif = state.u_state.engagement.queue.slice(-1)[0]
			//console.log(notif)
			expect(notif).to.have.nested.property('engagement.type', 'flow')
			expect(notif).to.have.nested.property('engagement.key', EngagementKey['code_redemption--failed'])
		})
	})

	describe('bad code', function() {
		it('should cause a crash', function() {
			const initial_state = enforce_immutability<State>(
				_ack_all_engagements(
					reseed(
						create(),
					),
				),
			)

			let state = initial_state
			state = attempt_to_redeem_code(state, 'irsetuisretuisrt')

			expect(state.u_state.engagement.queue.length).to.be.above(0)
			const notif = state.u_state.engagement.queue.slice(-1)[0]
			//console.log(notif)
			expect(notif).to.have.nested.property('engagement.type', 'flow')
			expect(notif).to.have.nested.property('engagement.key', EngagementKey['code_redemption--failed'])
			//expect(notif).to.have.nested.property('params.code', code)
		})
	})
})
