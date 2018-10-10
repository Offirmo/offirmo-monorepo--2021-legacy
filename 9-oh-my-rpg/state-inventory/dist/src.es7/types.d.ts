import { Item } from '@oh-my-rpg/definitions';
interface State {
    schema_version: number;
    revision: number;
    slotted: {
        [slot: string]: Item | null;
    };
    unslotted_capacity: number;
    unslotted: Array<Item>;
}
export { Item, State, };
