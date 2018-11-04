import { AchievementEntry } from './types';
import { State } from './types';
declare function create(): State;
declare function get_sorted_visible_achievements(state: Readonly<State>): Readonly<AchievementEntry>[];
export { create, get_sorted_visible_achievements };
