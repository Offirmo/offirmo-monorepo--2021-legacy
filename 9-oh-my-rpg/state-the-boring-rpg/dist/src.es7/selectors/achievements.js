import { ElementType } from '@oh-my-rpg/definitions';
import { get_last_known_achievement_status, AchievementStatus, } from '@oh-my-rpg/state-progress';
import ACHIEVEMENT_DEFINITIONS from '../data/achievements';
/////////////////////
function get_achievement_snapshot(state, definition) {
    const { session_uuid, name, icon, description, lore } = definition;
    // we check this and not get_status since unlock is "sticky" (by design) and get_status may not be
    const status = get_last_known_achievement_status(state.progress, name);
    return {
        uuid: session_uuid,
        element_type: ElementType.achievement_snapshot,
        name,
        icon,
        description,
        lore,
        status: status,
    };
}
function get_achievement_snapshot_by_uuid(state, session_uuid) {
    const definition = ACHIEVEMENT_DEFINITIONS.find(d => d.session_uuid === session_uuid);
    if (!definition)
        throw new Error(`No achievement definition found for uuid "${session_uuid}"!`);
    return get_achievement_snapshot(state, definition);
}
function get_achievements_snapshot(state) {
    return ACHIEVEMENT_DEFINITIONS
        .map((definition) => {
        return get_achievement_snapshot(state, definition);
    })
        .filter(as => as.status !== AchievementStatus.secret);
}
export { get_achievement_snapshot, get_achievement_snapshot_by_uuid, get_achievements_snapshot, };
//# sourceMappingURL=achievements.js.map