"use strict";
/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
const MetaState = require("@oh-my-rpg/state-meta");
const CharacterState = require("@oh-my-rpg/state-character");
const WalletState = require("@oh-my-rpg/state-wallet");
const InventoryState = require("@oh-my-rpg/state-inventory");
const PRNGState = require("@oh-my-rpg/state-prng");
const consts_1 = require("./consts");
const state_1 = require("./state");
const sec_1 = require("./sec");
/////////////////////
function migrate_to_latest(SEC, legacy_state, hints = {}) {
    return sec_1.get_SEC(SEC).xTry('migrate_to_latest', ({ SEC, logger }) => {
        const src_version = (legacy_state && legacy_state.schema_version) || 0;
        let state = state_1.create();
        if (!legacy_state || Object.keys(legacy_state).length === 0) {
            // = empty or empty object (happen, with some deserialization techniques)
            // It's a new state, keep the freshly created one.
        }
        else if (src_version === consts_1.SCHEMA_VERSION)
            state = legacy_state;
        else if (src_version > consts_1.SCHEMA_VERSION)
            throw new Error(`Your data is from a more recent version of this lib. Please update!`);
        else {
            try {
                // TODO logger
                console.warn(`${consts_1.LIB_ID}: attempting to migrate schema from v${src_version} to v${consts_1.SCHEMA_VERSION}:`);
                state = migrate_to_4(SEC, legacy_state, hints);
                console.info(`${consts_1.LIB_ID}: schema migration successful.`);
            }
            catch (err) {
                // failed, reset all
                // TODO send event upwards
                console.error(`${consts_1.LIB_ID}: failed migrating schema, performing full reset !`, err);
                state = state_1.create();
            }
        }
        // migrate sub-reducers if any...
        state.meta = MetaState.migrate_to_latest(state.meta, hints.meta);
        state.avatar = CharacterState.migrate_to_latest(SEC, state.avatar, hints.avatar);
        state.inventory = InventoryState.migrate_to_latest(state.inventory, hints.inventory);
        state.wallet = WalletState.migrate_to_latest(state.wallet, hints.wallet);
        state.prng = PRNGState.migrate_to_latest(state.prng, hints.prng);
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