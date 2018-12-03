/////////////////////

import { Enum } from 'typescript-string-enums'
import invariant from 'tiny-invariant'
import { Random, Engine } from '@offirmo/random'
import { get_human_readable_UTC_timestamp_days } from '@offirmo/timestamps'

/////////////////////

import { ItemQuality, Item, InventorySlot } from '@oh-my-rpg/definitions'

import * as CharacterState from '@oh-my-rpg/state-character'
import * as EngagementState from '@oh-my-rpg/state-engagement'
import * as EnergyState from '@oh-my-rpg/state-energy'

import {
	CharacterAttribute,
	CharacterAttributes,
	CharacterClass,
	increase_stat,
	rename,
	switch_class,
} from '@oh-my-rpg/state-character'

import { Currency } from '@oh-my-rpg/state-wallet'

import {
	get_prng,
	generate_random_seed,
} from '@oh-my-rpg/state-prng'

import { Weapon, matches as matches_weapon } from '@oh-my-rpg/logic-weapons'
import { Armor, matches as matches_armor } from '@oh-my-rpg/logic-armors'

/////////////////////

import { State } from '../../types'

import {
	get_energy_snapshot,
	is_inventory_full,
	find_better_unequipped_armor,
	find_better_unequipped_weapon,
} from '../../selectors'

import {
	rename_avatar,
	change_avatar_class,
	equip_item,
	sell_item,
} from './base'

import {
	play,
} from './play'

import {
	STARTING_WEAPON_SPEC,
	STARTING_ARMOR_SPEC,
} from './create'

/////////////////////

function _ack_all_engagements(state: Readonly<State>): Readonly<State> {
	if (!state.engagement.queue.length) return state

	return {
		...state,

		engagement: EngagementState.acknowledge_all_seen(state.engagement),

		revision: state.revision + 1,
	}
}

function _auto_make_room(state: Readonly<State>, options: { DEBUG?: boolean } = {}): Readonly<State> {
	const { DEBUG } = options

	if (DEBUG) console.log(`  - _auto_make_room()… (inventory holding ${state.inventory.unslotted.length} items)`)

	// inventory full
	if (is_inventory_full(state)) {
		if (DEBUG) console.log(`    Inventory is full (${state.inventory.unslotted.length} items)`)
		let freed_count = 0

		// sell stuff, starting from the worst, but keeping the starting items (for sentimental reasons)
		Array.from(state.inventory.unslotted)
			.filter(e => !!e) // TODO useful?
			.reverse() // to put the lowest quality items first
			.forEach((e: Readonly<Item>) => {
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
					state = sell_item(state, e.uuid)
					freed_count++
					return
				}
			})

		if (freed_count === 0)
			throw new Error('Internal error: _auto_make_room(): inventory is full and couldn’t free stuff!')

		if (DEBUG) console.log(`    Freed ${freed_count} items, inventory now holding ${state.inventory.unslotted.length} items.`)
	}

	return state
}

function _autogroom(state: Readonly<State>, options: { DEBUG?: boolean } = {}): Readonly<State> {
	const { DEBUG } = options

	if (DEBUG) console.log(`  - Autogroom… (inventory holding ${state.inventory.unslotted.length} items)`)

	// User
	// User class
	if (state.avatar.klass === CharacterClass.novice) {
		// change class
		let new_class: CharacterClass = Random.pick(Random.engines.nativeMath, Enum.values(CharacterClass))
		if (DEBUG) console.log(`    - Changing class to ${new_class}…`)
		state = change_avatar_class(state, new_class)
	}
	// User name
	if (state.avatar.name === CharacterState.DEFAULT_AVATAR_NAME) {
		let new_name = 'A' + state.uuid.slice(3)
		if (DEBUG) console.log(`    - renaming to ${new_name}…`)
		state = rename_avatar(state, new_name)
	}

	// inventory
	// equip best gear
	const better_weapon = find_better_unequipped_weapon(state)
	if (better_weapon) {
		state = equip_item(state, better_weapon.uuid)
	}
	const better_armor = find_better_unequipped_armor(state)
	if (better_armor) {
		state = equip_item(state, better_armor.uuid)
	}

	// inventory full
	state = _auto_make_room(state, options)

	// misc: ack the possible notifications
	state = _ack_all_engagements(state)

	return state
}

/* Autoplay,
 * as efficiently as possible,
 * trying to restore as much achievements as possible
 */
function autoplay(state: Readonly<State>, options: Readonly<{ target_good_play_count?: number, target_bad_play_count?: number, DEBUG?: boolean }> = {}): Readonly<State> {
	let { target_good_play_count, target_bad_play_count, DEBUG } = options

	if (DEBUG) console.log(`- Autoplay...`)

	target_good_play_count = target_good_play_count || 0
	target_bad_play_count = target_bad_play_count || 0
	if (target_good_play_count < 0)
		throw new Error('invalid target_good_play_count!')
	if (target_bad_play_count < 0)
		throw new Error('invalid target_bad_play_count!')
	if (target_good_play_count === 0 && target_bad_play_count === 0)
		target_good_play_count = state.progress.statistics.good_play_count + 1

	let last_visited_timestamp_num = (() => {
		const days_needed = Math.ceil((target_good_play_count - state.progress.statistics.good_play_count) / 8)
		const from_now = Number(get_human_readable_UTC_timestamp_days()) - days_needed
		return Math.min(from_now, Number(state.progress.statistics.last_visited_timestamp))
	})()
	if (last_visited_timestamp_num !== Number(state.progress.statistics.last_visited_timestamp)) {
		state = {
			...state,
			progress: {
				...state.progress,
				statistics: {
					...state.progress.statistics,
					last_visited_timestamp: String(last_visited_timestamp_num)
				}
			}
		}
	}
	state = _autogroom(state, options)

	// do we have energy?
	let energy_snapshot = EnergyState.get_snapshot(state.energy)
	let have_energy = energy_snapshot.available_energy >= 1

	if (target_bad_play_count > state.progress.statistics.bad_play_count) {
		if (have_energy) {
			// deplete it
			state = {
				...state,
				energy: EnergyState.loose_all_energy(state.energy),
			}
		}

		// play bad
		for (let i = state.progress.statistics.bad_play_count; i < target_bad_play_count; ++i) {
			if (DEBUG) console.log('  - playing bad...')
			state = play(state)
			state = _autogroom(state, options)
		}
	}

	if (target_good_play_count > state.progress.statistics.good_play_count) {
		// play good
		for (let i = state.progress.statistics.good_play_count; i < target_good_play_count; ++i) {
			energy_snapshot = EnergyState.get_snapshot(state.energy)
			have_energy = energy_snapshot.available_energy >= 1

			if (!have_energy) {
				// replenish and pretend one day has passed
				last_visited_timestamp_num++
				state = {
					...state,
					energy: EnergyState.restore_energy(state.energy),
					progress: {
						...state.progress,
						statistics: {
							...state.progress.statistics,
							last_visited_timestamp: String(last_visited_timestamp_num)
						}
					}
				}
			}

			if (DEBUG) console.log('  - playing good...')
			state = play(state)
			state = _autogroom(state, options)
		}
	}

	// misc: ack the possible notifications
	state = _ack_all_engagements(state)

	return state
}

/////////////////////

export {
	_auto_make_room,
	_autogroom,
	autoplay,
}
