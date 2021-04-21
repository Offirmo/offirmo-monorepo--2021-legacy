/////////////////////

import { Immutable} from '@offirmo-private/ts-types'
import { UUID } from '@offirmo-private/uuid'
import { TimestampUTCMs } from '@offirmo-private/timestamps'

/////////////////////

import { InventorySlot, Item, ItemQuality } from '@tbrpg/definitions'

import { Weapon } from '@oh-my-rpg/logic-weapons'
import * as WeaponLib from '@oh-my-rpg/logic-weapons'
import { Armor } from '@oh-my-rpg/logic-armors'
import * as ArmorLib from '@oh-my-rpg/logic-armors'
import { appraise_power_normalized } from '@tbrpg/logic--shop'
import {
	CharacterAttribute,
	increase_stat,
} from '@tbrpg/state--character'
import { Currency } from '@oh-my-rpg/state-wallet'

import * as EnergyState from '@oh-my-rpg/state-energy'
import * as WalletState from '@oh-my-rpg/state-wallet'
import * as InventoryState from '@tbrpg/state--inventory'
import * as EngagementState from '@oh-my-rpg/state-engagement'

/////////////////////

import { State } from '../types'

import {
	appraise_item_value,
	is_inventory_full,
} from '../selectors'

import { get_lib_SEC } from '../services/sec'

import {STARTING_ARMOR_SPEC, STARTING_WEAPON_SPEC} from './create'

/////////////////////

function compare_items_by_normalized_power(a: Immutable<Item>, b: Immutable<Item>): number {
	const power_a = appraise_power_normalized(a)
	const power_b = appraise_power_normalized(b)

	return power_b - power_a
}

/////////////////////

// WARN those internal reducers:
// - do not refresh achievements or update the T-state
// - do not increment the root revision (this has to be done by the parent to avoid multiple increments)

function _lose_all_energy(state: Immutable<State>): Immutable<State> {
	return {
		...state,
		u_state: {
			...state.u_state,
			energy: {
				...state.u_state.energy,
				revision: state.u_state.energy.revision + 1,
				total_energy_consumed_so_far: Math.max(7, state.u_state.energy.total_energy_consumed_so_far),
			},
		},
		t_state: {
			...state.t_state,
			energy: EnergyState.lose_all_energy([state.u_state.energy, state.t_state.energy]),
		},
	}
}

function _update_to_now(state: Immutable<State>, now_ms: TimestampUTCMs): Immutable<State> {
	const { u_state, t_state } = state

	const t_state_e = EnergyState.update_to_now([u_state.energy, t_state.energy], now_ms)

	if (t_state_e === t_state.energy)
		return state // no change

	return {
		...state,
		t_state: {
			...t_state,
			timestamp_ms: t_state_e.timestamp_ms,
			energy: t_state_e,
		},
	}
}

function _receive_stat_increase(state: Immutable<State>, stat: CharacterAttribute, amount = 1): Immutable<State> {
	return {
		...state,
		u_state: {
			...state.u_state,
			avatar: increase_stat(get_lib_SEC(), state.u_state.avatar, stat, amount),
		},
	}
}

function _receive_item(state: Immutable<State>, item: Item): Immutable<State> {
	// inventory can't be full since we prevent playing in this case
	return {
		...state,
		u_state: {
			...state.u_state,
			inventory: InventoryState.add_item(state.u_state.inventory, item),
		},
	}
}

function _sell_item(state: Immutable<State>, uuid: UUID): Immutable<State> {
	const price = appraise_item_value(state.u_state, uuid)

	return {
		...state,
		u_state: {
			...state.u_state,
			inventory: InventoryState.remove_item_from_unslotted(state.u_state.inventory, uuid),
			wallet: WalletState.add_amount(state.u_state.wallet, Currency.coin, price),
		},
	}
}

function _receive_coins(state: Immutable<State>, amount: number): Immutable<State> {
	return {
		...state,
		u_state: {
			...state.u_state,
			wallet: WalletState.add_amount(state.u_state.wallet, Currency.coin, amount),
		},
	}
}

function _lose_coins(state: Immutable<State>, amount: number): Immutable<State> {
	return {
		...state,
		u_state: {
			...state.u_state,
			wallet: WalletState.remove_amount(state.u_state.wallet, Currency.coin, amount),
		},
	}
}

function _receive_tokens(state: Immutable<State>, amount: number): Immutable<State> {
	return {
		...state,
		u_state: {
			...state.u_state,
			wallet: WalletState.add_amount(state.u_state.wallet, Currency.token, amount),
		},
	}
}

////////////

function _ack_all_engagements(state: Immutable<State>): Immutable<State> {
	if (!state.u_state.engagement.queue.length)
		return state

	return {
		...state,
		u_state: {
			...state.u_state,
			engagement: EngagementState.acknowledge_all_seen(state.u_state.engagement),
		},
	}
}

function _auto_make_room(state: Immutable<State>, options: { DEBUG?: boolean } = {}): Immutable<State> {
	const { DEBUG } = options
	if (DEBUG) console.log(`  - _auto_make_room()… (inventory holding ${state.u_state.inventory.unslotted.length} items)`)

	// inventory full
	if (is_inventory_full(state.u_state)) {
		if (DEBUG) console.log(`    Inventory is full (${state.u_state.inventory.unslotted.length} items)`)
		let freed_count = 0

		// sell stuff, starting from the worst, but keeping the starting items (for sentimental reasons)
		const original_unslotted = state.u_state.inventory.unslotted
		Array.from(original_unslotted)
			.filter((e: Immutable<Item>) => {
				switch (e.slot) {
					case InventorySlot.armor:
						if (ArmorLib.matches(e as Armor, STARTING_ARMOR_SPEC))
							return false
						break
					case InventorySlot.weapon:
						if (WeaponLib.matches(e as Weapon, STARTING_WEAPON_SPEC))
							return false
						break
					default:
						break
				}
				return true
			})
			.sort(compare_items_by_normalized_power)
			.reverse() // to put the lowest quality items first
			.forEach((e: Immutable<Item>) => {
				//console.log(e.quality, e.slot, appraise_power_normalized(e))
				switch(e.slot) {
					case InventorySlot.armor:
						if (ArmorLib.matches(e as Armor, STARTING_ARMOR_SPEC))
							return
						break
					case InventorySlot.weapon:
						if (WeaponLib.matches(e as Weapon, STARTING_WEAPON_SPEC))
							return
						break
					default:
						break
				}

				if (e.quality === ItemQuality.common || freed_count === 0) {
					//console.log('    - selling:', e)
					state = _sell_item(state, e.uuid)
					freed_count++
					return
				}
			})

		if (freed_count === 0)
			throw new Error('Internal error: _auto_make_room(): inventory is full and couldn’t free stuff!')

		if (DEBUG) console.log(`    Freed ${freed_count} items, inventory now holding ${state.u_state.inventory.unslotted.length} items.`)
	}

	return state
}


function _enhance_an_armor(state: Immutable<State>): Immutable<State> {
	const slotted = InventoryState.get_item_in_slot(state.u_state.inventory, InventorySlot.armor) as Armor

	if (ArmorLib.is_at_max_enhancement(slotted)) {
		// TODO try to enhance another armor
		return state
	}

	return {
		...state,
		u_state: {
			...state.u_state,
			inventory: {
				...state.u_state.inventory,
				slotted: {
					...state.u_state.inventory.slotted,
					[InventorySlot.armor]: ArmorLib.enhance(slotted),
				}
			}
		},
	}
}
function _enhance_a_weapon(state: Immutable<State>): Immutable<State> {
	const slotted = InventoryState.get_item_in_slot(state.u_state.inventory, InventorySlot.weapon) as Weapon

	if (WeaponLib.is_at_max_enhancement(slotted)) {
		// TODO try to enhance another weapon
		return state
	}

	return {
		...state,
		u_state: {
			...state.u_state,
			inventory: {
				...state.u_state.inventory,
				slotted: {
					...state.u_state.inventory.slotted,
					[InventorySlot.weapon]: WeaponLib.enhance(slotted),
				}
			}
		},
	}
}


/////////////////////

export {
	_update_to_now,

	_lose_all_energy,

	_receive_stat_increase,
	_receive_item,
	_sell_item,
	_receive_coins,
	_lose_coins,
	_receive_tokens,

	_ack_all_engagements,
	_auto_make_room,

	_enhance_an_armor,
	_enhance_a_weapon,
}
