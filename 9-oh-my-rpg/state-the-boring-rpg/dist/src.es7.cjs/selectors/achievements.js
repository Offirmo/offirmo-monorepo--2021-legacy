"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const definitions_1 = require("@oh-my-rpg/definitions");
const state_progress_1 = require("@oh-my-rpg/state-progress");
const achievements_1 = tslib_1.__importDefault(require("../data/achievements"));
/////////////////////
function get_achievement_snapshot(state, definition) {
    const { session_uuid, name, icon, description, lore } = definition;
    // we check this and not get_status since unlock is "sticky" (by design) and get_status may not be
    const status = state_progress_1.get_last_known_achievement_status(state.progress, name);
    return {
        uuid: session_uuid,
        element_type: definitions_1.ElementType.achievement_snapshot,
        name,
        icon,
        description,
        lore,
        status: status,
    };
}
exports.get_achievement_snapshot = get_achievement_snapshot;
function get_achievement_snapshot_by_uuid(state, session_uuid) {
    const definition = achievements_1.default.find(d => d.session_uuid === session_uuid);
    if (!definition)
        throw new Error(`No achievement definition found for uuid "${session_uuid}"!`);
    return get_achievement_snapshot(state, definition);
}
exports.get_achievement_snapshot_by_uuid = get_achievement_snapshot_by_uuid;
function get_achievements_snapshot(state) {
    return achievements_1.default
        .map((definition) => {
        return get_achievement_snapshot(state, definition);
    })
        .filter(as => as.status !== state_progress_1.AchievementStatus.secret);
}
exports.get_achievements_snapshot = get_achievements_snapshot;
//# sourceMappingURL=achievements.js.map