import path from 'path'
import memoize_one from 'memoize-one'
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
	return get_backgrounds_by_biome_id()[id]
}

export function get_backgrounds_matching(
	{
		biome_id,
		features_settlement,
		transitions_to,
		excluding_those_basenames,
	}: {
		biome_id?: BiomeId,
		features_settlement?: boolean,
		transitions_to?: BiomeId,
		excluding_those_basenames?: string[],
	} = {}): Immutable<Background[]> {
	let candidate_backgrounds = biome_id ? get_backgrounds_for_biome(biome_id) : BACKGROUNDS

	if (features_settlement !== undefined)
		candidate_backgrounds = candidate_backgrounds.filter(bg => bg.features_settlement === features_settlement)

	if (transitions_to !== undefined)
		candidate_backgrounds = candidate_backgrounds.filter(bg => bg.transitions_to && (bg.transitions_to.startsWith(transitions_to) || transitions_to.startsWith(bg.transitions_to)))

	if (excluding_those_basenames) {
		if (candidate_backgrounds.length <= excluding_those_basenames.length) {
			// TODO warn
		}
		else
			candidate_backgrounds = candidate_backgrounds.filter(bg => !excluding_those_basenames.includes(bg.basename))
	}

	return candidate_backgrounds
}

////////////////////////////////////////////////////////////////////////////////////
// BACKGROUND

export function get_background_url(bg: Immutable<Background>): string {
	const end_path = path.join(...[
		'src',
		'assets',
		[ 'biome', ...bg.biome_id.split('ⵧ')].join('--'),
		bg.features_settlement ? 'settlements' : '',
		bg.transitions_to ? ['to', ...bg.transitions_to.split('ⵧ')].join('--') : '',
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
