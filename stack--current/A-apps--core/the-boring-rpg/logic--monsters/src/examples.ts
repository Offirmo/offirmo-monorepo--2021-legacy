/////////////////////

import { Immutable, enforce_immutability } from '@offirmo-private/state-utils'
import { Random, Engine } from '@offirmo/random'

import {
	Monster,
	MonsterRank,
} from './types'
import { create } from './state'

/////////////////////

const DEMO_MONSTER_01: Immutable<Monster> = enforce_immutability<Monster>({
	name: 'chicken',
	level: 7,
	rank: MonsterRank.elite,
	possible_emoji: '🐓',
})

// for demo purpose, all attributes having the same probability + also random enhancement level
function generate_random_demo_monster(): Monster {
	const rng: Engine = Random.engines.mt19937().autoSeed()
	return create(rng)
}

/////////////////////

export {
	DEMO_MONSTER_01,
	generate_random_demo_monster,
}

/////////////////////
