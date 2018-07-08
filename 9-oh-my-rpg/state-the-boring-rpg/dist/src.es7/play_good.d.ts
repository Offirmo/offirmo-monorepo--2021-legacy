import { State } from './types';
declare function play_good(state: Readonly<State>, explicit_adventure_archetype_hid?: string): Readonly<State>;
declare function play_bad(state: Readonly<State>, explicit_adventure_archetype_hid?: string): Readonly<State>;
export { play_good, play_bad, };
