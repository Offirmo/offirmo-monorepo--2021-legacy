import { Enum } from 'typescript-string-enums'
import { Immutable } from '@offirmo-private/ts-types'
import { BaseAction as _BaseAction } from '@offirmo-private/state-utils'
import { UUID } from '@offirmo-private/uuid'
import { TimestampUTCMs, get_UTC_timestamp_ms } from '@offirmo-private/timestamps'

import { State } from '../types'
import {
	ExploreParams,
	TrainParams,
	QuestParams,
	GuildRankUpParams,
	RomanceParams,
	EatFoodParams, DefeatMookParams, DefeatBBEGParams,
} from '../reducers'
import { reduceⵧsnowflake as reduceⵧsnowflake__guild } from '../../state--guild-membership/reducers'

/////////////////////

export const ActionType = Enum(

	'explore',
	'train',
	'quest',
	'rank_upⵧguild',
	'romance',
	'eat_delicious_food',
	'defeat_mook',
	'defeat_BBEG',

	/*'equip_item',
	'sell_item',
	'rename_avatar',
	'change_avatar_class',
	'redeem_code',

	'start_game',
	'on_start_session',
	'on_logged_in_refresh',
	'acknowledge_engagement_msg_seen',*
*/

	'update_to_now',

	'set',
	'hack',
)
export type ActionType = Enum<typeof ActionType> // eslint-disable-line no-redeclare

/////////////////////

export interface BaseAction<T> extends _BaseAction<T> {
	success_probability?: number // hint for rendering controls
}

/////////////////////

export interface ActionExplore extends BaseAction<ActionType>, ExploreParams {
	type: typeof ActionType.explore
}
export interface ActionTrain extends BaseAction<ActionType>, TrainParams {
	type: typeof ActionType.train
}
export interface ActionQuest extends BaseAction<ActionType>, QuestParams {
	type: typeof ActionType.quest
}
export interface ActionRankUpGuild extends BaseAction<ActionType>, GuildRankUpParams {
	type: typeof ActionType.rank_upⵧguild
}
export interface ActionRomance extends BaseAction<ActionType>, RomanceParams {
	type: typeof ActionType.romance
}
export interface ActionEatFood extends BaseAction<ActionType>, EatFoodParams {
	type: typeof ActionType.eat_delicious_food
}
export interface ActionDefeatMook extends BaseAction<ActionType>, DefeatMookParams {
	type: typeof ActionType.defeat_mook
}
export interface ActionDefeatBBEG extends BaseAction<ActionType>, DefeatBBEGParams {
	type: typeof ActionType.defeat_BBEG
}
/*
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
*/

export interface ActionUpdateToNow extends BaseAction<ActionType> {
	type: typeof ActionType.update_to_now
}

// for ex. restoring a game from cloud or a previous save
export interface ActionSet extends BaseAction<ActionType> {
	type: typeof ActionType.set
	state: Immutable<State> | null // null = create a new one
	// force: boolean
}

// for debug / hacks = ex. replenishing energy during local tests
// should never make it to the server!
export interface ActionHack extends BaseAction<ActionType> {
	type: typeof ActionType.hack
	custom_reducer: (state: Immutable<State>) => Immutable<State>
}

export type Action =
	| ActionExplore
	| ActionTrain
	| ActionQuest
	| ActionRankUpGuild
	| ActionRomance
	| ActionEatFood
	| ActionDefeatMook
	| ActionDefeatBBEG
	/*	| ActionStartGame
		| ActionStartSession
		| ActionUpdateLoggedInInfos
		| ActionPlay
		| ActionEquipItem
		| ActionSellItem
		| ActionRenameAvatar
		| ActionChangeAvatarClass
		| ActionRedeemCode
		| ActionAcknowledgeEngagementMsgSeen*/
	| ActionUpdateToNow
	| ActionSet
	| ActionHack
