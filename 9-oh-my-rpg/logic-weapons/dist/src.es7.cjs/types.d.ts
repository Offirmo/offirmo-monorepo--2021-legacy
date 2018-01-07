import { Enum } from 'typescript-string-enums';
import { Item, InventorySlot, ItemQuality } from '@oh-my-rpg/definitions';
declare const WeaponPartType: {
    base: "base";
    qualifier1: "qualifier1";
    qualifier2: "qualifier2";
};
declare type WeaponPartType = Enum<typeof WeaponPartType>;
interface Weapon extends Item {
    slot: InventorySlot;
    base_hid: string;
    qualifier1_hid: string;
    qualifier2_hid: string;
    quality: ItemQuality;
    base_strength: number;
    enhancement_level: number;
}
export { WeaponPartType, Weapon };
