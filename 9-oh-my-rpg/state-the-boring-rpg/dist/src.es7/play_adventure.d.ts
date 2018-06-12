import { Item } from '@oh-my-rpg/definitions';
import { AdventureArchetype } from '@oh-my-rpg/logic-adventures';
import { State } from './types';
declare function receive_item(state: Readonly<State>, item: Item): Readonly<State>;
declare function play_adventure(state: Readonly<State>, aa: AdventureArchetype): Readonly<State>;
export { receive_item, play_adventure };
