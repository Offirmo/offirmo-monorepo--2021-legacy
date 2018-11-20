"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const deep_freeze_strict_1 = tslib_1.__importDefault(require("deep-freeze-strict"));
const types_1 = require("./types");
/////////////////////
const TRUE_TRUE = true; // https://github.com/Microsoft/TypeScript/issues/19360
// a full featured, non-trivial demo state
// useful for demos and unit tests
const DEMO_STATE = deep_freeze_strict_1.default({
    schema_version: 1,
    revision: 42,
    wiki: null,
    flags: null,
    achievements: {
        "TEST": types_1.AchievementStatus.unlocked,
        "Summoned": types_1.AchievementStatus.unlocked,
        "Alpha player": types_1.AchievementStatus.unlocked,
        "Beta player": types_1.AchievementStatus.revealed,
        "I am bored": types_1.AchievementStatus.unlocked,
        "Turn it up to eleven": types_1.AchievementStatus.unlocked,
        "I am dead bored": types_1.AchievementStatus.revealed,
        "did I mention I was bored?": types_1.AchievementStatus.hidden,
        "king of boredom": types_1.AchievementStatus.hidden,
        "No-life except for boredom": types_1.AchievementStatus.hidden,
        "Hello darkness my old friend": types_1.AchievementStatus.hidden,
        "What’s in a name?": types_1.AchievementStatus.unlocked,
        "Graduated": types_1.AchievementStatus.unlocked,
        "I am very bored": types_1.AchievementStatus.unlocked,
        "Sorry my hand slipped": types_1.AchievementStatus.unlocked,
        "Oops!... I Did It Again": types_1.AchievementStatus.unlocked,
        "I’m not that innocent": types_1.AchievementStatus.revealed,
        "It’s good to be bad": types_1.AchievementStatus.hidden,
    },
    statistics: {
        good_play_count: 12,
        bad_play_count: 3,
        encountered_adventures: {
            'caravan_success': TRUE_TRUE,
            'dying_man': TRUE_TRUE,
            'ate_bacon': TRUE_TRUE,
            'ate_zombie': TRUE_TRUE,
            'refreshing_nap': TRUE_TRUE,
            'older': TRUE_TRUE,
        },
        encountered_monsters: {
            'wolf': TRUE_TRUE,
            'spreading adder': TRUE_TRUE,
            'fur-bearing truit': TRUE_TRUE,
        },
        good_play_count_by_active_class: {
            'novice': 7,
            'warrior': 5,
        },
        bad_play_count_by_active_class: {
            'novice': 2,
            'warrior': 1,
        },
        has_account: true,
        is_registered_alpha_player: false,
    }
});
exports.DEMO_STATE = DEMO_STATE;
//# sourceMappingURL=examples.js.map