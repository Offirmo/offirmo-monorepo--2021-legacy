"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const consts_1 = require("./consts");
const state_1 = require("./state");
const sec_1 = require("./sec");
/////////////////////
function migrate_to_latest(SEC, legacy_state, hints = {}) {
    return sec_1.get_SEC(SEC).xTry('migrate_to_latest', ({ SEC, logger }) => {
        const src_version = (legacy_state && legacy_state.schema_version) || 0;
        let state = state_1.create(SEC);
        if (Object.keys(legacy_state).length === 0) {
            // = empty object
            // It happen with some deserialization techniques.
            // It's a new state, keep freshly created one.
        }
        else if (src_version === consts_1.SCHEMA_VERSION)
            state = legacy_state;
        else if (src_version > consts_1.SCHEMA_VERSION)
            throw new Error(`Your data is from a more recent version of this lib. Please update!`);
        else {
            try {
                // TODO report upwards
                logger.warn(`attempting to migrate schema from v${src_version} to v${consts_1.SCHEMA_VERSION}:`);
                state = migrate_to_2(SEC, legacy_state, hints);
                logger.info(`schema migration successful.`);
            }
            catch (err) {
                // failed, reset all
                // TODO send event upwards
                logger.error(`failed migrating schema, performing full reset !`, err);
                state = state_1.create(SEC);
            }
        }
        // migrate sub-reducers if any...
        return state;
    });
}
exports.migrate_to_latest = migrate_to_latest;
/////////////////////
function migrate_to_2(SEC, legacy_state, hints) {
    return SEC.xTry('migrate_to_2', ({ SEC, logger }) => {
        if (legacy_state.schema_version !== 1)
            legacy_state = migrate_to_1(SEC, legacy_state, hints);
        logger.info(`migrating schema from v1 to v2...`);
        return Object.assign({}, legacy_state, { schema_version: 2, revision: (hints && hints.to_v2 && hints.to_v2.revision) || 0 });
    });
}
/////////////////////
function migrate_to_1(SEC, legacy_state, hints) {
    return SEC.xTry('migrate_to_1', ({ logger }) => {
        if (Object.keys(legacy_state).length !== Object.keys(state_1.OLDEST_LEGACY_STATE_FOR_TESTS).length
            || !legacy_state.hasOwnProperty('characteristics'))
            throw new Error(`Unrecognized schema, most likely too old, can't migrate!`);
        logger.info(`migrating schema from v0/non-versioned to v1...`);
        const { name, klass, characteristics } = legacy_state;
        return {
            name,
            klass,
            attributes: characteristics,
            schema_version: 1,
        };
    });
}
//# sourceMappingURL=migrations.js.map