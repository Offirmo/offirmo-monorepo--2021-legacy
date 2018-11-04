"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const deep_freeze_strict_1 = tslib_1.__importDefault(require("deep-freeze-strict"));
/////////////////////
// a full featured, non-trivial demo state
// useful for demos and unit tests
const DEMO_STATE = deep_freeze_strict_1.default({
    schema_version: 1,
    revision: 3,
    redeemed_codes: {
        BORED: {
            "redeem_count": 1,
            "last_redeem_date_minutes": "20181030_21h23"
        }
    },
});
exports.DEMO_STATE = DEMO_STATE;
//# sourceMappingURL=examples.js.map