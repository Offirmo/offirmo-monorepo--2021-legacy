/////////////////////

import { Random, Engine } from '@offirmo/random'

/////////////////////

import {
	InventorySlot,
	Item,
	generate_uuid,
} from '@oh-my-rpg/definitions'

import {
	CharacterAttribute,
	CharacterAttributes,
	CharacterClass,
	increase_stat,
	rename,
	switch_class,
} from '@oh-my-rpg/state-character'

import * as WalletState from '@oh-my-rpg/state-wallet'
import { Currency } from '@oh-my-rpg/state-wallet'

import * as InventoryState from '@oh-my-rpg/state-inventory'

import * as PRNGState from '@oh-my-rpg/state-prng'
import {
	get_prng,
	generate_random_seed,
} from '@oh-my-rpg/state-prng'

import {
	Weapon,
	create as create_weapon,
	enhance as enhance_weapon,
	MAX_ENHANCEMENT_LEVEL as MAX_WEAPON_ENHANCEMENT_LEVEL,
	DEMO_WEAPON_1,
} from '@oh-my-rpg/logic-weapons'

import {
	Armor,
	create as create_armor,
	enhance as enhance_armor,
	MAX_ENHANCEMENT_LEVEL as MAX_ARMOR_ENHANCEMENT_LEVEL,
} from '@oh-my-rpg/logic-armors'

import {
	create as create_monster,
	DEMO_MONSTER_01,
} from '@oh-my-rpg/logic-monsters'

import {
	CoinsGain,
	OutcomeArchetype,
	AdventureType,
	AdventureArchetype,

	get_archetype,
	pick_random_good_archetype,
	pick_random_bad_archetype,
	generate_random_coin_gain,
} from '@oh-my-rpg/logic-adventures'

import {
	State,
	Adventure,
} from './types'

import { get_SEC } from './sec'

/////////////////////

const STATS = [ 'health', 'mana', 'strength', 'agility', 'charisma', 'wisdom', 'luck' ]
function instantiate_adventure_archetype(rng: Engine, aa: AdventureArchetype, character: CharacterAttributes, inventory: InventoryState.State): Adventure {
	let {hid, good, type, outcome : should_gain} = aa

	should_gain = {...should_gain}

	// instantiate the special gains
	if (should_gain.random_charac) {
		const stat: keyof OutcomeArchetype = Random.pick(rng, STATS) as keyof OutcomeArchetype
		should_gain[stat] = true
	}
	if (should_gain.lowest_charac) {
		const lowest_stat: keyof OutcomeArchetype = STATS.reduce((acc, val) => {
			return (character as any)[acc] < (character as any)[val] ? acc : val
		}, 'health') as keyof OutcomeArchetype
		should_gain[lowest_stat] = true
	}

	if (should_gain.armor_or_weapon) {
		// TODO take into account the existing inventory
		if (Random.bool()(rng))
			should_gain.armor = true
		else
			should_gain.weapon = true
	}
	if (should_gain.armor_or_weapon_improvement) {
		if (Random.bool()(rng))
			should_gain.armor_improvement = true
		else
			should_gain.weapon_improvement = true
	}

	// intermediate data
	const new_player_level = character.level + (should_gain.level ? 1 : 0)

	// TODO check multiple charac gain (should not happen)
	return {
		uuid: generate_uuid(),
		hid,
		good,
		encounter: type === AdventureType.fight ? create_monster(rng, {level: character.level}) : undefined,
		gains: {
			level:    should_gain.level    ? 1 : 0,
			health:   should_gain.health   ? 1 : 0,
			mana:     should_gain.mana     ? 1 : 0,
			strength: should_gain.strength ? 1 : 0,
			agility:  should_gain.agility  ? 1 : 0,
			charisma: should_gain.charisma ? 1 : 0,
			wisdom:   should_gain.wisdom   ? 1 : 0,
			luck:     should_gain.luck     ? 1 : 0,
			coin:     generate_random_coin_gain(rng, should_gain.coin, new_player_level),
			token:    should_gain.token    ? 1 : 0,
			armor:    should_gain.armor    ? create_armor(rng) : null,
			weapon:   should_gain.weapon   ? create_weapon(rng) : null,
			armor_improvement:  should_gain.armor_improvement,
			weapon_improvement: should_gain.weapon_improvement,
		}
	}
}

function receive_stat_increase(state: State, stat: CharacterAttribute, amount = 1): State {
	state.avatar = increase_stat(get_SEC(), state.avatar, stat, amount)
	return state
}

function receive_item(state: State, item: Item): State {
	// TODO handle inventory full
	state.inventory = InventoryState.add_item(state.inventory, item)
	return state
}

function receive_coins(state: State, amount: number): State {
	state.wallet = WalletState.add_amount(state.wallet, Currency.coin, amount)
	return state
}

function receive_tokens(state: State, amount: number): State {
	state.wallet = WalletState.add_amount(state.wallet, Currency.token, amount)
	return state
}

/////////////////////

function play_good(state: State, explicit_adventure_archetype_hid?: string): State {
	state.good_click_count++
	state.meaningful_interaction_count++;

	let rng = get_prng(state.prng)

	const aa: AdventureArchetype = explicit_adventure_archetype_hid
		? get_archetype(explicit_adventure_archetype_hid)
		: pick_random_good_archetype(rng)

	if (!aa)
		throw new Error(`play_good(): hinted adventure archetype "${explicit_adventure_archetype_hid}" could not be found!`)

	const adventure = instantiate_adventure_archetype(
		rng,
		aa,
		state.avatar.attributes,
		state.inventory,
	)
	state.last_adventure = adventure

	const {gains : gained} = adventure

	// TODO store hid for no repetition

	let gain_count = 0
	if (gained.level) {
		gain_count++
		state = receive_stat_increase(state, CharacterAttribute.level)
	}
	if (gained.health) {
		gain_count++
		state = receive_stat_increase(state, CharacterAttribute.health, gained.health)
	}
	if (gained.mana) {
		gain_count++
		state = receive_stat_increase(state, CharacterAttribute.mana, gained.mana)
	}
	if (gained.strength) {
		gain_count++
		state = receive_stat_increase(state, CharacterAttribute.strength, gained.strength)
	}
	if (gained.agility) {
		gain_count++
		state = receive_stat_increase(state, CharacterAttribute.agility, gained.agility)
	}
	if (gained.charisma) {
		gain_count++
		state = receive_stat_increase(state, CharacterAttribute.charisma, gained.charisma)
	}
	if (gained.wisdom) {
		gain_count++
		state = receive_stat_increase(state, CharacterAttribute.wisdom, gained.wisdom)
	}
	if (gained.luck) {
		gain_count++
		state = receive_stat_increase(state, CharacterAttribute.luck, gained.luck)
	}

	if (gained.coin) {
		gain_count++
		state = receive_coins(state, gained.coin)
	}
	if (gained.token) {
		gain_count++
		state = receive_tokens(state, gained.token)
	}

	if (gained.weapon) {
		gain_count++
		state = receive_item(state, gained.weapon)
	}
	if (gained.armor) {
		gain_count++
		state = receive_item(state, gained.armor)
	}

	if (gained.weapon_improvement) {
		gain_count++
		let weapon_to_enhance = InventoryState.get_item_in_slot(state.inventory, InventorySlot.weapon) as Weapon
		if (weapon_to_enhance && weapon_to_enhance.enhancement_level < MAX_WEAPON_ENHANCEMENT_LEVEL)
			enhance_weapon(weapon_to_enhance)
		// TODO enhance another weapon as fallback
	}

	if (gained.armor_improvement) {
		gain_count++
		const armor_to_enhance = InventoryState.get_item_in_slot(state.inventory, InventorySlot.armor) as Armor
		if (armor_to_enhance && armor_to_enhance.enhancement_level < MAX_ARMOR_ENHANCEMENT_LEVEL)
			enhance_armor(armor_to_enhance)
		// TODO enhance another armor as fallback
	}

	if (!gain_count)
		throw new Error(`play_good() for hid "${aa.hid}" unexpectedly resulted in NO gains!`)
	state.prng = PRNGState.update_use_count(state.prng, rng, {
		I_swear_I_really_cant_know_whether_the_rng_was_used: !!explicit_adventure_archetype_hid
	})

	return state
}

/////////////////////

export {
	play_good,
	receive_item,
}

/////////////////////
