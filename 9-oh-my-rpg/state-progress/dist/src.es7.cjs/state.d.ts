import { AchievementStatus, State } from './types';
import { SoftExecutionContext } from './sec';
declare function create(SEC?: SoftExecutionContext): Readonly<State>;
interface PlayedDetails {
    good: boolean;
    adventure_key: string;
    encountered_monster_key?: string | null;
    active_class: string;
}
declare function on_played(state: Readonly<State>, details: PlayedDetails): Readonly<State>;
declare function on_achieved(state: Readonly<State>, key: string, new_status: AchievementStatus): Readonly<State>;
export { create, on_played, on_achieved, };
