/////////////////////

import { Enum } from 'typescript-string-enums'
import { Immutable } from '@offirmo-private/ts-types'

import { ItemQuality, InventorySlot } from '@tbrpg/definitions'

import { LIB, MAX_ENHANCEMENT_LEVEL } from './consts'
import { Weapon } from './types'

/////////////////////
// see spreadsheet for calculation

const ENHANCEMENT_MULTIPLIER = 0.1

const MAX_POSSIBLE_ENHANCEMENT_RATIO = 1 + MAX_ENHANCEMENT_LEVEL * ENHANCEMENT_MULTIPLIER

const OVERALL_STRENGTH_INTERVAL_BY_QUALITY: Readonly<{ [k: string]: [number, number] }> = {
	[ItemQuality.common]:     [      1,    999 ],
	[ItemQuality.uncommon]:   [   1000,   2999 ],
	[ItemQuality.rare]:       [   3500,   9999 ],
	[ItemQuality.epic]:       [ 11_000, 29_999 ],
	[ItemQuality.legendary]:  [ 35_000, 99_999 ],
	[ItemQuality.artifact]:   [ 35_000, 99_999 ],
}
if (Object.keys(OVERALL_STRENGTH_INTERVAL_BY_QUALITY).length !== Enum.keys(ItemQuality).length)
	throw new Error(`${LIB} overall - outdated code!`)

const SPREAD_PCT_BY_QUALITY: Readonly<{ [k: string]: number }> = {
	[ItemQuality.common]:     0.10,
	[ItemQuality.uncommon]:   0.09,
	[ItemQuality.rare]:       0.08,
	[ItemQuality.epic]:       0.07,
	[ItemQuality.legendary]:  0.05,
	[ItemQuality.artifact]:   0.05,
}
if (Object.keys(SPREAD_PCT_BY_QUALITY).length !== Enum.keys(ItemQuality).length)
	throw new Error(`${LIB} spread - outdated code!`)

const TEMP_BASE_STRENGTH_INTERVAL_BY_QUALITY: { [k: string]: [number, number] } = {}
Object.keys(OVERALL_STRENGTH_INTERVAL_BY_QUALITY).forEach((k: string): void => {
	const quality = k as ItemQuality
	const [ overall_min, overall_max ] = OVERALL_STRENGTH_INTERVAL_BY_QUALITY[quality]
	const spread_pct = SPREAD_PCT_BY_QUALITY[quality]

	//console.log({quality, overall_min, overall_max})

	const base_min = Math.floor(overall_min / (1 - spread_pct) / 1)
	const base_max = Math.ceil(overall_max / (1 + spread_pct) / MAX_POSSIBLE_ENHANCEMENT_RATIO)

	/*console.log({base_min, base_max})
	for(let i = 0; i < 9; ++i) {
		console.log({
			i,
			dmg_min: Math.round(base_min * (1 - spread_pct) * (1 + i * ENHANCEMENT_MULTIPLIER)),
			dmg_max: Math.round(base_max * (1 + spread_pct) * (1 + i * ENHANCEMENT_MULTIPLIER)),
		})
	}*/
	if (base_min >= base_max)
		throw new Error(`${LIB}: range assertion failed for "${quality}"!`)

	TEMP_BASE_STRENGTH_INTERVAL_BY_QUALITY[quality] = [ base_min, base_max ]
})
const BASE_STRENGTH_INTERVAL_BY_QUALITY: Readonly<{ [k: string]: [number, number] }> = TEMP_BASE_STRENGTH_INTERVAL_BY_QUALITY


function get_interval(base_strength: number, quality: ItemQuality, enhancement_level: number): [number, number] {
	const spread_pct = SPREAD_PCT_BY_QUALITY[quality]
	const enhancement_ratio = (1 + ENHANCEMENT_MULTIPLIER * enhancement_level)
	const [ overall_min, overall_max ] = OVERALL_STRENGTH_INTERVAL_BY_QUALITY[quality]

	// Constrain interval due to rounding.
	// It shouldn't change the numbers a lot.
	const min_strength = Math.max(
		overall_min,
		Math.round(base_strength * (1 - spread_pct) * enhancement_ratio),
	)
	const max_strength = Math.min(
		overall_max,
		Math.round(base_strength * (1 + spread_pct) * enhancement_ratio),
	)

	return [ min_strength, max_strength ]
}

/////////////////////

function get_damage_interval(weapon: Immutable<Weapon>): [number, number] {
	return get_interval(
		weapon.base_strength,
		weapon.quality,
		weapon.enhancement_level,
	)
}

function get_medium_damage(weapon: Immutable<Weapon>): number {
	const damage_range = get_damage_interval(weapon)
	return Math.round((damage_range[0] + damage_range[1]) / 2)
}

function get_ultimate_medium_damage(weapon: Immutable<Weapon>): number {
	const max_damage_range = get_interval(
		weapon.base_strength,
		weapon.quality,
		MAX_ENHANCEMENT_LEVEL,
	)
	return Math.round((max_damage_range[0] + max_damage_range[1]) / 2)
}

function matches(weapon: Immutable<Weapon>, elements: Immutable<Partial<Weapon>>): boolean {
	let matches = true // so far

	if (!weapon)
		throw new Error(`${LIB} matches: can't match nothing!`)
	if (elements.slot && elements.slot !== InventorySlot.weapon)
		throw new Error(`${LIB} matches: can't match against a non-weapon slot "${elements.slot}"!`)

	if (weapon.slot !== InventorySlot.weapon)
		return false

		;(Object.keys(elements) as Array<keyof Weapon>)
		.forEach((k: keyof Weapon) => {
			if (!(k in weapon))
				throw new Error(`${LIB} matches: can't match on non-weapon key "${k}"!`)

			if (elements[k] !== weapon[k])
				matches = false
		})

	return matches
}

function is_at_max_enhancement(weapon: Immutable<Weapon>): boolean {
	return weapon.enhancement_level >= MAX_ENHANCEMENT_LEVEL
}

/////////////////////

export {
	OVERALL_STRENGTH_INTERVAL_BY_QUALITY,
	BASE_STRENGTH_INTERVAL_BY_QUALITY,

	get_damage_interval,
	get_medium_damage,
	get_ultimate_medium_damage,
	matches,
	is_at_max_enhancement,
}

/////////////////////
