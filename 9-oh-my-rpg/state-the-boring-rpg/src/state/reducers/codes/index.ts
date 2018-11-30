/////////////////////


import { Random, Engine } from '@offirmo/random'

/////////////////////

import { ItemQuality, Element, Item, InventorySlot } from '@oh-my-rpg/definitions'

import * as CharacterState from '@oh-my-rpg/state-character'
import {
	CharacterAttribute,
	CharacterAttributes,
	CharacterClass,
	increase_stat,
	rename,
	switch_class,
} from '@oh-my-rpg/state-character'

import * as WalletState from '@oh-my-rpg/state-wallet'
import * as InventoryState from '@oh-my-rpg/state-inventory'
import * as EnergyState from '@oh-my-rpg/state-energy'
import * as EngagementState from '@oh-my-rpg/state-engagement'
import * as PRNGState from '@oh-my-rpg/state-prng'
import * as CodesState from '@oh-my-rpg/state-codes'
import * as ProgressState from '@oh-my-rpg/state-progress'

import { Currency } from '@oh-my-rpg/state-wallet'

import {
	get_prng,
	generate_random_seed,
} from '@oh-my-rpg/state-prng'

import {
	Weapon,
	matches as matches_weapon,
	create as create_weapon,
} from '@oh-my-rpg/logic-weapons'
import {
	Armor,
	matches as matches_armor,
	create as create_armor,
} from '@oh-my-rpg/logic-armors'

import {
	CodesConditions
} from '@oh-my-rpg/state-codes'

/////////////////////

import { get_lib_SEC } from '../../../sec'
import { State } from '../../../types'
import { EngagementKey } from '../../../engagement'

import {
	get_energy_snapshot,
} from '../../../selectors'

import { _receive_item } from '../base'
import { _refresh_achievements } from '../achievements'

/////////////////////

function attempt_to_redeem_code(state: Readonly<State>, code: string): Readonly<State> {
	const infos: CodesConditions = {
		has_energy_depleted: get_energy_snapshot(state).available_energy < 1,
		good_play_count: state.progress.statistics.good_play_count,
		is_alpha_player: true, // TODO clean that up when moving to beta
		is_player_since_alpha: true,
	}

	let engagement_key: EngagementKey = EngagementKey['code_redemption--failed']
	let engagement_params: any = {}
	if (!CodesState.is_code_redeemable(state.codes, code, infos)) {
		// TODO ?
	}
	else {
		state = {
			...state,
			codes: CodesState.redeem_code(get_lib_SEC(), state.codes, code, infos),
		}

		code = CodesState.normalize_code(code)
		engagement_key = EngagementKey['code_redemption--succeeded']
		engagement_params.code = code
		switch(code) {
			case 'TESTNEVER':
			case 'TESTALWAYS':
			case 'TESTONCE':
			case 'TESTTWICE':
				// test codes which do nothing
				break
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
				// this will auto-re-gain this achievement
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
