/////////////////////

import * as nanoid from 'nanoid'
import * as format from 'nanoid/format'
import * as url from 'nanoid/url'

import { Random, Engine } from '@offirmo/random'

import { UUID } from './types'

///////

const UUID_RADIX = 'uu1'

const NANOID_LENGTH_FOR_1BTH_COLLISION_CHANCES = 21 // according to the doc

const UUID_LENGTH = UUID_RADIX.length + NANOID_LENGTH_FOR_1BTH_COLLISION_CHANCES

function generate_uuid({length = NANOID_LENGTH_FOR_1BTH_COLLISION_CHANCES, rng}: {length?: number, rng?: Engine} = {}): UUID {
	return UUID_RADIX + (
		rng
		? format((size: number) => {
			let result = []
			const gen = Random.integer(0, 255)
			for (let i = 0; i < size; i++) result.push(gen(rng!))
			return result
		}, url, length)
		: nanoid(length)
	)
}

/////////////////////

export {
	UUID_LENGTH,
	generate_uuid,
}

/////////////////////
