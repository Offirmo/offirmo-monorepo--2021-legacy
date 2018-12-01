import { State } from '../../types';
declare function autoplay(state: Readonly<State>, options?: Readonly<{
    target_good_play_count?: number;
    target_bad_play_count?: number;
    DEBUG?: boolean;
}>): Readonly<State>;
export { autoplay, };
