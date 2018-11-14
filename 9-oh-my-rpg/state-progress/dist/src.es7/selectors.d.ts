import { State, AchievementStatus } from './types';
declare function get_last_known_achievement_status(state: Readonly<State>, key: string): AchievementStatus | undefined;
declare function is_achievement_already_unlocked(state: Readonly<State>, key: string): boolean;
export { get_last_known_achievement_status, is_achievement_already_unlocked, };
