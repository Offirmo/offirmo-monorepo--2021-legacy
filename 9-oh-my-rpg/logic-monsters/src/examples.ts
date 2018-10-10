/////////////////////

import { Random, Engine } from '@offirmo/random'
import { create } from './state'

import {
	Monster,
	MonsterRank,
} from './types'

/////////////////////

const DEMO_MONSTER_01: Readonly<Monster> = {
	name: 'chicken',
	level: 7,
	rank: MonsterRank.elite,
	possible_emoji: '🐓',
}

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
