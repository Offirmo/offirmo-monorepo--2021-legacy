import { Item } from '@oh-my-rpg/definitions';
import { State } from './types';
declare function receive_item(state: Readonly<State>, item: Item): Readonly<State>;
declare function play_good(state: Readonly<State>, explicit_adventure_archetype_hid?: string): Readonly<State>;
declare function play_bad(state: Readonly<State>, explicit_adventure_archetype_hid?: string): Readonly<State>;
export { play_good, play_bad, receive_item };
