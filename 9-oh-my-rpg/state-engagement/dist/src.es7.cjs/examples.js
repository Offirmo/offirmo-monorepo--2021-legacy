"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const deep_freeze_strict_1 = tslib_1.__importDefault(require("deep-freeze-strict"));
const types_1 = require("./types");
/////////////////////
// a full featured, non-trivial demo state
// useful for demos and unit tests
const DEMO_STATE = deep_freeze_strict_1.default({
    schema_version: 1,
    revision: 42,
    queue: [
        {
            engagement: {
                key: 'new-game-welcome',
                type: types_1.EngagementType.flow,
            },
            queue_time_root_revision: 0,
        }
    ],
});
exports.DEMO_STATE = DEMO_STATE;
//# sourceMappingURL=examples.js.map