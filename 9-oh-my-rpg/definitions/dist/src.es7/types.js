import { Enum } from 'typescript-string-enums';
/////////////////////
// An element is everything which can be interacted with and/or has a rich tooltip
// ex. item, place, achievement, title...
const ElementType = Enum('item', 'achievement_snapshot', 
// TODO expand
'location', 'lore');
/////////////////////
const ItemQuality = Enum('common', 'uncommon', 'rare', 'epic', 'legendary', 'artifact');
const InventorySlot = Enum('weapon', 'armor', 'none' // TODO
);
/////////////////////
export { ElementType, ItemQuality, InventorySlot, };
/////////////////////
//# sourceMappingURL=types.js.map