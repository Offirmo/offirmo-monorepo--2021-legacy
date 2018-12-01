"use strict";
/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const timestamps_1 = require("@offirmo/timestamps");
const uuid_1 = require("@offirmo/uuid");
/////////////////////
const definitions_1 = require("@oh-my-rpg/definitions");
const CharacterState = tslib_1.__importStar(require("@oh-my-rpg/state-character"));
const WalletState = tslib_1.__importStar(require("@oh-my-rpg/state-wallet"));
const InventoryState = tslib_1.__importStar(require("@oh-my-rpg/state-inventory"));
const EnergyState = tslib_1.__importStar(require("@oh-my-rpg/state-energy"));
const EngagementState = tslib_1.__importStar(require("@oh-my-rpg/state-engagement"));
const PRNGState = tslib_1.__importStar(require("@oh-my-rpg/state-prng"));
const CodesState = tslib_1.__importStar(require("@oh-my-rpg/state-codes"));
const ProgressState = tslib_1.__importStar(require("@oh-my-rpg/state-progress"));
const state_prng_1 = require("@oh-my-rpg/state-prng");
const logic_weapons_1 = require("@oh-my-rpg/logic-weapons");
const logic_armors_1 = require("@oh-my-rpg/logic-armors");
/////////////////////
const consts_1 = require("../../consts");
const sec_1 = require("../../sec");
const engagement_1 = require("../../engagement");
const base_1 = require("./base");
const achievements_1 = require("./achievements");
/////////////////////
const STARTING_WEAPON_SPEC = {
    base_hid: 'spoon',
    qualifier1_hid: 'used',
    qualifier2_hid: 'noob',
    quality: definitions_1.ItemQuality.common,
    base_strength: 1,
};
exports.STARTING_WEAPON_SPEC = STARTING_WEAPON_SPEC;
const STARTING_ARMOR_SPEC = {
    base_hid: 'socks',
    qualifier1_hid: 'used',
    qualifier2_hid: 'noob',
    quality: 'common',
    base_strength: 1,
};
exports.STARTING_ARMOR_SPEC = STARTING_ARMOR_SPEC;
function create(SEC) {
    return sec_1.get_lib_SEC(SEC).xTry('create', ({ enforce_immutability }) => {
        let state = {
            schema_version: consts_1.SCHEMA_VERSION,
            revision: 0,
            uuid: uuid_1.generate_uuid(),
            creation_date: timestamps_1.get_human_readable_UTC_timestamp_minutes(),
            avatar: CharacterState.create(SEC),
            inventory: InventoryState.create(SEC),
            wallet: WalletState.create(),
            prng: PRNGState.create(),
            energy: EnergyState.create(),
            engagement: EngagementState.create(SEC),
            codes: CodesState.create(SEC),
            progress: ProgressState.create(SEC),
            last_adventure: null,
        };
        let rng = state_prng_1.get_prng(state.prng);
        const starting_weapon = logic_weapons_1.create(rng, STARTING_WEAPON_SPEC);
        state = base_1._receive_item(state, starting_weapon);
        state = base_1.equip_item(state, starting_weapon.uuid);
        const starting_armor = logic_armors_1.create(rng, STARTING_ARMOR_SPEC);
        state = base_1._receive_item(state, starting_armor);
        state = base_1.equip_item(state, starting_armor.uuid);
        state = achievements_1._refresh_achievements(state); // there are some initial achievements
        // reset engagements that may have been created by noisy initial achievements
        state = Object.assign({}, state, { engagement: Object.assign({}, state.engagement, { queue: [] }) });
        // now insert some relevant start engagements
        state = Object.assign({}, state, { engagement: EngagementState.enqueue(state.engagement, {
                type: EngagementState.EngagementType.flow,
                key: engagement_1.EngagementKey['tip--first_play']
            }) });
        //state.prng = PRNGState.update_use_count(state.prng, rng)
        state = Object.assign({}, state, { 
            // to compensate sub-functions use during build
            revision: 0 });
        return enforce_immutability(state);
    });
}
exports.create = create;
function reseed(state, seed) {
    seed = seed || state_prng_1.generate_random_seed();
    state = Object.assign({}, state, { prng: PRNGState.set_seed(state.prng, seed) });
    return state;
}
exports.reseed = reseed;
/////////////////////
//# sourceMappingURL=create.js.map