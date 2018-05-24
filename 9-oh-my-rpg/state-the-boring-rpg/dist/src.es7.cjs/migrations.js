"use strict";
/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const CharacterState = tslib_1.__importStar(require("@oh-my-rpg/state-character"));
const WalletState = tslib_1.__importStar(require("@oh-my-rpg/state-wallet"));
const InventoryState = tslib_1.__importStar(require("@oh-my-rpg/state-inventory"));
const PRNGState = tslib_1.__importStar(require("@oh-my-rpg/state-prng"));
const EnergyState = tslib_1.__importStar(require("@oh-my-rpg/state-energy"));
const consts_1 = require("./consts");
const state_1 = require("./state");
const sec_1 = require("./sec");
/////////////////////
function reset_and_salvage(legacy_state) {
    let state = state_1.create();
    // still, try to salvage "meta" for engagement
    try {
        // ensure this code is up to date
        if (typeof state.avatar.name !== 'string') {
            // TODO report
            console.warn(`${consts_1.LIB}: need to update the avatar name salvaging!`);
            return state_1.create();
        }
        if (typeof legacy_state.avatar.name === 'string') {
            state.avatar.name = legacy_state.avatar.name;
        }
        // TODO salvage creation date as well
        console.info(`${consts_1.LIB}: salvaged some savegame data.`);
    }
    catch (err) {
        /* swallow */
        console.warn(`${consts_1.LIB}: salvaging failed!`);
        state = state_1.create();
    }
    return state;
}
function migrate_to_latest(SEC, legacy_state, hints = {}) {
    return sec_1.get_SEC(SEC).xTry('migrate_to_latest', ({ SEC, logger }) => {
        const src_version = (legacy_state && legacy_state.schema_version) || 0;
        let state = state_1.create();
        const SUB_REDUCERS_COUNT = 5;
        const OTHER_KEYS_COUNT = 6;
        if (Object.keys(state).length !== SUB_REDUCERS_COUNT + OTHER_KEYS_COUNT)
            throw new Error('migrate_to_latest is outdated, please update!');
        if (!legacy_state || Object.keys(legacy_state).length === 0) {
            // = empty or empty object (happen, with some deserialization techniques)
            // It's a new state, keep the freshly created one.
        }
        else if (src_version === consts_1.SCHEMA_VERSION) {
            state = legacy_state;
        }
        else if (src_version > consts_1.SCHEMA_VERSION) {
            throw new Error(`Your data is from a more recent version of this lib. Please update!`);
        }
        else {
            try {
                // TODO logger
                console.warn(`${consts_1.LIB}: attempting to migrate schema from v${src_version} to v${consts_1.SCHEMA_VERSION}:`);
                state = migrate_to_4(SEC, legacy_state, hints);
                console.info(`${consts_1.LIB}: schema migration successful.`);
            }
            catch (err) {
                // failed, reset all
                // TODO send event upwards
                console.error(`${consts_1.LIB}: failed migrating schema, performing full reset !`, err);
                state = reset_and_salvage(legacy_state);
            }
        }
        if (state.prng.seed === PRNGState.DEFAULT_SEED) {
            state = state_1.reseed(state);
        }
        // TODO migrate adventures??
        // migrate sub-reducers if any...
        try {
            state.avatar = CharacterState.migrate_to_latest(SEC, state.avatar, hints.avatar);
            state.inventory = InventoryState.migrate_to_latest(state.inventory, hints.inventory);
            state.wallet = WalletState.migrate_to_latest(state.wallet, hints.wallet);
            state.prng = PRNGState.migrate_to_latest(state.prng, hints.prng);
            state.energy = EnergyState.migrate_to_latest(state.energy, hints.energy);
        }
        catch (err) {
            // failed, reset all
            // TODO send event upwards
            console.error(`${consts_1.LIB}: failed migrating sub-schema, performing full reset !`, err);
            state = reset_and_salvage(legacy_state);
        }
        return state;
    });
}
exports.migrate_to_latest = migrate_to_latest;
/////////////////////
function migrate_to_4(SEC, legacy_state, hints) {
    return SEC.xTry('migrate_to_4', ({ logger }) => {
        throw new Error(`Alpha release schema, won't migrate, would take too much time and schema is still unstable!`);
    });
}
//# sourceMappingURL=migrations.js.map