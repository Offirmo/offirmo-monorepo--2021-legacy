import { Enum } from 'typescript-string-enums';
interface I18nMessages {
    [k: string]: string | I18nMessages;
}
declare type UUID = string;
declare const ElementType: {
    item: "item";
    location: "location";
    lore: "lore";
};
declare type ElementType = Enum<typeof ElementType>;
interface Element {
    uuid: UUID;
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
    none: "none";
    weapon: "weapon";
    armor: "armor";
};
declare type InventorySlot = Enum<typeof InventorySlot>;
interface Item extends Element {
    slot: InventorySlot;
    quality: ItemQuality;
}
export { I18nMessages, UUID, ElementType, Element, ItemQuality, InventorySlot, Item };
