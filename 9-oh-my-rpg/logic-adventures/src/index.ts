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

const ALL_ADVENTURE_ARCHETYPES: AdventureArchetype[] = ENTRIES
	.filter(paa => (paa.isPublished !== false))
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
			random_charac         : !!raw_outcome.random_charac,
			lowest_charac         : !!raw_outcome.lowest_charac,
			class_main_charac     : !!raw_outcome.class_main_charac,
			class_secondary_charac: !!raw_outcome.class_secondary_charac,

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

const ALL_BAD_ADVENTURE_ARCHETYPES: AdventureArchetype[] = ALL_ADVENTURE_ARCHETYPES.filter(aa => !aa.good)
const ALL_GOOD_ADVENTURE_ARCHETYPES: AdventureArchetype[] = ALL_ADVENTURE_ARCHETYPES.filter(aa => aa.good)

const GOOD_ADVENTURE_ARCHETYPES_BY_TYPE: { [k: string]: AdventureArchetype[] } = {
	story: ALL_GOOD_ADVENTURE_ARCHETYPES.filter(aa => aa.type === AdventureType.story),
	fight: ALL_GOOD_ADVENTURE_ARCHETYPES.filter(aa => aa.type === AdventureType.fight),
}

const COINS_GAIN_MULTIPLIER_PER_LEVEL = 1.1

const COINS_GAIN_RANGES: { [k: string]: [number, number] } = {
	none:   [  0,    0],
	small:  [  1,   20],
	medium: [ 50,  100],
	big:    [500,  700],
	huge:   [900, 2000],
}

;(function checkDataSanity() {
	if (ALL_ADVENTURE_ARCHETYPES.length < 20) {
		console.error(ALL_ADVENTURE_ARCHETYPES)
		throw new Error(`Data sanity failure: ALL_ADVENTURE_ARCHETYPES`)
	}
	if (ALL_BAD_ADVENTURE_ARCHETYPES.length !== 1)
		throw new Error(`Data sanity failure: ALL_BAD_ADVENTURE_ARCHETYPES`)
	if (ALL_GOOD_ADVENTURE_ARCHETYPES.length < 20)
		throw new Error(`Data sanity failure: ALL_GOOD_ADVENTURE_ARCHETYPES`)
	if (GOOD_ADVENTURE_ARCHETYPES_BY_TYPE.fight.length !== 5) {
		console.error(GOOD_ADVENTURE_ARCHETYPES_BY_TYPE.fight)
		throw new Error(`Data sanity failure: GOOD_ADVENTURE_ARCHETYPES_BY_TYPE.fight`)
	}
	if (GOOD_ADVENTURE_ARCHETYPES_BY_TYPE.story.length < 20)
		throw new Error(`Data sanity failure: GOOD_ADVENTURE_ARCHETYPES_BY_TYPE.story`)
})()

/////////////////////

// useful for picking an exact archetype (ex. tests)
function get_archetype(hid: string): AdventureArchetype {
	const aa = ALL_ADVENTURE_ARCHETYPES.find(aa => aa.hid === hid)
	if (!aa)
		throw new Error(`logic-adventures, get_archetype(): couldn't find archetype "${hid}" !`)
	return aa!
}

const FIGHT_ENCOUNTER_RATIO = 0.33

function pick_random_good_archetype(rng: Engine): AdventureArchetype {
	return Random.bool(FIGHT_ENCOUNTER_RATIO)(rng)
		? Random.pick(rng, GOOD_ADVENTURE_ARCHETYPES_BY_TYPE.fight)
		: Random.pick(rng, GOOD_ADVENTURE_ARCHETYPES_BY_TYPE.story)
}

function pick_random_bad_archetype(rng: Engine): AdventureArchetype {
	return Random.pick(rng, ALL_BAD_ADVENTURE_ARCHETYPES)
}

function generate_random_coin_gain(rng: Engine, range: CoinsGain, player_level: number): number {
	if (range === CoinsGain.none)
		return 0

	const level_multiplier = player_level * COINS_GAIN_MULTIPLIER_PER_LEVEL
	const interval = COINS_GAIN_RANGES[range]

	return Random.integer(interval[0] * level_multiplier, interval[1] * level_multiplier)(rng)
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
	generate_random_coin_gain,
	get_archetype,
}

/////////////////////
