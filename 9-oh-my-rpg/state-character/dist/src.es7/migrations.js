import { SCHEMA_VERSION } from './consts';
import { get_lib_SEC } from './sec';
/////////////////////
function migrate_to_latest(SEC, legacy_state, hints = {}) {
    const existing_version = (legacy_state && legacy_state.schema_version) || 0;
    SEC = get_lib_SEC(SEC)
        .setAnalyticsAndErrorDetails({
        version_from: existing_version,
        version_to: SCHEMA_VERSION,
    });
    return SEC.xTry('migrate_to_latest', ({ SEC, logger }) => {
        if (existing_version > SCHEMA_VERSION)
            throw new Error('Your data is from a more recent version of this lib. Please update!');
        let state = legacy_state; // for starter
        if (existing_version < SCHEMA_VERSION) {
            logger.warn(`attempting to migrate schema from v${existing_version} to v${SCHEMA_VERSION}:`);
            SEC.fireAnalyticsEvent('schema_migration.began');
            try {
                state = migrate_to_2(SEC, legacy_state, hints);
            }
            catch (err) {
                SEC.fireAnalyticsEvent('schema_migration.failed');
                throw err;
            }
            logger.info('schema migration successful.');
            SEC.fireAnalyticsEvent('schema_migration.ended');
        }
        // migrate sub-reducers if any...
        return state;
    });
}
/////////////////////
function migrate_to_2(SEC, legacy_state, hints) {
    throw new Error('Schema is too old (pre-beta), can’t migrate!');
}
/////////////////////
export { migrate_to_latest, };
//# sourceMappingURL=migrations.js.map