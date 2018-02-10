import { Enum } from 'typescript-string-enums';
import { CharacterClass } from '@oh-my-rpg/state-character';
import { UUID } from './types';
declare const ActionType: {
    play: "play";
    equip_item: "equip_item";
    sell_item: "sell_item";
    rename_avatar: "rename_avatar";
    change_avatar_class: "change_avatar_class";
};
declare type ActionType = Enum<typeof ActionType>;
declare const ActionCategory: {
    base: "base";
    inventory: "inventory";
    character: "character";
    meta: "meta";
};
declare type ActionCategory = Enum<typeof ActionCategory>;
interface ActionPlay {
    type: typeof ActionType.play;
    category: typeof ActionCategory.base;
}
interface ActionEquipItem {
    type: typeof ActionType.equip_item;
    category: typeof ActionCategory.inventory;
    expected_state_revision: number;
    target_uuid: UUID;
}
interface ActionSellItem {
    type: typeof ActionType.sell_item;
    category: typeof ActionCategory.inventory;
    expected_state_revision: number;
    target_uuid: UUID;
}
interface ActionRenameAvatar {
    type: typeof ActionType.rename_avatar;
    category: typeof ActionCategory.character;
    expected_state_revision: number;
    new_name: string;
}
interface ActionChangeAvatarClass {
    type: typeof ActionType.change_avatar_class;
    category: typeof ActionCategory.character;
    expected_state_revision: number;
    new_class: CharacterClass;
}
declare type Action = ActionPlay | ActionEquipItem | ActionSellItem | ActionRenameAvatar | ActionChangeAvatarClass;
export { ActionType, ActionCategory, ActionPlay, ActionEquipItem, ActionSellItem, ActionRenameAvatar, ActionChangeAvatarClass, Action };
