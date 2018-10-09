import { UUID } from '@offirmo/uuid';
import { InventorySlot } from '@oh-my-rpg/definitions';
import { Item, State } from './types';
import { SoftExecutionContext } from './sec';
declare function create(SEC?: SoftExecutionContext): Readonly<State>;
declare function add_item(state: Readonly<State>, item: Item): Readonly<State>;
declare function remove_item_from_unslotted(state: Readonly<State>, uuid: UUID): Readonly<State>;
declare function equip_item(state: Readonly<State>, uuid: UUID): Readonly<State>;
export { InventorySlot, create, add_item, remove_item_from_unslotted, equip_item, };
