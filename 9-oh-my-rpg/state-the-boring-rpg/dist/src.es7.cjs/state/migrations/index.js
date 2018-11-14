"use strict";
/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const CharacterState = tslib_1.__importStar(require("@oh-my-rpg/state-character"));
const WalletState = tslib_1.__importStar(require("@oh-my-rpg/state-wallet"));
const InventoryState = tslib_1.__importStar(require("@oh-my-rpg/state-inventory"));
const PRNGState = tslib_1.__importStar(require("@oh-my-rpg/state-prng"));
const EnergyState = tslib_1.__importStar(require("@oh-my-rpg/state-energy"));
const EngagementState = tslib_1.__importStar(require("@oh-my-rpg/state-engagement"));
const CodesState = tslib_1.__importStar(require("@oh-my-rpg/state-codes"));
const ProgressState = tslib_1.__importStar(require("@oh-my-rpg/state-progress"));
const consts_1 = require("../../consts");
const state_1 = require("../reducers/state");
const achievements_1 = require("../reducers/achievements");
const sec_1 = require("../../sec");
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
        // TODO salvage creation date as well?
        // TODO auto-replay as much?
        console.info(`${consts_1.LIB}: salvaged some savegame data.`);
    }
    catch (err) {
        /* swallow */
        console.warn(`${consts_1.LIB}: salvaging failed!`);
        state = state_1.create();
    }
    return state;
}
const SUB_REDUCERS_COUNT = 8;
const OTHER_KEYS_COUNT = 5;
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
                state = migrate_to_7(SEC, legacy_state, hints);
            }
            catch (err) {
                SEC.fireAnalyticsEvent('schema_migration.failed', { step: 'main' });
                // we are top, attempt to salvage
                logger.error(`${consts_1.LIB}: failed migrating schema, reseting and salvaging!`, { err });
                state = reset_and_salvage(legacy_state);
                SEC.fireAnalyticsEvent('schema_migration.salvaged', { step: 'main' });
            }
        }
        // 2nd part (can re-reset...)
        try {
            // TODO migrate adventures
            // migrate sub-reducers if any...
            state = Object.assign({}, state);
            if (Object.keys(state).length !== SUB_REDUCERS_COUNT + OTHER_KEYS_COUNT) {
                logger.error('migrate_to_latest', { SUB_REDUCERS_COUNT, OTHER_KEYS_COUNT, actual_count: Object.keys(state).length, keys: Object.keys(state) });
                throw new Error('migrate_to_latest src (1) is outdated, please update!');
            }
            let sub_reducer_migrated = [];
            state.avatar = CharacterState.migrate_to_latest(SEC, state.avatar, hints.avatar);
            sub_reducer_migrated.push('avatar');
            state.inventory = InventoryState.migrate_to_latest(SEC, state.inventory, hints.inventory);
            sub_reducer_migrated.push('inventory');
            state.wallet = WalletState.migrate_to_latest(SEC, state.wallet, hints.wallet);
            sub_reducer_migrated.push('wallet');
            state.prng = PRNGState.migrate_to_latest(SEC, state.prng, hints.prng);
            sub_reducer_migrated.push('prng');
            state.energy = EnergyState.migrate_to_latest(SEC, state.energy, hints.energy);
            sub_reducer_migrated.push('energy');
            state.engagement = EngagementState.migrate_to_latest(SEC, state.engagement, hints.engagement);
            sub_reducer_migrated.push('engagement');
            state.codes = CodesState.migrate_to_latest(SEC, state.codes, hints.codes);
            sub_reducer_migrated.push('codes');
            state.progress = ProgressState.migrate_to_latest(SEC, state.progress, hints.progress);
            sub_reducer_migrated.push('progress');
            if (sub_reducer_migrated.length !== SUB_REDUCERS_COUNT)
                throw new Error('migrate_to_latest src (2) is outdated, please update!');
            // TODO remove, migration
            state = achievements_1.refresh_achievements(state);
            logger.info(`${consts_1.LIB}: schema migration successful.`);
            SEC.fireAnalyticsEvent('schema migration.ended');
        }
        catch (err) {
            SEC.fireAnalyticsEvent('schema_migration.failed', { step: 'sub' });
            // attempt to salvage
            logger.error(`${consts_1.LIB}: failed migrating sub-reducers, reseting and salvaging!`, { err });
            state = reset_and_salvage(legacy_state);
            SEC.fireAnalyticsEvent('schema_migration.salvaged', { step: 'sub' });
        }
        return state;
    });
}
exports.migrate_to_latest = migrate_to_latest;
/////////////////////
function migrate_to_7(SEC, legacy_state, hints) {
    if (legacy_state.schema_version >= 7)
        throw new Error('migrate_to_X src (3) is outdated, please update!');
    if (legacy_state.schema_version < 4)
        legacy_state = migrate_to_4(SEC, legacy_state, hints);
    let state = Object.assign({}, legacy_state, { schema_version: 7 });
    // new entries
    if (!state.codes)
        state.codes = CodesState.create(SEC);
    if (!state.progress)
        state.progress = ProgressState.create(SEC);
    if (!state.engagement)
        state.engagement = EngagementState.create(SEC);
    if (state.meaningful_interaction_count)
        delete state.meaningful_interaction_count;
    if (state.good_click_count) {
        state.progress.statistics.good_play_count = state.good_click_count;
        delete state.good_click_count;
    }
    if (state.click_count) {
        state.progress.statistics.bad_play_count = state.click_count - state.progress.statistics.good_play_count;
        delete state.click_count;
    }
    return state;
}
function migrate_to_4(SEC, legacy_state, hints) {
    throw new Error('Alpha release schema, won\'t migrate, would take too much time and schema is still unstable!');
}
//# sourceMappingURL=index.js.map