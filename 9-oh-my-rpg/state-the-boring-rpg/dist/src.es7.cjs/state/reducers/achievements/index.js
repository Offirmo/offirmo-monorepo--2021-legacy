"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const state_progress_1 = require("@oh-my-rpg/state-progress");
const state_engagement_1 = require("@oh-my-rpg/state-engagement");
const achievements_1 = tslib_1.__importDefault(require("../../../data/achievements"));
const engagement_1 = require("../../../engagement");
/////////////////////
function refresh_achievements(state) {
    let changed = false;
    let progress = Object.assign({}, state.progress);
    achievements_1.default.forEach((definition) => {
        const { icon, name } = definition;
        const last_known_status = state_progress_1.get_last_known_achievement_status(progress, name);
        const current_status = definition.get_status(state);
        if (last_known_status === current_status)
            return;
        changed = true;
        progress = state_progress_1.on_achieved(progress, name, current_status);
        // need to tell the user?
        if (current_status === state_progress_1.AchievementStatus.unlocked) {
            state = Object.assign({}, state, { engagement: state_engagement_1.enqueue(state.engagement, {
                    type: state_engagement_1.EngagementType.aside,
                    key: engagement_1.EngagementKey['achievement-unlocked'],
                }, {
                    semantic_level: 'success',
                    auto_dismiss_delay_ms: 7000,
                    icon,
                    name,
                }) });
        }
    });
    if (!changed)
        return state;
    return Object.assign({}, state, { progress });
}
exports.refresh_achievements = refresh_achievements;
//# sourceMappingURL=index.js.map