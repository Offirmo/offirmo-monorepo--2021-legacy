"use strict";
/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
const consts_1 = require("./consts");
const state_1 = require("./state");
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
        throw new Error(`${consts_1.LIB_ID}: Your data is from a more recent version of this lib. Please update!`);
    else {
        try {
            // TODO logger
            console.warn(`${consts_1.LIB_ID}: attempting to migrate schema from v${src_version} to v${consts_1.SCHEMA_VERSION}:`);
            state = migrate_to_1(legacy_state, hints);
            console.info(`${consts_1.LIB_ID}: schema migration successful.`);
        }
        catch (e) {
            // failed, reset all
            // TODO send event upwards
            console.error(`${consts_1.LIB_ID}: failed migrating schema, performing full reset !`);
            state = state_1.create();
        }
    }
    // migrate sub-reducers if any...
    return state;
}
exports.migrate_to_latest = migrate_to_latest;
/////////////////////
function migrate_to_1(legacy_state, hints) {
    if (Object.keys(legacy_state).length === Object.keys(state_1.OLDEST_LEGACY_STATE_FOR_TESTS).length) {
        console.info(`${consts_1.LIB_ID}: migrating schema from v0/non-versioned to v1...`);
        return Object.assign({}, legacy_state, { schema_version: 1, revision: (hints && hints.to_v1 && hints.to_v1.revision) || 0 });
    }
    throw new Error(`Unrecognized schema, most likely too old, can't migrate!`);
}
//# sourceMappingURL=migrations.js.map