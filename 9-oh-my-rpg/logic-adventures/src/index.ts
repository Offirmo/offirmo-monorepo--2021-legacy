/////////////////////

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
			armor_improvement : !!raw_outcome.armor_improvement,
			weapon_improvement: !!raw_outcome.weapon_improvement,
			armor_or_weapon_improvement: !!raw_outcome.armor_or_weapon_improvement,
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
	none:   [  0,    0],
	loss:   [-10,   -1],
	small:  [  1,   20],
	medium: [ 50,  100],
	big:    [500,  700],
	huge:   [900, 2000],
}

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
	if (range === CoinsGain.none)
		return 0

	let interval = COINS_GAIN_RANGES[range]

	if (range !== CoinsGain.loss) {
		const level_multiplier = player_level * COINS_GAIN_MULTIPLIER_PER_LEVEL
		interval = [ interval[0] * level_multiplier, interval[1] * level_multiplier ]
	}

	let amount = Random.integer(interval[0], interval[1])(rng)

	if (range === CoinsGain.loss) {
		amount = -Math.min(-amount, current_wallet_amount)
	}

	return amount
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
