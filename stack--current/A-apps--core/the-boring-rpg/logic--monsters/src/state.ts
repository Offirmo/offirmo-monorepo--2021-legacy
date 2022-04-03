/////////////////////

import { Random, Engine } from '@offirmo/random'
import { MAX_LEVEL } from '@tbrpg/definitions'

import {
	Monster,
	MonsterRank,
} from './types'

import {
	ENTRIES,
} from './data'

/////////////////////

function pick_random_rank(rng: Engine): MonsterRank {
	// on 10 times, 1 boss, 2 elites, 7 common
	return Random.bool(0.7)(rng)
		? MonsterRank.common
		: Random.bool(2/3.)(rng)
			? MonsterRank.elite
			: MonsterRank.boss
}

/////////////////////

const MONSTER_RELATIVE_LEVEL_SPREAD = 0.1

function create(rng: Engine, hints: Readonly<Partial<Monster>> = {}): Monster {
	const raw = hints.name
		? ENTRIES.find(raw_monster => raw_monster.name === hints.name)
		: Random.pick(rng, ENTRIES)

	if (!raw)
		throw new Error(`OMR Monster create: can't find a monster corresponding to hint "${hints.name}"!`)

	let level = -1
	if (!hints.level)
		level = Random.integer(1, MAX_LEVEL)(rng)
	else {
		// stay close to the given level
		const reference_level = hints.level
		const variation = Math.round(Math.max(1, reference_level * MONSTER_RELATIVE_LEVEL_SPREAD))
		level = Math.max(1, Math.min(MAX_LEVEL,
			reference_level + Random.integer(-variation, variation)(rng),
		))
	}

	return {
		name: raw.name,
		level,
		rank: hints.rank || pick_random_rank(rng),
		possible_emoji: hints.possible_emoji || raw.emoji,
	}
}

/////////////////////

export {
	create,
}

/////////////////////
