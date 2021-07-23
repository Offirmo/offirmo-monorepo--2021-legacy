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
	ActionSet,
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

export function create_action__explore(time: TimestampUTCMs): ActionExplore {
	return create_action<ActionExplore>({
		type: ActionType.explore,
		expected_revisions: {},
	}, time)
}

function create_action__noop(time: TimestampUTCMs): ActionHack {
	return create_action<ActionHack>({
		type: ActionType.hack,
		expected_revisions: {},
		custom_reducer: state => state,
	}, time)
}

function create_action__set(state: Immutable<State>, time: TimestampUTCMs): ActionSet {
	return create_action<ActionSet>({
		type: ActionType.set,
		expected_revisions: {},
		state,
	}, time)
}

/////////////////////

export function get_available_actions(state: Immutable<State>, time: TimestampUTCMs = -1): Action[] {
	return [
		create_action__explore(time),
	]
}
