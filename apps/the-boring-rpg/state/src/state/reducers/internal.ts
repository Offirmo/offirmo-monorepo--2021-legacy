/////////////////////

import { Random, Engine } from '@offirmo/random'
import { UUID } from '@offirmo-private/uuid'
import { TimestampUTCMs } from '@offirmo-private/timestamps'

/////////////////////

import { InventorySlot, Item, ItemQuality } from '@oh-my-rpg/definitions'

import { Weapon, matches as matches_weapon } from '@oh-my-rpg/logic-weapons'
import { Armor, matches as matches_armor } from '@oh-my-rpg/logic-armors'
import { appraise_power_normalized } from '@oh-my-rpg/logic-shop'
import {
	CharacterAttribute,
	CharacterAttributes,
	CharacterClass,
	increase_stat,
	rename,
	switch_class,
} from '@oh-my-rpg/state-character'
import { Currency } from '@oh-my-rpg/state-wallet'

import * as EnergyState from '@oh-my-rpg/state-energy'
import * as WalletState from '@oh-my-rpg/state-wallet'
import * as InventoryState from '@oh-my-rpg/state-inventory'
import * as EngagementState from '@oh-my-rpg/state-engagement'

/////////////////////

import { State } from '../../types'

import {
	appraise_item_value,
	is_inventory_full,
} from '../../selectors'

import { get_lib_SEC } from '../../sec'

import {STARTING_ARMOR_SPEC, STARTING_WEAPON_SPEC} from "./create";

/////////////////////

function compare_items_by_normalized_power(a: Readonly<Item>, b: Readonly<Item>): number {
	const power_a = appraise_power_normalized(a)
	const power_b = appraise_power_normalized(b)

	return power_b - power_a
}

/////////////////////

// XXX those internal reducers:
// - do not refresh achievements or update the T-state
// - do not increment the root revision (but this has to be done by the parent)

function _loose_all_energy(state: Readonly<State>): Readonly<State> {
	return {
		...state,
		t_state: {
			...state.t_state,
			energy: EnergyState.loose_all_energy([state.u_state.energy, state.t_state.energy])
		}
	}
}

function _update_to_now(state: Readonly<State>, now_ms: TimestampUTCMs): Readonly<State> {
	let { u_state, t_state } = state

	const t_state_e = EnergyState.update_to_now([u_state.energy, t_state.energy], now_ms)

	if (t_state_e === t_state.energy)
		return state // no change

	return {
		...state,
		t_state: {
			...t_state,
			timestamp_ms: t_state_e.timestamp_ms,
			energy: t_state_e,
		}
	}
}

function _receive_stat_increase(state: Readonly<State>, stat: CharacterAttribute, amount = 1): Readonly<State> {
	let { u_state } = state

	return {
		...state,
		u_state: {
			...u_state,
			avatar: increase_stat(get_lib_SEC(), u_state.avatar, stat, amount),
		}
	}
}

function _receive_item(state: Readonly<State>, item: Item): Readonly<State> {
	// inventory shouldn't be full since we prevent playing in this case
	let { u_state } = state

	return {
		...state,
		u_state: {
			...u_state,
			inventory: InventoryState.add_item(u_state.inventory, item),
		}
	}
}

function _sell_item(state: Readonly<State>, uuid: UUID): Readonly<State> {
	let { u_state } = state

	const price = appraise_item_value(u_state, uuid)

	return {
		...state,
		u_state: {
			...u_state,
			inventory: InventoryState.remove_item_from_unslotted(u_state.inventory, uuid),
			wallet: WalletState.add_amount(u_state.wallet, Currency.coin, price),
		}
	}
}

function _receive_coins(state: Readonly<State>, amount: number): Readonly<State> {
	let { u_state } = state

	return {
		...state,
		u_state: {
			...u_state,
			wallet: WalletState.add_amount(u_state.wallet, Currency.coin, amount),
		}
	}
}

function _receive_tokens(state: Readonly<State>, amount: number): Readonly<State> {
	let { u_state } = state

	return {
		...state,
		u_state: {
			...u_state,
			wallet: WalletState.add_amount(u_state.wallet, Currency.token, amount),
		}
	}
}

////////////

function _ack_all_engagements(state: Readonly<State>): Readonly<State> {
	let { u_state } = state

	if (!u_state.engagement.queue.length) return state

	return {
		...state,
		u_state: {
			...u_state,
			engagement: EngagementState.acknowledge_all_seen(u_state.engagement),
		}
	}
}

function _auto_make_room(state: Readonly<State>, options: { DEBUG?: boolean } = {}): Readonly<State> {
	const { DEBUG } = options

	if (DEBUG) console.log(`  - _auto_make_room()… (inventory holding ${state.u_state.inventory.unslotted.length} items)`)

	// inventory full
	if (is_inventory_full(state.u_state)) {
		if (DEBUG) console.log(`    Inventory is full (${state.u_state.inventory.unslotted.length} items)`)
		let freed_count = 0

		// sell stuff, starting from the worst, but keeping the starting items (for sentimental reasons)
		const original_unslotted = state.u_state.inventory.unslotted
		Array.from(original_unslotted)
			.filter((e: Readonly<Item>) => {
				switch (e.slot) {
					case InventorySlot.armor:
						if (matches_armor(e as Armor, STARTING_ARMOR_SPEC))
							return false
						break
					case InventorySlot.weapon:
						if (matches_weapon(e as Weapon, STARTING_WEAPON_SPEC))
							return false
						break
					default:
						break
				}
				return true
			})
			.sort(compare_items_by_normalized_power)
			.reverse() // to put the lowest quality items first
			.forEach((e: Readonly<Item>) => {
				//console.log(e.quality, e.slot, appraise_power_normalized(e))
				switch(e.slot) {
					case InventorySlot.armor:
						if (matches_armor(e as Armor, STARTING_ARMOR_SPEC))
							return
						break
					case InventorySlot.weapon:
						if (matches_weapon(e as Weapon, STARTING_WEAPON_SPEC))
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

/////////////////////

export {
	_update_to_now,

	_loose_all_energy,

	_receive_stat_increase,
	_receive_item,
	_sell_item,
	_receive_coins,
	_receive_tokens,

	_ack_all_engagements,
	_auto_make_room,
}
