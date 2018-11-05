"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const deep_freeze_strict_1 = tslib_1.__importDefault(require("deep-freeze-strict"));
const consts_1 = require("./consts");
const sec_1 = require("./sec");
// some hints may be needed to migrate to demo state
// need to export them for composing tests
const MIGRATION_HINTS_FOR_TESTS = deep_freeze_strict_1.default({});
exports.MIGRATION_HINTS_FOR_TESTS = MIGRATION_HINTS_FOR_TESTS;
/////////////////////
function migrate_to_latest(SEC, legacy_state, hints = {}) {
    const existing_version = (legacy_state && legacy_state.schema_version) || 0;
    SEC = sec_1.get_lib_SEC(SEC)
        .setAnalyticsAndErrorDetails({
        version_from: existing_version,
        version_to: consts_1.SCHEMA_VERSION,
    });
    return SEC.xTry('migrate_to_latest', ({ SEC, logger }) => {
        if (existing_version > consts_1.SCHEMA_VERSION)
            throw new Error('Your data is from a more recent version of this lib. Please update!');
        let state = legacy_state; // for starter
        if (existing_version < consts_1.SCHEMA_VERSION) {
            logger.warn(`${consts_1.LIB}: attempting to migrate schema from v${existing_version} to v${consts_1.SCHEMA_VERSION}:`);
            SEC.fireAnalyticsEvent('schema_migration.began');
            try {
                state = migrate_to_2(SEC, legacy_state, hints);
            }
            catch (err) {
                SEC.fireAnalyticsEvent('schema_migration.failed');
                throw err;
            }
            logger.info(`${consts_1.LIB}: schema migration successful.`);
            SEC.fireAnalyticsEvent('schema_migration.ended');
        }
        // migrate sub-reducers if any...
        return state;
    });
}
exports.migrate_to_latest = migrate_to_latest;
/////////////////////
function migrate_to_2(SEC, legacy_state, hints) {
    throw new Error('Schema is too old (pre-beta), can’t migrate!');
}
//# sourceMappingURL=migrations.js.map