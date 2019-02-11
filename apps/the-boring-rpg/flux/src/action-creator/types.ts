import { Enum } from 'typescript-string-enums'

import { UUID } from '@offirmo/uuid'

import { CharacterClass } from '@oh-my-rpg/state-character'

/////////////////////

const ActionType = Enum(
	'play',
	'equip_item',
	'sell_item',
	'rename_avatar',
	'change_avatar_class',
	'redeem_code',
)
type ActionType = Enum<typeof ActionType> // eslint-disable-line no-redeclare

/////////////////////

interface ActionPlay {
	type: typeof ActionType.play
}

interface ActionEquipItem {
	type: typeof ActionType.equip_item
	target_uuid: UUID
}

interface ActionSellItem {
	type: typeof ActionType.sell_item
	target_uuid: UUID
}

interface ActionRenameAvatar {
	type: typeof ActionType.rename_avatar
	new_name: string
}

interface ActionChangeAvatarClass {
	type: typeof ActionType.change_avatar_class
	new_class: CharacterClass
}

interface ActionRedeemCode {
	type: typeof ActionType.redeem_code
	code: string
}

type Action = ActionPlay | ActionEquipItem | ActionSellItem | ActionRenameAvatar | ActionChangeAvatarClass | ActionRedeemCode

/////////////////////

export {
	ActionType,

	ActionPlay,
	ActionEquipItem,
	ActionSellItem,
	ActionRenameAvatar,
	ActionChangeAvatarClass,
	ActionRedeemCode,

	Action,
}
