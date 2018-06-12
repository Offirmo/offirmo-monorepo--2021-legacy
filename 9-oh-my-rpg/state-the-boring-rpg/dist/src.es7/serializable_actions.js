import { Enum } from 'typescript-string-enums';
/////////////////////
const ActionType = Enum('play', 'equip_item', 'sell_item', 'rename_avatar', 'change_avatar_class');
const ActionCategory = Enum('base', 'inventory', 'character', 'meta');
/////////////////////
export { ActionType, ActionCategory, };
//# sourceMappingURL=serializable_actions.js.map