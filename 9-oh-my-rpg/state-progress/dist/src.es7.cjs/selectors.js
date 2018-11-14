"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
/////////////////////
function get_last_known_achievement_status(state, key) {
    return state.achievements[key];
}
exports.get_last_known_achievement_status = get_last_known_achievement_status;
function is_achievement_already_unlocked(state, key) {
    return state.achievements.hasOwnProperty(key)
        ? state.achievements[key] === types_1.AchievementStatus.unlocked
        : false;
}
exports.is_achievement_already_unlocked = is_achievement_already_unlocked;
//# sourceMappingURL=selectors.js.map