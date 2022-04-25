import { Immutable } from '@offirmo-private/ts-types'
import Fraction from 'fraction.js'

import { State } from './types'
import * as RelationshipLevelLib from '../type--relationship-level'
import * as SSRRankLib from '../type--SSR-rank'


export function get_mc_guild_rank(state: Immutable<State>): SSRRankLib.SSRRank | null {
	return state.mc.guild.rank
}

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

	const skill_multiplier = Math.pow(SSRRankLib.get_corresponding_index(get_mc_guild_rank(state)), 1.13) / 10.

	return (level * 20 + next_level_ratio * 10) * (1 + skill_multiplier)
}

export function get_party_overall_power(state: Immutable<State>): number {
	const mc_power = get_mc_overall_power(state)
	const heroine_relationship_index = RelationshipLevelLib.get_corresponding_index(get_heroine_relationship_level(state))

	const party_size = 1 + (heroine_relationship_index > 0 ? 1 : 0)
	const party_size_bonus = (party_size - 1) / 10

	const relationship_bonus = Math.min(Math.max(0, heroine_relationship_index - 3), 5) / 10

	const bonus_multiplier = 1 + party_size_bonus + relationship_bonus

	/*console.log({
		mc_power,
		party_size,
		heroine_relationship_index,
		bonus: {
			party_size: party_size_bonus,
			relationship: relationship_bonus,
			xxfinal: bonus_multiplier,
		},
	})
	*/
	return mc_power * party_size * bonus_multiplier
}

export function get_heroine_relationship_level(state: Immutable<State>): RelationshipLevelLib.RelationshipLevel {
	return state.npcs.heroine.relationship.level
}

export function is_ready_to_take_guild_rank_up_exam(state: Immutable<State>): boolean {
	const current_rank = state.mc.guild.rank
	if (!current_rank) return true
	if (SSRRankLib.is_max(current_rank)) return false

	return (SSRRankLib.get_corresponding_index(current_rank) + 1) <= state.mc.level / 10.
}

export function can_defeat_BBEG(state: Immutable<State>): boolean {
	return !state.flags.has_saved_the_world && get_party_overall_power(state) >= 9000
}
