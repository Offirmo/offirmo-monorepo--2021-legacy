import { State } from '../../types';
declare function _auto_make_room(state: Readonly<State>, options?: {
    DEBUG?: boolean;
}): Readonly<State>;
declare function _autogroom(state: Readonly<State>, options?: {
    DEBUG?: boolean;
}): Readonly<State>;
declare function autoplay(state: Readonly<State>, options?: Readonly<{
    target_good_play_count?: number;
    target_bad_play_count?: number;
    DEBUG?: boolean;
}>): Readonly<State>;
export { _auto_make_room, _autogroom, autoplay, };
