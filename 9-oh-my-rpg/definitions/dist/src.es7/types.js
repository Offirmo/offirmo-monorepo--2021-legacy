import { Enum } from 'typescript-string-enums';
/////////////////////
const ElementType = Enum('item', 
// TODO expand
'location', 'lore');
/////////////////////
const ItemQuality = Enum('common', 'uncommon', 'rare', 'epic', 'legendary', 'artifact');
const InventorySlot = Enum('none', 'weapon', 'armor');
/////////////////////
export { ElementType, ItemQuality, InventorySlot, };
/////////////////////
//# sourceMappingURL=types.js.map