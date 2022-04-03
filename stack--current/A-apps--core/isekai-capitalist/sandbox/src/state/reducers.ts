import { Immutable } from '@offirmo-private/ts-types'
import { TimestampUTCMs, get_UTC_timestamp_ms } from '@offirmo-private/timestamps'
import assert from 'tiny-invariant'

import * as FlagsLib from '../state--flags'
import * as GuildMembershipReducers from '../state--guild-membership/reducers'
import { SharedMemoryType } from '../state--relationship/types'
import * as RelationshipLib from '../state--relationship'
import { RelationshipLevel } from '../type--relationship-level/types'
import * as RelationshipLevelLib from '../type--relationship-level'
import * as SSRRankLib from '../type--SSR-rank'
import * as GuildStateLib from '../state--guild-membership/reducers'
import { get_corresponding_index } from '../type--relationship-level'
import { LifeGreatness } from '../state--flags/types'

import { State } from './types'
import {
	get_required_xp_for_next_level,
	get_heroine_relationship_level, is_ready_to_take_guild_rank_up_exam,
} from './selectors'


/////////////////////

export function create(): Immutable<State> {
	let state = {
		schema_version: 0,
		revision: 0,

		flags: FlagsLib.create(),

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

	//state = _reduceⵧexperience_life_greatness(state, LifeGreatness.let_go_and_be_happy)
	state = _reduceⵧexperience_life_greatness(state, LifeGreatness.being_true_to_oneself)

	return state
}

/////////////////////

export function randomize_post_create(state: Immutable<State>, params: Immutable<{}> = {}): Immutable<State> {
	return state
}

export function reduceⵧupdate_to_now(state: Immutable<State>, time: TimestampUTCMs = get_UTC_timestamp_ms()): Immutable<State> {
	return state
}

function _get_meaningful_xp_gain(state: Immutable<State>): number {
	return get_required_xp_for_next_level(state.mc.level)
	//return Math.trunc(get_required_xp_for_next_level(state.mc.level) / 20) * 10
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
			if (level === 10)
				state = _reduceⵧexperience_life_greatness(state, LifeGreatness.great_physical_condition)
			if (level === 30)
				state = _reduceⵧexperience_life_greatness(state, LifeGreatness.able_to_defend_oneself)
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

export function _reduceⵧexperience_life_greatness(state: Immutable<State>, type: LifeGreatness): Immutable<State> {
	return {
		...state,

		flags: FlagsLib.reduceⵧexperience_life_greatness(state.flags, { type }),
	}
}

interface MakeMemoryParams extends RelationshipLib.MakeMemoryParams {
	active_romance?: boolean // active = active intent, passive = things just happened
						// intent is needed for level increase above a certain point
}
export function _reduceⵧmake_memory(state: Immutable<State>, params: Immutable<MakeMemoryParams>): Immutable<State> {

	// memory
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

	// side effect: may increase the relationship level
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
		/*console.log('_reduceⵧmake_memory', {
			active_romance: params.active_romance,
			current_level: level,
			next_level_index: RelationshipLevelLib.get_corresponding_index(level),
			mem_index: state.npcs.heroine.relationship.memories.count / 10,
			has_enough_memories,
			meets_other_requirements,
			should_increase_relationship_level,
		})*/
	}
	if (should_increase_relationship_level && get_heroine_relationship_level(state) !== RelationshipLevel.intimateⵧ3) {
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
		if (get_heroine_relationship_level(state) === RelationshipLevel.friendsⵧgood)
			state = _reduceⵧexperience_life_greatness(state, LifeGreatness.good_friends)
		if (get_heroine_relationship_level(state) === RelationshipLevel.intimateⵧ1)
			state = _reduceⵧexperience_life_greatness(state, LifeGreatness.intimacy)
	}

	// side effect: life greatness
	switch (params.type) {
		case SharedMemoryType.life_pleasure:
			state = _reduceⵧexperience_life_greatness(state, LifeGreatness.great_food)
			break

		/*case SharedMemoryType.assistance:
			state = _reduceⵧexperience_life_greatness(state, LifeGreatness.making_a_difference)
			break*/

		case SharedMemoryType.adventure:
			state = _reduceⵧexperience_life_greatness(state, LifeGreatness.travelling)
			break

		/*case [SharedMemoryType.'victory', // big or little
				'celebration', // after a victory, anniversary...
				'growth', // shared growth, rite of passage
				'adventure', // anything else ending as a "good story to tell"*/
		default:
			break
	}

	return state
}

/////////////////////

export function reduceⵧsnowflake(state: Immutable<State>): Immutable<State> {
	return {
		...state,
		revision: state.revision + 1,

		flags: FlagsLib.reduceⵧsave_the_world(state.flags),

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
	assert(is_ready_to_take_guild_rank_up_exam(state), `reduceⵧguild_rank_up() should be ready!`)

	state = {
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
	}

	state = _reduceⵧmake_memory(state,{ type: SharedMemoryType.growth })

	if (state.mc.guild.rank === SSRRankLib.SSRRank.S)
		state = _reduceⵧexperience_life_greatness(state, LifeGreatness.being_expert_at_sth)

	return state
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

const EMOJIS_FOOD_AND_DRINKS = '🍇🥐🥖🧀🥞🥩🍔🍖🥘🥟🥮🍨'.normalize('NFC')
const EMOJIS_FOOD_AND_DRINKS_COUNT = Array.from(EMOJIS_FOOD_AND_DRINKS).length // https://mathiasbynens.be/notes/javascript-unicode
export interface EatFoodParams {}
export function reduceⵧeat_food(state: Immutable<State>, params: Immutable<EatFoodParams>): Immutable<State> {
	return _reduceⵧmake_memory({
			...state,
			revision: state.revision + 1,
		},
		{
			type: SharedMemoryType.life_pleasure,
			emoji: Array.from(EMOJIS_FOOD_AND_DRINKS)[state.revision % EMOJIS_FOOD_AND_DRINKS_COUNT],
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

export interface DefeatBBEGParams {}
export function reduceⵧdefeat_BBEG(state: Immutable<State>, params: Immutable<DefeatBBEGParams>): Immutable<State> {
	state = _reduceⵧmake_memory( state, { type: SharedMemoryType.victory })
	state = _reduceⵧgain_xp( state, { gain: 100000 })
	state = _reduceⵧexperience_life_greatness( state, LifeGreatness.making_a_difference)

	return {
		...state,
		revision: state.revision + 1,

		flags: FlagsLib.reduceⵧsave_the_world(state.flags),
	}
}
