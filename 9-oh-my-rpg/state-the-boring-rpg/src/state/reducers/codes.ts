/////////////////////

import { Random, Engine } from '@offirmo/random'

/////////////////////

import { ItemQuality } from "@oh-my-rpg/definitions";

import * as WalletState from '@oh-my-rpg/state-wallet'
import * as InventoryState from '@oh-my-rpg/state-inventory'
import * as EnergyState from '@oh-my-rpg/state-energy'
import * as EngagementState from '@oh-my-rpg/state-engagement'
import * as PRNGState from '@oh-my-rpg/state-prng'
import * as CodesState from '@oh-my-rpg/state-codes'
import * as ProgressState from '@oh-my-rpg/state-progress'

import { get_prng } from '@oh-my-rpg/state-prng'
import { create as create_weapon } from '@oh-my-rpg/logic-weapons'
import { create as create_armor } from '@oh-my-rpg/logic-armors'
import { CodeSpec } from '@oh-my-rpg/state-codes'
import { switch_class } from '@oh-my-rpg/state-character'

/////////////////////

import { State } from '../../types'
import { EngagementKey } from '../../engagement'
import { CODE_SPECS_BY_KEY } from '../../data/codes'

import { _receive_item } from './base'
import { _refresh_achievements } from './achievements'
import { reset_and_salvage } from '../migrations/salvage'
import {reseed} from "./create";
import { _auto_make_room } from './autoplay'

/////////////////////

/*
	if (!is_code_redeemable(state, code, infos))
		throw new Error(`This code is either non-existing or non redeemable at the moment!`)
 */
function attempt_to_redeem_code(state: Readonly<State>, code: string): Readonly<State> {
	let engagement_key: EngagementKey = EngagementKey['code_redemption--failed']
	let engagement_params: any = {}

	code = CodesState.normalize_code(code)
	const code_spec = CODE_SPECS_BY_KEY[code]

	if (!code_spec || !CodesState.is_code_redeemable(state.codes, code_spec, state)) {
		// this should not having been called
		// nothing to do, will trigger an engagement rejection
	}
	else {
		state = {
			...state,
			codes: CodesState.attempt_to_redeem_code(state.codes, code_spec, state),
		}

		engagement_key = EngagementKey['code_redemption--succeeded']
		engagement_params.code = code
		switch(code) {
			case 'TESTNOTIFS':
				state = {
					...state,
					engagement: EngagementState.enqueue(state.engagement, {
						type: EngagementState.EngagementType.flow,
						key: EngagementKey['hello_world--flow'],
					}, {
						// TODO make flow have semantic levels as well!
						name: 'flow from TESTNOTIFS',
					}),
				}
				state = {
					...state,
					engagement: EngagementState.enqueue(state.engagement, {
						type: EngagementState.EngagementType.aside,
						key: EngagementKey['hello_world--aside'],
					}, {
						name: 'aside default from TESTNOTIFS',
					}),
				}
				state = {
					...state,
					engagement: EngagementState.enqueue(state.engagement, {
						type: EngagementState.EngagementType.aside,
						key: EngagementKey['hello_world--aside'],
					}, {
						semantic_level: 'error',
						name: 'aside error from TESTNOTIFS',
					}),
				}
				state = {
					...state,
					engagement: EngagementState.enqueue(state.engagement, {
						type: EngagementState.EngagementType.aside,
						key: EngagementKey['hello_world--aside'],
					}, {
						semantic_level: 'warning',
						name: 'aside warning from TESTNOTIFS',
					}),
				}
				state = {
					...state,
					engagement: EngagementState.enqueue(state.engagement, {
						type: EngagementState.EngagementType.aside,
						key: EngagementKey['hello_world--aside'],
					}, {
						semantic_level: 'info',
						name: 'aside info from TESTNOTIFS',
					}),
				}
				state = {
					...state,
					engagement: EngagementState.enqueue(state.engagement, {
						type: EngagementState.EngagementType.aside,
						key: EngagementKey['hello_world--aside'],
					}, {
						semantic_level: 'success',
						name: 'aside success from TESTNOTIFS',
					}),
				}
				state = {
					...state,
					engagement: EngagementState.enqueue(state.engagement, {
						type: EngagementState.EngagementType.warning,
						key: EngagementKey['hello_world--warning'],
					}, {
						name: 'warning from TESTNOTIFS',
					}),
				}
				break

			case 'TESTACH':
				// complicated, but will auto-re-gain this achievement
				state = {
					...state,
					progress: ProgressState.on_achieved(state.progress, 'TEST', ProgressState.AchievementStatus.revealed)
				}
				break

			case 'BORED':
				state = {
					...state,
					energy: EnergyState.restore_energy(state.energy, 1.),
				}
				break

			case 'XYZZY':
				// http://www.plover.net/~davidw/sol/xyzzy.html
				state = {
					...state,
					engagement: EngagementState.enqueue(state.engagement, {
						type: EngagementState.EngagementType.flow,
						key: EngagementKey['just-some-text'],
					}, {
						text: 'Nothing happens.', // TODO
					}),
				}
				break
			case 'PLUGH':
				// http://www.plover.net/~davidw/sol/plugh.html
				state = {
					...state,
					engagement: EngagementState.enqueue(state.engagement, {
						type: EngagementState.EngagementType.flow,
						key: EngagementKey['just-some-text'],
					}, {
						text: 'A hollow voice says "Ahhhhhhh".', // TODO
					}),
				}
				break

			case 'REBORNX':
				state = reseed(state) // force random reseed to see new stuff
				state = reset_and_salvage(state as any)
				state = {
					...state,
					progress: ProgressState.on_achieved(state.progress, 'Reborn!', ProgressState.AchievementStatus.unlocked)
				}
				break
			case 'REBORN':
				state = reset_and_salvage(state as any)
				state = {
					...state,
					progress: ProgressState.on_achieved(state.progress, 'Reborn!', ProgressState.AchievementStatus.unlocked)
				}
				break

			case 'ALPHATWINK': {
				const rng = get_prng(state.prng)
				const weapon = create_weapon(rng, { quality: ItemQuality.artifact })
				const armor = create_armor(rng, { quality: ItemQuality.artifact })
				state = _auto_make_room(state)
				state = _receive_item(state, weapon)
				state = _auto_make_room(state)
				state = _receive_item(state, armor)
				state = {
					...state,
					prng: PRNGState.update_use_count(state.prng, rng, 8),
				}
				break
			}

			default:
				throw new Error(`Internal error: code "${code}" not implemented!`)
		}
	}

	return _refresh_achievements({
		...state,
		engagement: EngagementState.enqueue(state.engagement, {
			type: EngagementState.EngagementType.flow,
			key: engagement_key,
		}, engagement_params),
		revision: state.revision + 1,
	})
}

/////////////////////

export {
	attempt_to_redeem_code,
}

/////////////////////
