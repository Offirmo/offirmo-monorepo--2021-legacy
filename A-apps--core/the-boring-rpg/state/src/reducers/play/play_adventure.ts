/////////////////////

import { Immutable} from '@offirmo-private/ts-types'
import { Enum } from 'typescript-string-enums'

import { generate_uuid } from '@offirmo-private/uuid'
import { Random, Engine } from '@offirmo/random'

import { InventorySlot } from '@tbrpg/definitions'

import {
	CharacterAttribute,
	CHARACTER_ATTRIBUTES,
	CharacterClass,
	State as CharacterState,
} from '@tbrpg/state--character'

import * as InventoryState from '@tbrpg/state--inventory'
import * as WalletState from '@oh-my-rpg/state-wallet'
import * as PRNGState from '@oh-my-rpg/state-prng'
import {
	get_prng,
	generate_random_seed,
	register_recently_used,
	regenerate_until_not_recently_encountered,
} from '@oh-my-rpg/state-prng'

import {
	Weapon,
	create as create_weapon,
	enhance as enhance_weapon,
	MAX_ENHANCEMENT_LEVEL as MAX_WEAPON_ENHANCEMENT_LEVEL,
	is_at_max_enhancement as is_weapon_at_max_enhancement,
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
	generate_random_coin_gain_or_loss,
} from '@oh-my-rpg/logic-adventures'

import {
	State,
	Adventure,
} from '../../types'

import { LIB } from '../../consts'

import {
	_receive_stat_increase,
	_receive_coins,
	_lose_coins,
	_receive_tokens,
	_receive_item,
	_enhance_an_armor,
	_enhance_a_weapon,
} from '../internal'

/////////////////////

type AttributesArray = CharacterAttribute[]

const ALL_ATTRIBUTES_X_LVL: AttributesArray = [ 'health', 'mana', 'strength', 'agility', 'charisma', 'wisdom', 'luck' ]

const WARRIOR_LIKE_PRIMARY_ATTRIBUTES: AttributesArray = ['strength']
const ROGUE_LIKE_PRIMARY_ATTRIBUTES: AttributesArray = ['agility']
const MAGE_LIKE_PRIMARY_ATTRIBUTES: AttributesArray = ['mana']
const HYBRID_PALADIN_LIKE_PRIMARY_ATTRIBUTES: AttributesArray = ['strength', 'mana']

const PRIMARY_STATS_BY_CLASS: { [k: string]: AttributesArray } = {
	[CharacterClass.novice]:                ALL_ATTRIBUTES_X_LVL,

	[CharacterClass.barbarian]:             WARRIOR_LIKE_PRIMARY_ATTRIBUTES,
	[CharacterClass.druid]:                 ['wisdom', 'mana'],
	[CharacterClass.warrior]:               WARRIOR_LIKE_PRIMARY_ATTRIBUTES,
	[CharacterClass.paladin]:               HYBRID_PALADIN_LIKE_PRIMARY_ATTRIBUTES,
	[CharacterClass.rogue]:                 ROGUE_LIKE_PRIMARY_ATTRIBUTES,
	[CharacterClass.sorcerer]:              MAGE_LIKE_PRIMARY_ATTRIBUTES,
	[CharacterClass.warlock]:               MAGE_LIKE_PRIMARY_ATTRIBUTES,
	[CharacterClass.wizard]:                MAGE_LIKE_PRIMARY_ATTRIBUTES,
	[CharacterClass['darkness hunter']]:    HYBRID_PALADIN_LIKE_PRIMARY_ATTRIBUTES,
	[CharacterClass.hunter]:                ['agility'],
	[CharacterClass.priest]:                ['charisma', 'mana'],
	[CharacterClass['death knight']]:       HYBRID_PALADIN_LIKE_PRIMARY_ATTRIBUTES,
	[CharacterClass.mage]:                  MAGE_LIKE_PRIMARY_ATTRIBUTES,
	[CharacterClass.engineer]:              ['wisdom'],
	[CharacterClass.thief]:                 ROGUE_LIKE_PRIMARY_ATTRIBUTES,
	[CharacterClass.assassin]:              ROGUE_LIKE_PRIMARY_ATTRIBUTES,
	[CharacterClass.illusionist]:           ['charisma', 'agility'],
	[CharacterClass.knight]:                WARRIOR_LIKE_PRIMARY_ATTRIBUTES,
	[CharacterClass.pirate]:                ['luck'],
	[CharacterClass.ninja]:                 ROGUE_LIKE_PRIMARY_ATTRIBUTES,
	[CharacterClass.corsair]:               ROGUE_LIKE_PRIMARY_ATTRIBUTES,
	[CharacterClass.necromancer]:           MAGE_LIKE_PRIMARY_ATTRIBUTES,
	[CharacterClass.sculptor]:              ['agility'],
	[CharacterClass.summoner]:              MAGE_LIKE_PRIMARY_ATTRIBUTES,
}
if (Object.keys(PRIMARY_STATS_BY_CLASS).length !== Enum.keys(CharacterClass).length)
	throw new Error(`${LIB}: PRIMARY_STATS_BY_CLASS is out of date!`)


const WARRIOR_LIKE_SECONDARY_ATTRIBUTES: AttributesArray = ['health']
const ROGUE_LIKE_SECONDARY_ATTRIBUTES: AttributesArray = ['luck']
const MAGE_LIKE_SECONDARY_ATTRIBUTES: AttributesArray = ['wisdom']
const HYBRID_PALADIN_LIKE_SECONDARY_ATTRIBUTES: AttributesArray = ['health']


const SECONDARY_STATS_BY_CLASS: { [k: string]: AttributesArray } = {
	[CharacterClass.novice]:                ALL_ATTRIBUTES_X_LVL,

	[CharacterClass.barbarian]:             WARRIOR_LIKE_SECONDARY_ATTRIBUTES,
	[CharacterClass.druid]:                 ['strength', 'agility'],
	[CharacterClass.warrior]:               WARRIOR_LIKE_SECONDARY_ATTRIBUTES,
	[CharacterClass.paladin]:               HYBRID_PALADIN_LIKE_SECONDARY_ATTRIBUTES,
	[CharacterClass.rogue]:                 ROGUE_LIKE_SECONDARY_ATTRIBUTES,
	[CharacterClass.sorcerer]:              MAGE_LIKE_SECONDARY_ATTRIBUTES,
	[CharacterClass.warlock]:               MAGE_LIKE_SECONDARY_ATTRIBUTES,
	[CharacterClass.wizard]:                MAGE_LIKE_SECONDARY_ATTRIBUTES,
	[CharacterClass['darkness hunter']]:    HYBRID_PALADIN_LIKE_SECONDARY_ATTRIBUTES,
	[CharacterClass.hunter]:                ['strength'],
	[CharacterClass.priest]:                ['wisdom'],
	[CharacterClass['death knight']]:       HYBRID_PALADIN_LIKE_SECONDARY_ATTRIBUTES,
	[CharacterClass.mage]:                  MAGE_LIKE_SECONDARY_ATTRIBUTES,
	[CharacterClass.engineer]:              ['agility', 'luck'],
	[CharacterClass.thief]:                 ROGUE_LIKE_SECONDARY_ATTRIBUTES,
	[CharacterClass.assassin]:              ROGUE_LIKE_SECONDARY_ATTRIBUTES,
	[CharacterClass.illusionist]:           ['luck'],
	[CharacterClass.knight]:                WARRIOR_LIKE_SECONDARY_ATTRIBUTES,
	[CharacterClass.pirate]:                ['charisma', 'agility'],
	[CharacterClass.ninja]:                 ROGUE_LIKE_SECONDARY_ATTRIBUTES,
	[CharacterClass.corsair]:               ['charisma', 'luck'],
	[CharacterClass.necromancer]:           MAGE_LIKE_SECONDARY_ATTRIBUTES,
	[CharacterClass.sculptor]:              ['wisdom', 'charisma'],
	[CharacterClass.summoner]:              MAGE_LIKE_SECONDARY_ATTRIBUTES,
}
if (Object.keys(SECONDARY_STATS_BY_CLASS).length !== Enum.keys(CharacterClass).length)
	throw new Error(`${LIB}: SECONDARY_STATS_BY_CLASS is out of date!`)


function instantiate_adventure_archetype(
	rng: Engine,
	aa: Immutable<AdventureArchetype>,
	character: Immutable<CharacterState>,
	inventory: Immutable<InventoryState.State>,
	wallet: Immutable<WalletState.State>,
): Adventure {
	const {hid, good, type, outcome} = aa
	const should_gain: OutcomeArchetype = {
		...outcome,
	}

	// instantiate the special gains
	if (should_gain.random_attribute) {
		const stat: keyof OutcomeArchetype = Random.pick(rng, ALL_ATTRIBUTES_X_LVL) as keyof OutcomeArchetype
		(should_gain as any)[stat] = true
	}
	if (should_gain.lowest_attribute) {
		const lowest_stat: keyof OutcomeArchetype = ALL_ATTRIBUTES_X_LVL.reduce((acc, val) => {
			return (character.attributes as any)[acc] < (character.attributes as any)[val] ? acc : val
		}, 'health') as keyof OutcomeArchetype
		(should_gain as any)[lowest_stat] = true
	}
	if (should_gain.class_primary_attribute) {
		const stat: keyof OutcomeArchetype = Random.pick(rng, PRIMARY_STATS_BY_CLASS[character.klass]) as keyof OutcomeArchetype
		(should_gain as any)[stat] = true
	}
	if (should_gain.class_secondary_attribute) {
		const stat: keyof OutcomeArchetype = Random.pick(rng, SECONDARY_STATS_BY_CLASS[character.klass]) as keyof OutcomeArchetype
		(should_gain as any)[stat] = true
	}

	if (should_gain.armor_or_weapon) {
		// TODO take into account the existing inventory?
		if (Random.bool()(rng))
			should_gain.armor = true
		else
			should_gain.weapon = true
	}
	if (should_gain.improvementⵧarmor_or_weapon) {
		if (is_weapon_at_max_enhancement(InventoryState.get_slotted_weapon(inventory)!)) // most likely to happen
			should_gain.improvementⵧarmor = true
		else if (Random.bool()(rng))
			should_gain.improvementⵧarmor = true
		else
			should_gain.improvementⵧweapon = true
	}

	// intermediate data
	const new_player_level = character.attributes.level + (should_gain.level ? 1 : 0)

	// TODO check multiple charac gain (should not happen)
	return {
		uuid: generate_uuid(),
		hid,
		good,
		encounter: type === AdventureType.fight ? create_monster(rng, {level: character.attributes.level}) : null,
		gains: {
			level:    should_gain.level    ? 1 : 0,
			health:   should_gain.health   ? 1 : 0,
			mana:     should_gain.mana     ? 1 : 0,
			strength: should_gain.strength ? 1 : 0,
			agility:  should_gain.agility  ? 1 : 0,
			charisma: should_gain.charisma ? 1 : 0,
			wisdom:   should_gain.wisdom   ? 1 : 0,
			luck:     should_gain.luck     ? 1 : 0,
			coin:     generate_random_coin_gain_or_loss(rng, {
					range: should_gain.coin,
					player_level: new_player_level,
					current_wallet_amount: wallet.coin_count,
				}),
			token:    should_gain.token    ? 1 : 0,
			armor:    should_gain.armor    ? create_armor(rng) : null,
			weapon:   should_gain.weapon   ? create_weapon(rng) : null,
			improvementⵧarmor:  should_gain.improvementⵧarmor,
			improvementⵧweapon: should_gain.improvementⵧweapon,
		},
	}
}

/////////////////////

function _play_adventure(state: Immutable<State>, aa: Immutable<AdventureArchetype>): Immutable<State> {
	const rng = get_prng(state.u_state.prng)

	const adventure = instantiate_adventure_archetype(
		rng,
		aa,
		state.u_state.avatar,
		state.u_state.inventory,
		state.u_state.wallet,
	)
	//console.log(adventure.hid, state.u_state.wallet)
	//console.log(adventure)

	const {gains: gained} = adventure

	let gain_count = 0
	let item_gain_count = 0

	if (gained.level) {
		gain_count++
		state = _receive_stat_increase(state, CharacterAttribute.level)
	}
	if (gained.health) {
		gain_count++
		state = _receive_stat_increase(state, CharacterAttribute.health, gained.health)
	}
	if (gained.mana) {
		gain_count++
		state = _receive_stat_increase(state, CharacterAttribute.mana, gained.mana)
	}
	if (gained.strength) {
		gain_count++
		state = _receive_stat_increase(state, CharacterAttribute.strength, gained.strength)
	}
	if (gained.agility) {
		gain_count++
		state = _receive_stat_increase(state, CharacterAttribute.agility, gained.agility)
	}
	if (gained.charisma) {
		gain_count++
		state = _receive_stat_increase(state, CharacterAttribute.charisma, gained.charisma)
	}
	if (gained.wisdom) {
		gain_count++
		state = _receive_stat_increase(state, CharacterAttribute.wisdom, gained.wisdom)
	}
	if (gained.luck) {
		gain_count++
		state = _receive_stat_increase(state, CharacterAttribute.luck, gained.luck)
	}

	if (gained.coin) {
		gain_count++
		if (gained.coin >= 0)
			state = _receive_coins(state, gained.coin)
		else
			state = _lose_coins(state, -gained.coin)
	}
	if (gained.token) {
		gain_count++
		state = _receive_tokens(state, gained.token)
	}

	if (gained.weapon) {
		gain_count++
		item_gain_count++
		//console.log('gained weapon')
		state = _receive_item(state, gained.weapon)
	}
	if (gained.armor) {
		gain_count++
		item_gain_count++
		//console.log('gained armor')
		state = _receive_item(state, gained.armor)
	}

	if (gained.improvementⵧweapon) {
		gain_count++
		state = _enhance_a_weapon(state)
	}

	if (gained.improvementⵧarmor) {
		gain_count++
		state = _enhance_an_armor(state)
	}

	if (aa.good && !gain_count) {
		//dump_prettified_any('Error NO gain!', {aa, adventure})
		throw new Error(`${LIB}: play_adventure() for "good click" hid "${aa.hid}" unexpectedly resulted in NO gains!`)
	}
	if (item_gain_count > 1) {
		//dump_prettified_any('Error 2x item gain!', {aa, adventure})
		throw new Error(`${LIB}: play_adventure() for hid "${aa.hid}" unexpectedly resulted in ${item_gain_count} item gains!`)
	}

	state = {
		...state,
		u_state: {
			...state.u_state,
			last_adventure: adventure,
			prng: PRNGState.update_use_count(state.u_state.prng, rng, {
				// we can't know because it depends on the adventure,
				// ex. generate a random weapon
				I_swear_I_really_cant_know_whether_the_rng_was_used: true,
			}),
		},
	}

	return state
}

/////////////////////

export {
	_play_adventure,
}

/////////////////////
