import { AchievementSnapshot } from '@oh-my-rpg/state-progress';
import * as RichText from '@offirmo/rich-text-format';
declare function render_achievement_snapshot_short(achievement_snapshot: Readonly<AchievementSnapshot>): RichText.Document;
declare function render_achievement_snapshot_detailed(achievement_snapshot: Readonly<AchievementSnapshot>): RichText.Document;
declare function render_achievements_snapshot(ordered_achievement_snapshots: Readonly<AchievementSnapshot>[]): RichText.Document;
export { render_achievement_snapshot_short, render_achievement_snapshot_detailed, render_achievements_snapshot, };
