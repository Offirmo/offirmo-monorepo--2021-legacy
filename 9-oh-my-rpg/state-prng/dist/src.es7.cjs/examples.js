"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const deep_freeze_strict_1 = tslib_1.__importDefault(require("deep-freeze-strict"));
// a full featured, non-trivial demo state
// useful for demos and unit tests
const DEMO_STATE = deep_freeze_strict_1.default({
    schema_version: 2,
    revision: 108,
    seed: 1234,
    use_count: 107,
    recently_encountered_by_id: {
        'item': ['axe', 'sword'],
        'adventures': ['dragon', 'king'],
        'mistery': [],
    },
});
exports.DEMO_STATE = DEMO_STATE;
//# sourceMappingURL=examples.js.map