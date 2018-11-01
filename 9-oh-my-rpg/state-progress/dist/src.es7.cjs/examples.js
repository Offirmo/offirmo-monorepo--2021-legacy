"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const deep_freeze_strict_1 = tslib_1.__importDefault(require("deep-freeze-strict"));
/////////////////////
const TRUE_TRUE = true;
// a full featured, non-trivial demo state
// useful for demos and unit tests
const DEMO_STATE = deep_freeze_strict_1.default({
    schema_version: 1,
    revision: 42,
    flags: null,
    achievements: null,
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