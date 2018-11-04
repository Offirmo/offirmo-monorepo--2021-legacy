"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const deep_freeze_strict_1 = tslib_1.__importDefault(require("deep-freeze-strict"));
/////////////////////
// a full featured, non-trivial demo state
// useful for demos and unit tests
const DEMO_STATE = deep_freeze_strict_1.default({
    schema_version: 1,
    revision: 450,
    max_energy: 7,
    base_energy_refilling_rate_per_day: 7,
    last_date: 'ts1_20181103_08h15:14.490',
    last_available_energy_float: 3.0009140000000000814,
});
exports.DEMO_STATE = DEMO_STATE;
//# sourceMappingURL=examples.js.map