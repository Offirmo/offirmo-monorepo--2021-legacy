import { Item } from '@oh-my-rpg/definitions';
declare type InventoryCoordinates = number;
interface State {
    schema_version: number;
    revision: number;
    unslotted_capacity: number;
    slotted: {
        [slot: string]: Item | null;
    };
    unslotted: Array<Item | null>;
}
export { InventoryCoordinates, Item, State };
