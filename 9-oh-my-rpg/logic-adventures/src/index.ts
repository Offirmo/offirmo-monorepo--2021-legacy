/////////////////////

import assert from 'tiny-invariant'
import { Random, Engine } from '@offirmo/random'

import {
	CoinsGain,
	AdventureType,
	OutcomeArchetype,
	AdventureArchetype,
} from './types'

import { i18n_messages, ENTRIES } from './data'

/////////////////////

const ALL_ADVENTURE_ARCHETYPES: Readonly<AdventureArchetype>[] = ENTRIES
	.map(paa => {
		const raw_outcome: Partial<OutcomeArchetype> = paa.outcome || {}

		const outcome: OutcomeArchetype = {
			level   : !!raw_outcome.level,

			agility : !!raw_outcome.agility,
			health  : !!raw_outcome.health,
			luck    : !!raw_outcome.luck,
			mana    : !!raw_outcome.mana,
			strength: !!raw_outcome.strength,
			charisma: !!raw_outcome.charisma,
			wisdom  : !!raw_outcome.wisdom,
			random_attribute         : !!raw_outcome.random_attribute,
			lowest_attribute         : !!raw_outcome.lowest_attribute,
			class_primary_attribute     : !!raw_outcome.class_primary_attribute,
			class_secondary_attribute: !!raw_outcome.class_secondary_attribute,

			coin    :   (raw_outcome.coin as CoinsGain) || CoinsGain.none,
			token   :   raw_outcome.token || 0,
			armor   : !!raw_outcome.armor,
			weapon  : !!raw_outcome.weapon,
			armor_or_weapon   : !!raw_outcome.armor_or_weapon,
			item_spec: null,
			improvementⵧarmor : !!raw_outcome.improvementⵧarmor,
			improvementⵧweapon: !!raw_outcome.improvementⵧweapon,
			improvementⵧarmor_or_weapon: !!raw_outcome.improvementⵧarmor_or_weapon,
		}

		const aa: AdventureArchetype = {
			hid: paa.hid!,
			good: paa.good,
			type: paa.type,
			outcome,
		}
		return aa
	})

const ALL_BAD_ADVENTURE_ARCHETYPES: Readonly<AdventureArchetype>[] = ALL_ADVENTURE_ARCHETYPES.filter(aa => !aa.good)
const ALL_GOOD_ADVENTURE_ARCHETYPES: Readonly<AdventureArchetype>[] = ALL_ADVENTURE_ARCHETYPES.filter(aa => aa.good)

const GOOD_ADVENTURE_ARCHETYPES_BY_TYPE: Readonly<{ [k: string]: Readonly<AdventureArchetype>[] }> = {
	story: ALL_GOOD_ADVENTURE_ARCHETYPES.filter(aa => aa.type === AdventureType.story),
	fight: ALL_GOOD_ADVENTURE_ARCHETYPES.filter(aa => aa.type === AdventureType.fight),
}

const COINS_GAIN_MULTIPLIER_PER_LEVEL = 1.1

const COINS_GAIN_RANGES: Readonly<{ [k: string]: [number, number] }> = {
	lossꘌsmall:  [-10,   -1],
	none:        [  0,    0],
	gainꘌsmall:  [  1,   20],
	gainꘌmedium: [ 50,  100],
	gainꘌbig:    [500,  700],
	gainꘌhuge:   [900, 2000],
}
// TODO UT data

/////////////////////

// useful for picking an exact archetype (ex. tests)
function get_archetype(hid: string): Readonly<AdventureArchetype> {
	const aa = ALL_ADVENTURE_ARCHETYPES.find(aa => aa.hid === hid)
	if (!aa)
		throw new Error(`logic-adventures, get_archetype(): couldn't find archetype "${hid}" !`)
	return aa!
}

const FIGHT_ENCOUNTER_RATIO = 0.33

function pick_random_good_archetype(rng: Engine): Readonly<AdventureArchetype> {
	return Random.bool(FIGHT_ENCOUNTER_RATIO)(rng)
		? Random.pick(rng, GOOD_ADVENTURE_ARCHETYPES_BY_TYPE.fight)
		: Random.pick(rng, GOOD_ADVENTURE_ARCHETYPES_BY_TYPE.story)
}

function pick_random_bad_archetype(rng: Engine): Readonly<AdventureArchetype> {
	return Random.pick(rng, ALL_BAD_ADVENTURE_ARCHETYPES)
}

function generate_random_coin_gain_or_loss(rng: Engine, {
	range,
	player_level,
	current_wallet_amount,
}: {
	range: CoinsGain,
	player_level: number,
	current_wallet_amount: number,
}): number {

	switch(range) {
		case CoinsGain.lossꘌsmall: {
			assert(current_wallet_amount > 0, 'wallet should not be empty for loss to be allowed!')
			let interval = COINS_GAIN_RANGES[range]
			assert(interval, `known range "${range}"`)
			const amount = Random.integer(interval[0], interval[1])(rng)
			const capped_amount = Math.max(
				amount,
				-current_wallet_amount
			)
			return capped_amount
		}
		case CoinsGain.lossꘌone:
			return -1

		case CoinsGain.none:
			return 0

		case CoinsGain.gainꘌone:
			return 1

		default: {
			const level_multiplier = player_level * COINS_GAIN_MULTIPLIER_PER_LEVEL
			let interval = COINS_GAIN_RANGES[range]
			assert(interval, `known range "${range}"`)
			interval = [ interval[0] * level_multiplier, interval[1] * level_multiplier ]
			return Random.integer(interval[0], interval[1])(rng)
		}
	}
}

/////////////////////

export {
	i18n_messages,

	ALL_ADVENTURE_ARCHETYPES,
	ALL_BAD_ADVENTURE_ARCHETYPES,
	ALL_GOOD_ADVENTURE_ARCHETYPES,
	GOOD_ADVENTURE_ARCHETYPES_BY_TYPE,

	CoinsGain,
	AdventureType,
	OutcomeArchetype,
	AdventureArchetype,

	pick_random_good_archetype,
	pick_random_bad_archetype,
	generate_random_coin_gain_or_loss,
	get_archetype,
}

/////////////////////
