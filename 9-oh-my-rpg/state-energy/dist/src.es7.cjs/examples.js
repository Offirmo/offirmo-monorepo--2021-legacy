"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const deep_freeze_strict_1 = tslib_1.__importDefault(require("deep-freeze-strict"));
// a full featured, non-trivial demo state
// useful for demos and unit tests
const DEMO_STATE = deep_freeze_strict_1.default({
    schema_version: 1,
    revision: 108,
    max_energy: 9,
    base_energy_refilling_rate_per_day: 9,
    last_energy_usages: [
        {}
    ],
});
exports.DEMO_STATE = DEMO_STATE;
const MIGRATION_HINTS_FOR_TESTS = {};
exports.MIGRATION_HINTS_FOR_TESTS = MIGRATION_HINTS_FOR_TESTS;
//# sourceMappingURL=examples.js.map