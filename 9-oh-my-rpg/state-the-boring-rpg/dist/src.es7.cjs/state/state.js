"use strict";
/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const timestamps_1 = require("@offirmo/timestamps");
const uuid_1 = require("@offirmo/uuid");
/////////////////////
const definitions_1 = require("@oh-my-rpg/definitions");
const CharacterState = tslib_1.__importStar(require("@oh-my-rpg/state-character"));
const state_character_1 = require("@oh-my-rpg/state-character");
const WalletState = tslib_1.__importStar(require("@oh-my-rpg/state-wallet"));
const state_wallet_1 = require("@oh-my-rpg/state-wallet");
const InventoryState = tslib_1.__importStar(require("@oh-my-rpg/state-inventory"));
const EnergyState = tslib_1.__importStar(require("@oh-my-rpg/state-energy"));
const PRNGState = tslib_1.__importStar(require("@oh-my-rpg/state-prng"));
const state_prng_1 = require("@oh-my-rpg/state-prng");
const logic_weapons_1 = require("@oh-my-rpg/logic-weapons");
const logic_armors_1 = require("@oh-my-rpg/logic-armors");
const CodesState = tslib_1.__importStar(require("@oh-my-rpg/state-codes"));
/////////////////////
const consts_1 = require("../consts");
const selectors_1 = require("../selectors");
const sec_1 = require("../sec");
const play_adventure_1 = require("./play_adventure");
const play_good_1 = require("./play_good");
const play_bad_1 = require("./play_bad");
/////////////////////
function create(SEC) {
    return sec_1.get_lib_SEC(SEC).xTry('create', ({ enforce_immutability }) => {
        let state = {
            schema_version: consts_1.SCHEMA_VERSION,
            revision: 0,
            uuid: uuid_1.generate_uuid(),
            creation_date: timestamps_1.get_human_readable_UTC_timestamp_minutes(),
            avatar: CharacterState.create(SEC),
            inventory: InventoryState.create(),
            wallet: WalletState.create(),
            prng: PRNGState.create(),
            energy: EnergyState.create(),
            codes: CodesState.create(),
            last_adventure: null,
            click_count: 0,
            good_click_count: 0,
            meaningful_interaction_count: 0,
        };
        let rng = state_prng_1.get_prng(state.prng);
        const starting_weapon = logic_weapons_1.create(rng, {
            base_hid: 'spoon',
            qualifier1_hid: 'used',
            qualifier2_hid: 'noob',
            quality: definitions_1.ItemQuality.common,
            base_strength: 1,
        });
        state = play_adventure_1.receive_item(state, starting_weapon);
        state = equip_item(state, starting_weapon.uuid);
        const starting_armor = logic_armors_1.create(rng, {
            base_hid: 'socks',
            qualifier1_hid: 'used',
            qualifier2_hid: 'noob',
            quality: 'common',
            base_strength: 1,
        });
        state = play_adventure_1.receive_item(state, starting_armor);
        state = equip_item(state, starting_armor.uuid);
        //state.prng = PRNGState.update_use_count(state.prng, rng)
        state = Object.assign({}, state, { 
            // to compensate sub-functions use during build
            meaningful_interaction_count: 0, 
            // idem, could have been inc by internally calling actions
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
// note: allows passing an explicit adventure archetype for testing
function play(state, explicit_adventure_archetype_hid) {
    const energy_snapshot = EnergyState.get_snapshot(state.energy);
    const intermediate_state = (energy_snapshot.available_energy < 1)
        ? Object.assign({}, play_bad_1.play_bad(state, explicit_adventure_archetype_hid), { energy: EnergyState.loose_all_energy(state.energy) }) : Object.assign({}, play_good_1.play_good(state, explicit_adventure_archetype_hid), { energy: EnergyState.use_energy(state.energy) });
    state = Object.assign({}, intermediate_state, { revision: state.revision + 1, click_count: state.click_count + 1, meaningful_interaction_count: state.meaningful_interaction_count + 1 });
    return state;
}
exports.play = play;
function equip_item(state, uuid) {
    state = Object.assign({}, state, { inventory: InventoryState.equip_item(state.inventory, uuid), 
        // TODO count it as a meaningful interaction only if positive (or with a limit)
        meaningful_interaction_count: state.meaningful_interaction_count + 1, revision: state.revision + 1 });
    return state;
}
exports.equip_item = equip_item;
function sell_item(state, uuid) {
    const price = selectors_1.appraise_item_value(state, uuid);
    state = Object.assign({}, state, { inventory: InventoryState.remove_item_from_unslotted(state.inventory, uuid), wallet: WalletState.add_amount(state.wallet, state_wallet_1.Currency.coin, price), 
        // TODO count it as a meaningful interaction only if positive (or with a limit)
        meaningful_interaction_count: state.meaningful_interaction_count + 1, revision: state.revision + 1 });
    return state;
}
exports.sell_item = sell_item;
function rename_avatar(state, new_name) {
    state = Object.assign({}, state, { avatar: state_character_1.rename(sec_1.get_lib_SEC(), state.avatar, new_name), 
        // TODO count it as a meaningful interaction only once
        meaningful_interaction_count: state.meaningful_interaction_count + 1, revision: state.revision + 1 });
    return state;
}
exports.rename_avatar = rename_avatar;
function change_avatar_class(state, new_class) {
    state = Object.assign({}, state, { avatar: state_character_1.switch_class(sec_1.get_lib_SEC(), state.avatar, new_class), 
        // TODO count it as a meaningful interaction only if positive (or with a limit)
        meaningful_interaction_count: state.meaningful_interaction_count + 1, revision: state.revision + 1 });
    return state;
}
exports.change_avatar_class = change_avatar_class;
function redeem_code(state, code) {
    const infos = {
        good_play_count: state.good_click_count,
        is_alpha_player: true,
        is_player_since_alpha: true,
    };
    state = Object.assign({}, state, { codes: CodesState.redeem_code(sec_1.get_lib_SEC(), state.codes, code, infos), 
        // TODO count it as a meaningful interaction only if positive (or with a limit)
        meaningful_interaction_count: state.meaningful_interaction_count + 1, revision: state.revision + 1 });
    return state;
}
exports.redeem_code = redeem_code;
/////////////////////
//# sourceMappingURL=state.js.map