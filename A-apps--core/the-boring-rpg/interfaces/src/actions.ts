import { Enum } from 'typescript-string-enums'
import { Immutable } from '@offirmo-private/ts-types'

import { UUID } from '@offirmo-private/uuid'
import { TimestampUTCMs, get_UTC_timestamp_ms } from '@offirmo-private/timestamps'
import { State } from '@tbrpg/state'
import { CharacterClass } from '@tbrpg/state--character'

/////////////////////

export const ActionType = Enum(
	'play',
	'equip_item',
	'sell_item',
	'rename_avatar',
	'change_avatar_class',
	'redeem_code',

	'start_game',
	'on_start_session',
	'on_logged_in_refresh',
	'acknowledge_engagement_msg_seen',
	'update_to_now',

	'set',
	'hack',
)
export type ActionType = Enum<typeof ActionType> // eslint-disable-line no-redeclare

/////////////////////

// TODO all those actions should be in the state package! (v2)
export interface BaseAction {
	//v: 1 // not sure needed
	time: TimestampUTCMs
	expected_revisions: {
		[k:string]: number
	}
}

export interface ActionStartGame extends BaseAction {
	type: typeof ActionType.start_game
	seed: number
}

export interface ActionStartSession extends BaseAction {
	type: typeof ActionType.on_start_session
	is_web_diversity_supporter: boolean
}

export interface ActionUpdateLoggedInInfos extends BaseAction {
	type: typeof ActionType.on_logged_in_refresh
	is_logged_in: boolean
	roles: string[]
}

export interface ActionPlay extends BaseAction {
	type: typeof ActionType.play
}

export interface ActionEquipItem extends BaseAction {
	type: typeof ActionType.equip_item
	target_uuid: UUID
}

export interface ActionSellItem extends BaseAction {
	type: typeof ActionType.sell_item
	target_uuid: UUID
}

export interface ActionRenameAvatar extends BaseAction {
	type: typeof ActionType.rename_avatar
	new_name: string
}

export interface ActionChangeAvatarClass extends BaseAction {
	type: typeof ActionType.change_avatar_class
	new_class: CharacterClass
}

export interface ActionRedeemCode extends BaseAction {
	type: typeof ActionType.redeem_code
	code: string
}

export interface ActionAcknowledgeEngagementMsgSeen extends BaseAction {
	type: typeof ActionType.acknowledge_engagement_msg_seen
	uid: number
}

export interface ActionUpdateToNow extends BaseAction {
	type: typeof ActionType.update_to_now
}

// for ex. restoring a game from cloud or a previous save
export interface ActionSet extends BaseAction {
	type: typeof ActionType.set
	state: Immutable<State>
	// force: boolean
}

// for debug / hacks = ex. replenishing energy during local tests
// should never make it to the server!
export interface ActionHack extends BaseAction {
	type: typeof ActionType.hack
	custom_reducer: (state: Immutable<State>) => Immutable<State>
}

export type Action =
	| ActionStartGame
	| ActionStartSession
	| ActionUpdateLoggedInInfos
	| ActionPlay
	| ActionEquipItem
	| ActionSellItem
	| ActionRenameAvatar
	| ActionChangeAvatarClass
	| ActionRedeemCode
	| ActionAcknowledgeEngagementMsgSeen
	| ActionUpdateToNow
	| ActionSet
	| ActionHack


/////////////////////

// needed for some validations
export function get_action_types(): string[] {
	return Enum.keys(ActionType)
}

/////////////////////

export function create_base_action(time: TimestampUTCMs = get_UTC_timestamp_ms()): BaseAction {
	return {
		time,
		expected_revisions: {},
	}
}

export function create_action<SomeAction extends BaseAction>(attributes: Omit<SomeAction, 'time'>, time: TimestampUTCMs = get_UTC_timestamp_ms()): SomeAction {
	return {
		...create_base_action(time),
		...attributes,
	} as SomeAction
}

export function create_action_noop(): ActionHack {
	return create_action<ActionHack>({
		type: ActionType.hack,
		expected_revisions: {},
		custom_reducer: state => state,
	})
}

export function create_action__set(state: Immutable<State>): ActionSet {
	return create_action<ActionSet>({
		type: ActionType.set,
		expected_revisions: {},
		state,
	})
}
