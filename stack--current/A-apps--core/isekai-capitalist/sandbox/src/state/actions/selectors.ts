import { Enum } from 'typescript-string-enums'
import { Immutable } from '@offirmo-private/ts-types'
import { BaseAction } from '@offirmo-private/state-utils'
import { TimestampUTCMs } from '@offirmo-private/timestamps'

import { State } from '../types'
import {
	ActionType,
	Action,

	ActionDefeatBBEG,
	ActionDefeatMook,
	ActionExplore,
	ActionHack,
	ActionQuest,
	ActionRankUpGuild,
	ActionRomance, ActionEatFood,
	ActionSet,
	ActionTrain,
} from './types'
import {
	can_defeat_BBEG,
	get_heroine_relationship_level,
	is_ready_to_take_guild_rank_up_exam,
} from '../selectors'
import { RelationshipLevel } from '../../type--relationship-level'

/////////////////////

// needed for some validations
export function get_action_types(): string[] {
	return Enum.keys(ActionType)
}

/////////////////////

function create_base_action(time: TimestampUTCMs): Omit<BaseAction, 'type'> {
	return {
		time,
		expected_revisions: {},
	}
}

function create_action<Action extends BaseAction>(attributes: Omit<Action, 'time'>, time: TimestampUTCMs): Action {
	return {
		...create_base_action(time),
		...attributes,
	} as Action
}

export function create_actionꘌexplore(time: TimestampUTCMs): ActionExplore {
	return create_action<ActionExplore>({
		type: ActionType.explore,
		expected_revisions: {},
	}, time)
}

export function create_actionꘌtrain(time: TimestampUTCMs): ActionTrain {
	return create_action<ActionTrain>({
		type: ActionType.train,
		expected_revisions: {},
	}, time)
}

export function create_actionꘌquest(time: TimestampUTCMs): ActionQuest {
	return create_action<ActionQuest>({
		type: ActionType.quest,
		expected_revisions: {},
	}, time)
}

export function create_actionꘌrank_upⵧguild(time: TimestampUTCMs): ActionRankUpGuild {
	return create_action<ActionRankUpGuild>({
		type: ActionType.rank_upⵧguild,
		expected_revisions: {},
	}, time)
}

export function create_actionꘌromance(time: TimestampUTCMs): ActionRomance {
	return create_action<ActionRomance>({
		type: ActionType.romance,
		expected_revisions: {},
	}, time)
}

export function create_actionꘌeat_food(time: TimestampUTCMs): ActionEatFood {
	return create_action<ActionEatFood>({
		type: ActionType.eat_delicious_food,
		expected_revisions: {},
	}, time)
}

export function create_actionꘌdefeat_mook(time: TimestampUTCMs): ActionDefeatMook {
	return create_action<ActionDefeatMook>({
		type: ActionType.defeat_mook,
		expected_revisions: {},
	}, time)
}

export function create_actionꘌdefeat_BBEG(time: TimestampUTCMs): ActionDefeatBBEG {
	return create_action<ActionDefeatBBEG>({
		type: ActionType.defeat_BBEG,
		expected_revisions: {},
	}, time)
}

export function create_actionꘌnoop(time: TimestampUTCMs): ActionHack {
	return create_action<ActionHack>({
		type: ActionType.hack,
		expected_revisions: {},
		custom_reducer: state => state,
	}, time)
}

export function create_actionꘌset(state: Immutable<State> | null, time: TimestampUTCMs): ActionSet {
	return create_action<ActionSet>({
		type: ActionType.set,
		expected_revisions: {},
		state,
	}, time)
}

/////////////////////

export function get_available_actions(state: Immutable<State>, time: TimestampUTCMs = -1): Action[] {

	if (get_heroine_relationship_level(state) === RelationshipLevel.strangers)
		return [ create_actionꘌexplore(time) ]

	return [
		...(can_defeat_BBEG(state) ? [ create_actionꘌdefeat_BBEG(time) ] : []),
		...(is_ready_to_take_guild_rank_up_exam(state) ? [create_actionꘌrank_upⵧguild(time)] : []),
		create_actionꘌexplore(time),
		...(state.mc.guild.rank ? [create_actionꘌquest(time)] : []),
		create_actionꘌdefeat_mook(time),
		create_actionꘌromance(time),
		create_actionꘌeat_food(time),
		create_actionꘌset(null, time),
	]
}
