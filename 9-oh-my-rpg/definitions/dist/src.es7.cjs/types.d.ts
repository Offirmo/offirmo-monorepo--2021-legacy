import { Enum } from 'typescript-string-enums';
import { UUID } from '@offirmo/uuid';
declare const ElementType: {
    item: "item";
    achievement_snapshot: "achievement_snapshot";
    location: "location";
    lore: "lore";
};
declare type ElementType = Enum<typeof ElementType>;
interface Element {
    readonly uuid: UUID;
    element_type: ElementType;
}
declare const ItemQuality: {
    common: "common";
    uncommon: "uncommon";
    rare: "rare";
    epic: "epic";
    legendary: "legendary";
    artifact: "artifact";
};
declare type ItemQuality = Enum<typeof ItemQuality>;
declare const InventorySlot: {
    weapon: "weapon";
    armor: "armor";
    none: "none";
};
declare type InventorySlot = Enum<typeof InventorySlot>;
interface Item extends Element {
    slot: InventorySlot;
    quality: ItemQuality;
}
interface BaseState {
    schema_version: number;
    revision: number;
}
export { ElementType, Element, ItemQuality, InventorySlot, Item, BaseState, };
