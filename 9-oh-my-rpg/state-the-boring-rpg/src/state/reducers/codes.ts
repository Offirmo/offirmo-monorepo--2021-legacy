/////////////////////

import { Random, Engine } from '@offirmo/random'

/////////////////////

import { CodeSpec } from '@oh-my-rpg/state-codes'

import { switch_class } from '@oh-my-rpg/state-character'

import * as WalletState from '@oh-my-rpg/state-wallet'
import * as InventoryState from '@oh-my-rpg/state-inventory'
import * as EnergyState from '@oh-my-rpg/state-energy'
import * as EngagementState from '@oh-my-rpg/state-engagement'
import * as PRNGState from '@oh-my-rpg/state-prng'
import * as CodesState from '@oh-my-rpg/state-codes'
import * as ProgressState from '@oh-my-rpg/state-progress'


/////////////////////

import { State } from '../../types'
import { EngagementKey } from '../../engagement'
import { CODE_SPECS_BY_KEY } from '../../data/codes'

import { _receive_item } from './base'
import { _refresh_achievements } from './achievements'

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

	if (!CodesState.is_code_redeemable(state.codes, code_spec, state)) {
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

			// TODO
			/*case 'REBORN': {

               }
               break
           case 'ALPHART': {

               }
               break*/
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
