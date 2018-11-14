import { AchievementDefinition, AchievementSnapshot } from '@oh-my-rpg/state-progress';
import { State } from '../types';
declare function get_achievement_snapshot(state: Readonly<State>, definition: AchievementDefinition<State>): Readonly<AchievementSnapshot>;
declare function get_achievement_snapshot_by_uuid(state: Readonly<State>, session_uuid: string): Readonly<AchievementSnapshot>;
declare function get_achievements_snapshot(state: Readonly<State>): Readonly<AchievementSnapshot>[];
export { get_achievement_snapshot, get_achievement_snapshot_by_uuid, get_achievements_snapshot, };
