/////////////////////

import { TimestampUTCMs, get_UTC_timestamp_ms } from '@offirmo-private/timestamps'
import { propagate_child_revision_increment_upward } from '@offirmo-private/state'

/////////////////////

import * as EnergyState from '@oh-my-rpg/state-energy'
import * as EngagementState from '@oh-my-rpg/state-engagement'
import * as PRNGState from '@oh-my-rpg/state-prng'
import * as CodesState from '@oh-my-rpg/state-codes'
import * as ProgressState from '@oh-my-rpg/state-progress'

import { ItemQuality } from '@oh-my-rpg/definitions'
import { get_prng } from '@oh-my-rpg/state-prng'
import { create as create_weapon } from '@oh-my-rpg/logic-weapons'
import { create as create_armor } from '@oh-my-rpg/logic-armors'

/////////////////////

import { State } from '../types'
import { EngagementKey } from '../data/engagement'
import { CODE_SPECS_BY_KEY } from '../data/codes'

import {
	_update_to_now,
	_receive_item,
	_auto_make_room,
} from './internal'

import { _refresh_achievements } from './achievements'
import { reset_and_salvage } from '../migrations/salvage'
import { reseed } from './create'

/////////////////////

function attempt_to_redeem_code(state: Readonly<State>, code: string, now_ms: TimestampUTCMs = get_UTC_timestamp_ms()): Readonly<State> {
	let previous_state: State | null = state
	let engagement_key: EngagementKey = EngagementKey['code_redemption--failed'] // so far
	const engagement_params: any = {}

	code = CodesState.normalize_code(code)
	const code_spec = CODE_SPECS_BY_KEY[code]

	if (!code_spec || !CodesState.is_code_redeemable(state.u_state.codes, code_spec, state)) {
		// nothing to do,
		// will trigger an engagement rejection below
	}
	else {
		state = _update_to_now(state, now_ms)
		state = {
			...state,
			u_state: {
				...state.u_state,
				codes: CodesState.attempt_to_redeem_code(state.u_state.codes, code_spec, state),
			},
		}

		engagement_key = EngagementKey['code_redemption--succeeded']
		engagement_params.code = code

		// spread them for convenience
		// BE CAREFUL!
		let { u_state, t_state } = state

		switch(code) {
			case 'TESTNOTIFS':
				u_state = {
					...u_state,
					engagement: EngagementState.enqueue(u_state.engagement, {
						type: EngagementState.EngagementType.flow,
						key: EngagementKey['hello_world--flow'],
					}, {
						// TODO make flow have semantic levels as well!
						name: 'flow from TESTNOTIFS',
					}),
				}
				u_state = {
					...u_state,
					engagement: EngagementState.enqueue(u_state.engagement, {
						type: EngagementState.EngagementType.aside,
						key: EngagementKey['hello_world--aside'],
					}, {
						name: 'aside default from TESTNOTIFS',
					}),
				}
				u_state = {
					...u_state,
					engagement: EngagementState.enqueue(u_state.engagement, {
						type: EngagementState.EngagementType.aside,
						key: EngagementKey['hello_world--aside'],
					}, {
						semantic_level: 'error',
						name: 'aside error from TESTNOTIFS',
					}),
				}
				u_state = {
					...u_state,
					engagement: EngagementState.enqueue(u_state.engagement, {
						type: EngagementState.EngagementType.aside,
						key: EngagementKey['hello_world--aside'],
					}, {
						semantic_level: 'warning',
						name: 'aside warning from TESTNOTIFS',
					}),
				}
				u_state = {
					...u_state,
					engagement: EngagementState.enqueue(u_state.engagement, {
						type: EngagementState.EngagementType.aside,
						key: EngagementKey['hello_world--aside'],
					}, {
						semantic_level: 'info',
						name: 'aside info from TESTNOTIFS',
					}),
				}
				u_state = {
					...u_state,
					engagement: EngagementState.enqueue(u_state.engagement, {
						type: EngagementState.EngagementType.aside,
						key: EngagementKey['hello_world--aside'],
					}, {
						semantic_level: 'success',
						name: 'aside success from TESTNOTIFS',
					}),
				}
				u_state = {
					...u_state,
					engagement: EngagementState.enqueue(u_state.engagement, {
						type: EngagementState.EngagementType.warning,
						key: EngagementKey['hello_world--warning'],
					}, {
						name: 'warning from TESTNOTIFS',
					}),
				}
				break

			case 'TESTACH':
				// complicated, but will auto-re-gain this achievement
				u_state = {
					...u_state,
					//					progress: ProgressState.on_achieved(u_state.progress, 'TEST', ProgressState.AchievementStatus.revealed)
					progress: {
						...u_state.progress,
						achievements: {
							...u_state.progress.achievements,
							'TEST': ProgressState.AchievementStatus.revealed,
						},
					},
				}
				break

			case 'BORED': {
				t_state = {
					...t_state,
					energy: EnergyState.restore_energy([u_state.energy, t_state.energy], 1.),
				}
				break
			}

			case 'XYZZY':
				// http://www.plover.net/~davidw/sol/xyzzy.html
				u_state = {
					...u_state,
					engagement: EngagementState.enqueue(u_state.engagement, {
						type: EngagementState.EngagementType.flow,
						key: EngagementKey['just-some-text'],
					}, {
						// http://rickadams.org/adventure/d_hints/hint024.html
						text: 'fee fie foe foo ;)',
					}),
				}
				break

			case 'PLUGH':
				// http://www.plover.net/~davidw/sol/plugh.html
				u_state = {
					...u_state,
					engagement: EngagementState.enqueue(u_state.engagement, {
						type: EngagementState.EngagementType.flow,
						key: EngagementKey['just-some-text'],
					}, {
						text: 'A hollow voice says "Ahhhhhhh".', // TODO more
					}),
				}
				break

			case 'REBORNX':
				previous_state = null // since we completely recreate the state
				state = reseed(state) // force random reseed to see new stuff
				state = reset_and_salvage(state as any)
				u_state = state.u_state
				t_state = state.t_state
				u_state = {
					...u_state,
					progress: ProgressState.on_achieved(u_state.progress, 'Reborn!', ProgressState.AchievementStatus.unlocked),
				}
				break
			case 'REBORN':
				previous_state = null // since we completely recreate the state
				state = reset_and_salvage(state as any)
				u_state = state.u_state
				t_state = state.t_state
				u_state = {
					...u_state,
					progress: ProgressState.on_achieved(u_state.progress, 'Reborn!', ProgressState.AchievementStatus.unlocked),
				}
				break

			case 'ALPHATWINK': {
				const rng = get_prng(u_state.prng)
				const weapon = create_weapon(rng, {
					quality: ItemQuality.artifact,
					qualifier2_hid: 'twink',
				})
				const armor = create_armor(rng, {
					quality: ItemQuality.artifact,
					qualifier2_hid: 'twink',
				})
				u_state = {
					...u_state,
					prng: PRNGState.update_use_count(u_state.prng, rng, 6),
				}
				state = {
					...state,
					u_state,
					t_state,
				}
				state = _auto_make_room(state)
				state = _receive_item(state, weapon)
				state = _auto_make_room(state)
				state = _receive_item(state, armor)
				u_state = state.u_state
				t_state = state.t_state
				break
			}

			default:
				throw new Error(`Internal error: code "${code}" not implemented!`)
		}

		// re-assemble
		state = {
			...state,
			u_state,
			t_state,
		}
	}

	// enqueue the result
	state = {
		...state,
		u_state: {
			...state.u_state,
			engagement: EngagementState.enqueue(state.u_state.engagement, {
				type: EngagementState.EngagementType.flow,
				key: engagement_key,
			}, engagement_params),
		},
	}

	state = propagate_child_revision_increment_upward(previous_state, state)

	return _refresh_achievements(state)
}

/////////////////////

export {
	attempt_to_redeem_code,
}

/////////////////////
