import { AchievementStatus } from './types';
/////////////////////
function get_last_known_achievement_status(state, key) {
    return state.achievements[key];
}
function is_achievement_already_unlocked(state, key) {
    return state.achievements.hasOwnProperty(key)
        ? state.achievements[key] === AchievementStatus.unlocked
        : false;
}
/////////////////////
export { get_last_known_achievement_status, is_achievement_already_unlocked, };
//# sourceMappingURL=selectors.js.map