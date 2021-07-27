import { Enum } from 'typescript-string-enums'
import { Immutable } from '@offirmo-private/ts-types'
import { BaseAction } from '@offirmo-private/state-utils'
import { UUID } from '@offirmo-private/uuid'
import { TimestampUTCMs, get_UTC_timestamp_ms } from '@offirmo-private/timestamps'

import { State } from '../types'
import {
	ActionType,
	Action,

	ActionExplore,

	ActionHack,
	ActionSet, ActionQuest, ActionRankUpGuild, ActionRomance, ActionEatFood, ActionTrain,
} from './types'

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

function create_actionꘌnoop(time: TimestampUTCMs): ActionHack {
	return create_action<ActionHack>({
		type: ActionType.hack,
		expected_revisions: {},
		custom_reducer: state => state,
	}, time)
}

function create_actionꘌset(state: Immutable<State> | null, time: TimestampUTCMs): ActionSet {
	return create_action<ActionSet>({
		type: ActionType.set,
		expected_revisions: {},
		state,
	}, time)
}

/////////////////////

export function get_available_actions(state: Immutable<State>, time: TimestampUTCMs = -1): Action[] {
	return [
		create_actionꘌexplore(time),
		create_actionꘌquest(time),
		create_actionꘌrank_upⵧguild(time),
		create_actionꘌromance(time),
		create_actionꘌeat_food(time),
		create_actionꘌset(null, time),
	]
}
