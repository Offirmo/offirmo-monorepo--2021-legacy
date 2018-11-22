import { AchievementStatus, on_achieved, get_last_known_achievement_status, } from '@oh-my-rpg/state-progress';
import { enqueue as enqueueEngagement, EngagementType, } from '@oh-my-rpg/state-engagement';
import ACHIEVEMENT_DEFINITIONS from '../../../data/achievements';
import { EngagementKey } from "../../../engagement";
/////////////////////
function _refresh_achievements(state) {
    let changed = false;
    let progress = Object.assign({}, state.progress);
    ACHIEVEMENT_DEFINITIONS.forEach((definition) => {
        const { icon, name } = definition;
        const last_known_status = get_last_known_achievement_status(progress, name);
        const current_status = definition.get_status(state);
        // Don't remove an achievement
        // if it was a bug, it should be revoked in a migration
        if (last_known_status === AchievementStatus.unlocked)
            return;
        // nothing to do if no change
        if (last_known_status === current_status)
            return;
        changed = true;
        progress = on_achieved(progress, name, current_status);
        // need to tell the user?
        if (current_status === AchievementStatus.unlocked) {
            state = Object.assign({}, state, { engagement: enqueueEngagement(state.engagement, {
                    type: EngagementType.aside,
                    key: EngagementKey['achievement-unlocked'],
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
export { _refresh_achievements, };
//# sourceMappingURL=index.js.map