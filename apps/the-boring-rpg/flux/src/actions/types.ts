import { Enum } from 'typescript-string-enums'

import { UUID } from '@offirmo/uuid'
import { TimestampUTCMs } from '@offirmo/timestamps'
import { State } from '@tbrpg/state'
import { CharacterClass } from '@oh-my-rpg/state-character'

/////////////////////

const ActionType = Enum(
	'start_game',

	'on_start_session',
	'on_logged_in_update',

	'play',
	'equip_item',
	'sell_item',
	'rename_avatar',
	'change_avatar_class',
	'redeem_code',
	'acknowledge_engagement_msg_seen',

	'update_to_now',

	'hack',
)
type ActionType = Enum<typeof ActionType> // eslint-disable-line no-redeclare

/////////////////////

interface BaseAction {
	time: TimestampUTCMs
	expected_state_revision?: number // safety. TODO useful??
}

interface ActionStartGame extends BaseAction {
	type: typeof ActionType.start_game
	seed: number
}

interface ActionStartSession extends BaseAction {
	type: typeof ActionType.on_start_session
	is_web_diversity_supporter: boolean
}

interface ActionUpdateLoggedInInfos extends BaseAction {
	type: typeof ActionType.on_logged_in_update
	is_logged_in: boolean
	roles: string[]
}

interface ActionPlay extends BaseAction {
	type: typeof ActionType.play
}

interface ActionEquipItem extends BaseAction {
	type: typeof ActionType.equip_item
	target_uuid: UUID
}

interface ActionSellItem extends BaseAction {
	type: typeof ActionType.sell_item
	target_uuid: UUID
}

interface ActionRenameAvatar extends BaseAction {
	type: typeof ActionType.rename_avatar
	new_name: string
}

interface ActionChangeAvatarClass extends BaseAction {
	type: typeof ActionType.change_avatar_class
	new_class: CharacterClass
}

interface ActionRedeemCode extends BaseAction {
	type: typeof ActionType.redeem_code
	code: string
}

interface ActionAcknowledgeEngagementMsgSeen extends BaseAction {
	type: typeof ActionType.acknowledge_engagement_msg_seen
	uid: number
}

interface ActionUpdateToNow extends BaseAction {
	type: typeof ActionType.update_to_now
}

// for debug / hacks = ex. replenishing energy during local tests
// should never make it to the server!
interface ActionHack extends BaseAction {
	type: typeof ActionType.hack
	custom_reducer: (state: Readonly<State>) => Readonly<State>
}

type Action =
	ActionStartGame |
	ActionStartSession |
	ActionUpdateLoggedInInfos |
	ActionPlay |
	ActionEquipItem |
	ActionSellItem |
	ActionRenameAvatar |
	ActionChangeAvatarClass |
	ActionRedeemCode |
	ActionAcknowledgeEngagementMsgSeen |
	ActionUpdateToNow |
	ActionHack

/////////////////////

export {
	ActionType,

	ActionStartGame,
	ActionStartSession,
	ActionUpdateLoggedInInfos,
	ActionPlay,
	ActionEquipItem,
	ActionSellItem,
	ActionRenameAvatar,
	ActionChangeAvatarClass,
	ActionRedeemCode,
	ActionAcknowledgeEngagementMsgSeen,
	ActionUpdateToNow,
	ActionHack,

	Action,
}
