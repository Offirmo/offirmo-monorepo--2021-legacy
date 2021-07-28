import { Immutable } from '@offirmo-private/ts-types'
import Fraction from 'fraction.js'

import { State } from './types'



export function get_required_xp_for_next_level(level: number): number {
	return (level + 1) * 1000
}

export function get_next_level_xp_completion_ratio(state: Immutable<State>): number {
	const { level, xp } = state.mc
	const required_xp = get_required_xp_for_next_level(level)

	return new Fraction(xp, required_xp).floor(2).valueOf()
}

export function get_mc_overall_power(state: Immutable<State>): number {
	const { level } = state.mc
	const next_level_ratio = get_next_level_xp_completion_ratio(state)

	return Math.trunc(level * 20 + next_level_ratio * 10)
}
