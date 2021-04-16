import path from 'path'

import assert from 'tiny-invariant'
import memoize_one from 'memoize-one'
import { Enum } from 'typescript-string-enums'

import { Immutable, Mutable } from '@offirmo-private/ts-types'

import {
	Background, BiomeId,
} from './types'
import BACKGROUNDS from './data'

////////////////////////////////////////////////////////////////////////////////////
// TOP

export const get_backgrounds_by_biome_id = memoize_one(function get_backgrounds_by_biome_id(): Immutable<Record<BiomeId, Background[]>> {
	return BACKGROUNDS.reduce((acc, val) => {
		acc[val.biome_id] ??= []
		acc[val.biome_id].push(val)
		return acc
	}, {} as Mutable<ReturnType<typeof get_backgrounds_by_biome_id>>)
})

////////////////////////////////////////////////////////////////////////////////////
// BIOME

export function get_backgrounds_for_biome(id: BiomeId): Immutable<Background[]> {
	assert(id, `get_backgrounds_for_biome() should be given an id`)
	assert(Enum.isType(BiomeId, id), `get_backgrounds_for_biome() should be given a valid id "${id}"`)
	const backgrounds_by_biome_id = get_backgrounds_by_biome_id()
	assert((backgrounds_by_biome_id[id] ?? []).length > 0, `get_backgrounds_for_biome() should find backgrounds for "${id}"`)
	return backgrounds_by_biome_id[id]
}

export interface BackgroundMatch {
	biome_id?: BiomeId,
	features_settlement?: boolean, // will default to false
	transitions_to?: BiomeId,
	excluding_those_basenames?: string[],
}

export function get_backgrounds_matching(match?: BackgroundMatch): Immutable<Background[]> {
	const {
		biome_id,
		features_settlement = false,
		transitions_to,
		excluding_those_basenames,
	} = match || {}

	let candidate_backgrounds = biome_id ? get_backgrounds_for_biome(biome_id) : BACKGROUNDS

	candidate_backgrounds = candidate_backgrounds.filter(bg => bg.features_settlement === features_settlement)

	if (transitions_to !== undefined) {
		const temp_candidate_backgrounds = candidate_backgrounds.filter(bg => bg.transitions_to && (bg.transitions_to.startsWith(transitions_to) || transitions_to.startsWith(bg.transitions_to)))
		// we don't have a transition for every biome combination
		if (temp_candidate_backgrounds.length === 0) {
			// ignore the transition hint
		}
		else {
			candidate_backgrounds = temp_candidate_backgrounds
		}
	}

	if (excluding_those_basenames) {
		if (candidate_backgrounds.length <= excluding_those_basenames.length) {
			// TODO warn
		}
		else
			candidate_backgrounds = candidate_backgrounds.filter(bg => !excluding_those_basenames.includes(bg.basename))
	}

	if (candidate_backgrounds.length === 0) {
		console.error(`get_backgrounds_matching(...) no match!`, match)
		throw new Error(`get_backgrounds_matching(...) no match!`)
	}
	return candidate_backgrounds
}

export function get_background_matching(match?: BackgroundMatch): Immutable<Background> {
	return get_backgrounds_matching(match)[0]
}

////////////////////////////////////////////////////////////////////////////////////
// BACKGROUND

export function get_background_url(bg: Immutable<Background>): string {
	const end_path = path.join(...[
		'src',
		'assets',
		[ 'biome', ...bg.biome_id.split('ⵧ')].join('--'),
		bg.subfolder ?? '',
		bg.basename
	].filter(s => !!s))
	try {
		if (module) {
			//console.log(module.path)
			return path.join(
				module.path,
				'..', // to cancel 'src.esXYZ'
				'..', // to cancel 'dist'
				end_path
			)
		}
		throw new Error('NIMP!')
	}
	catch (err) {
		throw err
	}
}
