"use strict";
/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const consts_1 = require("./consts");
const state_1 = require("./state");
const deep_freeze_strict_1 = tslib_1.__importDefault(require("deep-freeze-strict"));
// the oldest format we can migrate from
// must correspond to state above
// TODO clean that
const OLDEST_LEGACY_STATE_FOR_TESTS = deep_freeze_strict_1.default({
    // no schema_version = 0
    coin_count: 23456,
    token_count: 89,
});
exports.OLDEST_LEGACY_STATE_FOR_TESTS = OLDEST_LEGACY_STATE_FOR_TESTS;
// some hints may be needed to migrate to demo state
// must be exposed to combine unit test
const MIGRATION_HINTS_FOR_TESTS = {
    to_v1: {
        revision: 42
    },
};
exports.MIGRATION_HINTS_FOR_TESTS = MIGRATION_HINTS_FOR_TESTS;
/////////////////////
function migrate_to_latest(legacy_state, hints = {}) {
    const src_version = (legacy_state && legacy_state.schema_version) || 0;
    let state = state_1.create();
    if (Object.keys(legacy_state).length === 0) {
        // = empty object
        // It happen with some deserialization techniques.
        // It's a new state, keep freshly created one.
    }
    else if (src_version === consts_1.SCHEMA_VERSION)
        state = legacy_state;
    else if (src_version > consts_1.SCHEMA_VERSION)
        throw new Error(`${consts_1.LIB}: Your data is from a more recent version of this lib. Please update!`);
    else {
        try {
            // TODO logger
            console.warn(`${consts_1.LIB}: attempting to migrate schema from v${src_version} to v${consts_1.SCHEMA_VERSION}:`);
            state = migrate_to_1(legacy_state, hints);
            console.info(`${consts_1.LIB}: schema migration successful.`);
        }
        catch (e) {
            // failed, reset all
            // TODO send event upwards
            console.error(`${consts_1.LIB}: failed migrating schema, performing full reset !`);
            state = state_1.create();
        }
    }
    // migrate sub-reducers if any...
    return state;
}
exports.migrate_to_latest = migrate_to_latest;
/////////////////////
function migrate_to_1(legacy_state, hints) {
    if (Object.keys(legacy_state).length === Object.keys(OLDEST_LEGACY_STATE_FOR_TESTS).length) {
        console.info(`${consts_1.LIB}: migrating schema from v0/non-versioned to v1...`);
        return Object.assign({}, legacy_state, { schema_version: 1, revision: (hints && hints.to_v1 && hints.to_v1.revision) || 0 });
    }
    throw new Error('Unrecognized schema, most likely too old, can’t migrate!');
}
//# sourceMappingURL=migrations.js.map