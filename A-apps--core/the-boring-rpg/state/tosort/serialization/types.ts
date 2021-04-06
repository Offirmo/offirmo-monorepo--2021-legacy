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

const ActionCategory = Enum(
	'base',
	'inventory',
	'character',
	'meta',
)
type ActionCategory = Enum<typeof ActionCategory> // eslint-disable-line no-redeclare

/////////////////////

interface ActionPlay {
	type: typeof ActionType.play
	category: typeof ActionCategory.base
}

interface ActionEquipItem {
	type: typeof ActionType.equip_item
	category: typeof ActionCategory.inventory
	target_uuid: UUID
}

interface ActionSellItem {
	type: typeof ActionType.sell_item
	category: typeof ActionCategory.inventory
	target_uuid: UUID
}

interface ActionRenameAvatar {
	type: typeof ActionType.rename_avatar
	category: typeof ActionCategory.character
	new_name: string
}

interface ActionChangeAvatarClass {
	type: typeof ActionType.change_avatar_class
	category: typeof ActionCategory.character
	new_class: CharacterClass
}

interface ActionRedeemCode {
	type: typeof ActionType.redeem_code
	category: typeof ActionCategory.meta
	code: string
}

type Action = ActionPlay | ActionEquipItem | ActionSellItem | ActionRenameAvatar | ActionChangeAvatarClass | ActionRedeemCode

/////////////////////

export {
	ActionType,
	ActionCategory,

	ActionPlay,
	ActionEquipItem,
	ActionSellItem,
	ActionRenameAvatar,
	ActionChangeAvatarClass,
	ActionRedeemCode,

	Action,
}
