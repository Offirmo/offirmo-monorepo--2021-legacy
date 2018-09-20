/////////////////////
import { LIB, SCHEMA_VERSION } from './consts';
import { create, OLDEST_LEGACY_STATE_FOR_TESTS } from './state';
/////////////////////
function migrate_to_latest(legacy_state, hints = {}) {
    const src_version = (legacy_state && legacy_state.schema_version) || 0;
    let state = create();
    if (Object.keys(legacy_state).length === 0) {
        // = empty object
        // It happen with some deserialization techniques.
        // It's a new state, keep freshly created one.
    }
    else if (src_version === SCHEMA_VERSION)
        state = legacy_state;
    else if (src_version > SCHEMA_VERSION)
        throw new Error(`${LIB}: Your data is from a more recent version of this lib. Please update!`);
    else {
        try {
            // TODO logger
            console.warn(`${LIB}: attempting to migrate schema from v${src_version} to v${SCHEMA_VERSION}:`);
            state = migrate_to_1(legacy_state, hints);
            console.info(`${LIB}: schema migration successful.`);
        }
        catch (e) {
            // failed, reset all
            // TODO send event upwards
            console.error(`${LIB}: failed migrating schema, performing full reset !`);
            state = create();
        }
    }
    // migrate sub-reducers if any...
    return state;
}
/////////////////////
function migrate_to_1(legacy_state, hints) {
    if (Object.keys(legacy_state).length === Object.keys(OLDEST_LEGACY_STATE_FOR_TESTS).length) {
        console.info(`${LIB}: migrating schema from v0/non-versioned to v1...`);
        return Object.assign({}, legacy_state, { schema_version: 1, revision: (hints && hints.to_v1 && hints.to_v1.revision) || 0 });
    }
    throw new Error(`Unrecognized schema, most likely too old, can't migrate!`);
}
/////////////////////
export { migrate_to_latest, };
//# sourceMappingURL=migrations.js.map