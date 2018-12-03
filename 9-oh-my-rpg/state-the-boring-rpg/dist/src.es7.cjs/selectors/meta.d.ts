import { State } from '../types';
declare function has_account(state: Readonly<State>): boolean;
declare function is_alpha(): boolean;
declare function is_player_since_alpha(state: Readonly<State>): boolean;
declare function is_registered_alpha_player(state: Readonly<State>): boolean;
export { has_account, is_alpha, is_player_since_alpha, is_registered_alpha_player, };
