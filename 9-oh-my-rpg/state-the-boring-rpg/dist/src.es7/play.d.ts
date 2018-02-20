import { Item } from '@oh-my-rpg/definitions';
import { State } from './types';
declare function receive_item(state: State, item: Item): State;
declare function play_good(state: State, explicit_adventure_archetype_hid?: string): State;
export { play_good, receive_item };
