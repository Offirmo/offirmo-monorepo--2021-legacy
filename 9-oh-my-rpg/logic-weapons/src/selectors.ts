/////////////////////

import { NumberHash } from '@offirmo/ts-types'

import {
	InventorySlot,
	ItemQuality,
} from '@oh-my-rpg/definitions'
import { Random, Engine } from '@offirmo/random'

import {LIB} from "./consts";
import {
	Weapon,
} from './types'

/////////////////////

// actualized strength
// quality multipliers (see spreadsheet for calculation)
const QUALITY_STRENGTH_MULTIPLIER: NumberHash = {
	common:      1,
	uncommon:   19,
	rare:       46,
	epic:       91,
	legendary: 182,
	artifact:  333,
}

const QUALITY_STRENGTH_SPREAD: NumberHash = {
	common:    6,
	uncommon:  5,
	rare:      4,
	epic:      3,
	legendary: 2,
	artifact:  1,
}

const ENHANCEMENT_MULTIPLIER = 0.2


function get_interval(base_strength: number, quality: ItemQuality, enhancement_level: number, coef: number = 1): [number, number] {
	const spread = QUALITY_STRENGTH_SPREAD[quality]
	const strength_multiplier = QUALITY_STRENGTH_MULTIPLIER[quality]
	const enhancement_multiplier = (1 + ENHANCEMENT_MULTIPLIER * enhancement_level)

	// constrain interval
	const min_strength = Math.max(base_strength - spread, 1)
	const max_strength = Math.min(base_strength + spread, 20)

	return [
		Math.round(min_strength * strength_multiplier * enhancement_multiplier * coef),
		Math.round(max_strength * strength_multiplier * enhancement_multiplier * coef)
	]
}

/////////////////////

function get_damage_interval(weapon: Readonly<Weapon>): [number, number] {
	return get_interval(
		weapon.base_strength,
		weapon.quality,
		weapon.enhancement_level
	)
}

function get_medium_damage(weapon: Readonly<Weapon>): number {
	const damage_range = get_damage_interval(weapon)
	return Math.round((damage_range[0] + damage_range[1]) / 2)
}

function matches(weapon: Readonly<Weapon>, elements: Readonly<Partial<Weapon>>): boolean {
	let matches = true // so far

	if (weapon.slot !== InventorySlot.weapon)
		return false

	if (elements.slot && elements.slot !== InventorySlot.weapon)
		throw new Error(`${LIB} matches: can't match against a non-weapon slot "${elements.slot}"!`)

			;(Object.keys(elements) as Array<keyof Weapon>)
		.forEach((k: keyof Weapon) => {
			if (!(k in weapon))
				throw new Error(`${LIB} matches: can't match on non-weapon key "${k}"!`)

			if (elements[k] !== weapon[k])
				matches = false
		})

	return matches
}

/////////////////////

export {
	get_damage_interval,
	get_medium_damage,
	matches,
}

/////////////////////
