"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const deep_freeze_strict_1 = tslib_1.__importDefault(require("deep-freeze-strict"));
/////////////////////
// needed to test migrations, both here and in composing parents
// a full featured, non-trivial demo state
// needed for demos
const DEMO_STATE = deep_freeze_strict_1.default({
    schema_version: 1,
    revision: 5,
    uuid: 'uu1dgqu3h0FydqWyQ~6cYv3g',
    name: 'Offirmo',
    email: 'offirmo.net@gmail.com',
    allow_telemetry: false,
});
exports.DEMO_STATE = DEMO_STATE;
//# sourceMappingURL=examples.js.map