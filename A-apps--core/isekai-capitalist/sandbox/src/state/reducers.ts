import { Immutable } from '@offirmo-private/ts-types'
import { TimestampUTCMs, get_UTC_timestamp_ms } from '@offirmo-private/timestamps'
import assert from 'tiny-invariant'

import { State } from './types'
import * as FlagsReducers from '../state--flags/reducers'
import * as GuildMembershipReducers from '../state--guild-membership/reducers'
import { SharedMemoryType } from '../state--relationship/types'
import * as RelationshipLib from '../state--relationship'
import { RelationshipLevel } from '../type--relationship-level/types'
import * as RelationshipLevelLib from '../type--relationship-level'

import { get_required_xp_for_next_level } from './selectors'
import * as SSRRankLib from '../type--SSR-rank'
import * as GuildStateLib from '../state--guild-membership/reducers'
import { get_corresponding_index } from '../type--relationship-level'


/////////////////////

export function create(): Immutable<State> {
	return {
		schema_version: 0,
		revision: 0,

		flags: FlagsReducers.create(),

		mc: {
			xp: 0,
			level: 1,
			equipment: undefined,
			guild: GuildMembershipReducers.create(),
		},

		npcs: {
			heroine: {
				guild: GuildMembershipReducers.create(),
				relationship: RelationshipLib.create(),
			},
			BBEG: {},
		},
	}
}

/////////////////////

export function randomize_post_create(state: Immutable<State>, params: Immutable<{}> = {}): Immutable<State> {
	return state
}

export function reduceⵧupdate_to_now(state: Immutable<State>, time: TimestampUTCMs = get_UTC_timestamp_ms()): Immutable<State> {
	return state
}

function _get_meaningful_xp_gain(state: Immutable<State>): number {
	return Math.trunc(get_required_xp_for_next_level(state.mc.level) / 20) * 10
}
interface XPGainParams {
	gain: number
}
export function _reduceⵧgain_xp(state: Immutable<State>, params: Immutable<XPGainParams> = { gain: _get_meaningful_xp_gain(state) }): Immutable<State> {
	let { xp, level } = state.mc
	let xp_gain = params.gain
	while (xp_gain) {
		const total_required_xp = get_required_xp_for_next_level(level)
		const remaining_required_xp = total_required_xp - xp
		if (xp_gain >= remaining_required_xp) {
			xp_gain -= remaining_required_xp
			xp = 0
			level++
		}
		else {
			xp += xp_gain
			xp_gain = 0
		}
	}

	return {
		...state,

		mc: {
			...state.mc,
			level,
			xp,
		},
	}
}

interface MakeMemoryParams extends RelationshipLib.MakeMemoryParams {
	active_romance?: boolean // active = active intent, passive = things just happened
						// intent is needed for level increase above a certain point
}
export function _reduceⵧmake_memory(state: Immutable<State>, params: Immutable<MakeMemoryParams>): Immutable<State> {
	let { level } = state.npcs.heroine.relationship

	let should_increase_relationship_level = false // so far

	if (RelationshipLevelLib.get_corresponding_index(level) < RelationshipLevelLib.get_corresponding_index(RelationshipLevel.friendsⵧgood)) {
		// auto increase relationship level up to a certain point
		should_increase_relationship_level = true
	}
	if (params.active_romance) {
		// increase if conditions are met
		const has_enough_memories = (state.npcs.heroine.relationship.memories.count / 10) >= RelationshipLevelLib.get_corresponding_index(level)
		const meets_other_requirements =
			(RelationshipLevelLib.compare(level, '<', RelationshipLevel.intimateⵧ1)) // below 2nd base is depending on shared memories
			|| state.flags.has_saved_the_world // above also needs to have saved the world
		if (has_enough_memories && meets_other_requirements)
			should_increase_relationship_level = true
		console.log('_reduceⵧmake_memory', {
			active_romance: params.active_romance,
			current_level: level,
			next_level_index: RelationshipLevelLib.get_corresponding_index(level),
			mem_index: state.npcs.heroine.relationship.memories.count / 10,
			has_enough_memories,
			meets_other_requirements,
			should_increase_relationship_level,
		})
	}

	if (should_increase_relationship_level) {
		state = {
			...state,

			npcs: {
				...state.npcs,

				heroine: {
					...state.npcs.heroine,

					relationship: RelationshipLib.reduceⵧincrease_level(state.npcs.heroine.relationship),
				}
			}
		}
	}

	state = {
		...state,

		npcs: {
			...state.npcs,

			heroine: {
				...state.npcs.heroine,

				relationship: RelationshipLib.reduceⵧmake_memory(
					state.npcs.heroine.relationship,
					params,
				),
			}
		}
	}

	return state
}

/////////////////////

export function reduceⵧsnowflake(state: Immutable<State>): Immutable<State> {
	return {
		...state,
		revision: state.revision + 1,

		flags: FlagsReducers.reduceⵧsnowflake(state.flags),

		mc: {
			...state.mc,
			level: 60,
			guild: GuildMembershipReducers.reduceⵧsnowflake(state.mc.guild),
		},

		npcs: {
			...state.npcs,
			heroine: {
				...state.npcs.heroine,
				guild: GuildMembershipReducers.reduceⵧsnowflake(state.npcs.heroine.guild),
				relationship: RelationshipLib.reduceⵧsnowflake(state.npcs.heroine.relationship),
			},
		},
	}
}

/////////////////////

const EMOJIS_ADVENTURE = '⛰🏰🏝🌋🏞⛪🧙🧝👸🤴🧚'.normalize('NFC')
const EMOJIS_ADVENTURE_COUNT = Array.from(EMOJIS_ADVENTURE).length // https://mathiasbynens.be/notes/javascript-unicode
export interface ExploreParams {}
export function reduceⵧexplore(state: Immutable<State>, params: Immutable<ExploreParams>): Immutable<State> {
	return _reduceⵧmake_memory(
		_reduceⵧgain_xp({
			...state,
			revision: state.revision + 1,
		}),
		{
			type: SharedMemoryType.adventure,
			emoji: Array.from(EMOJIS_ADVENTURE)[state.revision % EMOJIS_ADVENTURE_COUNT],
		}
	)
}

export interface TrainParams {}
export function reduceⵧtrain(state: Immutable<State>, params: Immutable<TrainParams>): Immutable<State> {
	return _reduceⵧgain_xp(state)
}

export interface QuestParams {}
export function reduceⵧdo_quest(state: Immutable<State>, params: Immutable<QuestParams>): Immutable<State> {
	return _reduceⵧmake_memory(
		_reduceⵧgain_xp({
			...state,
			revision: state.revision + 1,
		}),
		{
			type: SharedMemoryType.victory,
			//Array.from(EMOJIS_ADVENTURE)[state.revision % EMOJIS_COUNT],
		},
	)
}

export interface GuildRankUpParams {}
export function reduceⵧguild_rank_up(state: Immutable<State>, params: Immutable<GuildRankUpParams>): Immutable<State> {
	const current_rank = state.mc.guild.rank

	assert(!SSRRankLib.is_max(current_rank), `reduceⵧguild_rank_up() should not be already max`)

	const can_rank_up: boolean = (() => {
		switch (current_rank) {
			case null:
				return true // always

			default:
				//console.log('reduceⵧguild_rank_up', { current_rank, ci: SSRRankLib.get_corresponding_index(current_rank) + 1, li: state.mc.level / 10.})
				return (SSRRankLib.get_corresponding_index(current_rank) + 1) <= state.mc.level / 10.
		}
	})()

	if (!can_rank_up)
		return state // TODO failure message

	return  _reduceⵧmake_memory({
			...state,
			revision: state.revision + 1,

			mc: {
				...state.mc,
				guild: GuildStateLib.reduceⵧrank_up(state.mc.guild),
			},

			npcs: {
				...state.npcs,
				heroine: {
					...state.npcs.heroine,
					guild: GuildStateLib.reduceⵧrank_up(state.npcs.heroine.guild),
				},
			},
		},
		{
			type: SharedMemoryType.growth,
			//Array.from(EMOJIS_ADVENTURE)[state.revision % EMOJIS_COUNT],
		},
	)
}

export interface RomanceParams {}
export function reduceⵧromance(state: Immutable<State>, params: Immutable<RomanceParams>): Immutable<State> {
	return _reduceⵧmake_memory({
			...state,
			revision: state.revision + 1,
		},
		{
			type: SharedMemoryType.intimacy,
			active_romance: true,
		},
	)
}

export interface EatFoodParams {}
export function reduceⵧeat_food(state: Immutable<State>, params: Immutable<EatFoodParams>): Immutable<State> {
	return _reduceⵧmake_memory({
			...state,
			revision: state.revision + 1,
		},
		{
			type: SharedMemoryType.life_pleasure,
		}
	)
}

export interface DefeatMookParams {}
export function reduceⵧdefeat_mook(state: Immutable<State>, params: Immutable<DefeatMookParams>): Immutable<State> {
	return _reduceⵧmake_memory(
		_reduceⵧgain_xp({
			...state,
			revision: state.revision + 1,
		}),
		{
			type: SharedMemoryType.assistance,
			//Array.from(EMOJIS_ADVENTURE)[state.revision % EMOJIS_COUNT],
		}
	)
}
