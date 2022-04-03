/////////////////////

import { nanoid, customRandom, urlAlphabet } from 'nanoid'

import { Random, Engine } from '@offirmo/random'

import { UUID } from './types'

///////

const UUID_RADIX = 'uu1'

const NANOID_LENGTH_FOR_1BTH_COLLISION_CHANCES = 21 // according to the doc

const UUID_LENGTH = UUID_RADIX.length + NANOID_LENGTH_FOR_1BTH_COLLISION_CHANCES

function generate_uuid({length = NANOID_LENGTH_FOR_1BTH_COLLISION_CHANCES, rng}: Readonly<{length?: number, rng?: Engine}> = {}): UUID {
	return UUID_RADIX + (
		rng
			? customRandom(urlAlphabet, length, (size: number): Uint8Array => {
				//const result: number[] = []
				const gen = Random.integer(0, 255)
				//for (let i = 0; i < size; i++) result.push(gen(rng!))
				return (new Uint8Array(size)).map(() => gen(rng!))
			})()
			: nanoid(length)
	)
}

/////////////////////

export {
	UUID_LENGTH,
	generate_uuid,
}

/////////////////////
