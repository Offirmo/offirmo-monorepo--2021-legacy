"use strict";
/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
const consts_1 = require("./consts");
// need to be exported to compose migration tests
const MIGRATION_HINTS_FOR_TESTS = {
    'to_v1': {},
    'to_v2': {},
};
exports.MIGRATION_HINTS_FOR_TESTS = MIGRATION_HINTS_FOR_TESTS;
/////////////////////
function migrate_to_latest(legacy_state, hints = {}) {
    const existing_version = (legacy_state && legacy_state.schema_version) || 0;
    if (existing_version > consts_1.SCHEMA_VERSION)
        throw new Error(`${consts_1.LIB}: Your data is from a more recent version of this lib. Please update!`);
    let state = legacy_state; // for starter
    if (existing_version < consts_1.SCHEMA_VERSION) {
        console.warn(`${consts_1.LIB}: attempting to migrate schema from v${existing_version} to v${consts_1.SCHEMA_VERSION}:`);
        state = migrate_to_2(legacy_state, hints);
        console.info(`${consts_1.LIB}: schema migration successful.`);
    }
    // migrate sub-reducers if any...
    return state;
}
exports.migrate_to_latest = migrate_to_latest;
/////////////////////
function migrate_to_2(legacy_state, hints) {
    throw new Error('Unrecognized schema, most likely too old, can’t migrate!');
}
//# sourceMappingURL=migrations.js.map