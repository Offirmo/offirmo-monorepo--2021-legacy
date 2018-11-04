"use strict";
/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const typescript_string_enums_1 = require("typescript-string-enums");
const tiny_invariant_1 = tslib_1.__importDefault(require("tiny-invariant"));
const random_1 = require("@offirmo/random");
const timestamps_1 = require("@offirmo/timestamps");
const uuid_1 = require("@offirmo/uuid");
/////////////////////
const definitions_1 = require("@oh-my-rpg/definitions");
const CharacterState = tslib_1.__importStar(require("@oh-my-rpg/state-character"));
const state_character_1 = require("@oh-my-rpg/state-character");
const WalletState = tslib_1.__importStar(require("@oh-my-rpg/state-wallet"));
const InventoryState = tslib_1.__importStar(require("@oh-my-rpg/state-inventory"));
const EnergyState = tslib_1.__importStar(require("@oh-my-rpg/state-energy"));
const EngagementState = tslib_1.__importStar(require("@oh-my-rpg/state-engagement"));
const PRNGState = tslib_1.__importStar(require("@oh-my-rpg/state-prng"));
const CodesState = tslib_1.__importStar(require("@oh-my-rpg/state-codes"));
const ProgressState = tslib_1.__importStar(require("@oh-my-rpg/state-progress"));
const state_wallet_1 = require("@oh-my-rpg/state-wallet");
const state_prng_1 = require("@oh-my-rpg/state-prng");
const logic_weapons_1 = require("@oh-my-rpg/logic-weapons");
const logic_armors_1 = require("@oh-my-rpg/logic-armors");
/////////////////////
const consts_1 = require("../../consts");
const engagement_1 = require("../../engagement");
const selectors_1 = require("../../selectors");
const sec_1 = require("../../sec");
const play_adventure_1 = require("./play/play_adventure");
const play_good_1 = require("./play/play_good");
const play_bad_1 = require("./play/play_bad");
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
            engagement: EngagementState.create(SEC),
            codes: CodesState.create(SEC),
            progress: ProgressState.create(SEC),
            last_adventure: null,
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
// note: allows passing an explicit adventure archetype for testing
function play(state, explicit_adventure_archetype_hid) {
    const energy_snapshot = EnergyState.get_snapshot(state.energy);
    const good = energy_snapshot.available_energy >= 1;
    state = good
        ? Object.assign({}, play_good_1.play_good(state, explicit_adventure_archetype_hid), { energy: EnergyState.use_energy(state.energy) }) : Object.assign({}, play_bad_1.play_bad(state, explicit_adventure_archetype_hid), { energy: EnergyState.loose_all_energy(state.energy) });
    state = Object.assign({}, state, { progress: ProgressState.on_played(state.progress, {
            good,
            adventure_key: state.last_adventure.hid,
            encountered_monster_key: state.last_adventure.encounter
                ? state.last_adventure.encounter.name
                : null,
            active_class: state.avatar.klass,
        }), revision: state.revision + 1 });
    //console.log(state.progress)
    return state;
}
exports.play = play;
function equip_item(state, uuid) {
    state = Object.assign({}, state, { inventory: InventoryState.equip_item(state.inventory, uuid), revision: state.revision + 1 });
    return state;
}
exports.equip_item = equip_item;
function sell_item(state, uuid) {
    const price = selectors_1.appraise_item_value(state, uuid);
    state = Object.assign({}, state, { inventory: InventoryState.remove_item_from_unslotted(state.inventory, uuid), wallet: WalletState.add_amount(state.wallet, state_wallet_1.Currency.coin, price), revision: state.revision + 1 });
    return state;
}
exports.sell_item = sell_item;
function rename_avatar(state, new_name) {
    state = Object.assign({}, state, { avatar: state_character_1.rename(sec_1.get_lib_SEC(), state.avatar, new_name), revision: state.revision + 1 });
    return state;
}
exports.rename_avatar = rename_avatar;
function change_avatar_class(state, new_class) {
    state = Object.assign({}, state, { avatar: state_character_1.switch_class(sec_1.get_lib_SEC(), state.avatar, new_class), revision: state.revision + 1 });
    return state;
}
exports.change_avatar_class = change_avatar_class;
function attempt_to_redeem_code(state, code) {
    const infos = {
        has_energy_depleted: selectors_1.get_energy_snapshot(state).available_energy < 1,
        good_play_count: state.progress.statistics.good_play_count,
        is_alpha_player: true,
        is_player_since_alpha: true,
    };
    let engagement_key = engagement_1.EngagementKey['code_redemption--failed'];
    let engagement_params = {};
    if (!CodesState.is_code_redeemable(state.codes, code, infos)) {
    }
    else {
        state = Object.assign({}, state, { codes: CodesState.redeem_code(sec_1.get_lib_SEC(), state.codes, code, infos) });
        code = CodesState.normalize_code(code);
        engagement_key = engagement_1.EngagementKey['code_redemption--succeeded'];
        engagement_params.code = code;
        switch (code) {
            case 'TESTNEVER':
            case 'TESTALWAYS':
            case 'TESTONCE':
            case 'TESTTWICE':
                // test codes which do nothing
                break;
            case 'TESTNOTIFS':
                state = Object.assign({}, state, { engagement: EngagementState.enqueue(state.engagement, {
                        type: EngagementState.EngagementType.flow,
                        key: engagement_1.EngagementKey['hello_world--flow'],
                    }, {
                        name: 'flow from TESTNOTIFS',
                    }) });
                state = Object.assign({}, state, { engagement: EngagementState.enqueue(state.engagement, {
                        type: EngagementState.EngagementType.aside,
                        key: engagement_1.EngagementKey['hello_world--aside'],
                    }, {
                        name: 'aside from TESTNOTIFS',
                    }) });
                state = Object.assign({}, state, { engagement: EngagementState.enqueue(state.engagement, {
                        type: EngagementState.EngagementType.warning,
                        key: engagement_1.EngagementKey['hello_world--warning'],
                    }, {
                        name: 'warning from TESTNOTIFS',
                    }) });
                break;
            case 'BORED':
                state = Object.assign({}, state, { energy: EnergyState.restore_energy(state.energy, 1.) });
                break;
            // TODO
            /*case 'REBORN': {

               }
               break
           case 'ALPHART': {

               }
               break*/
            default:
                throw new Error(`Internal error: code "${code}" not implemented!`);
        }
    }
    return Object.assign({}, state, { engagement: EngagementState.enqueue(state.engagement, {
            type: EngagementState.EngagementType.flow,
            key: engagement_key,
        }, engagement_params), revision: state.revision + 1 });
}
exports.attempt_to_redeem_code = attempt_to_redeem_code;
function acknowledge_engagement_msg_seen(state, key) {
    return Object.assign({}, state, { engagement: EngagementState.acknowledge_seen(state.engagement, key), revision: state.revision + 1 });
}
exports.acknowledge_engagement_msg_seen = acknowledge_engagement_msg_seen;
/////////////////////
function autogroom(state, options = {}) {
    tiny_invariant_1.default(!options.class_hint || typescript_string_enums_1.Enum.isType(state_character_1.CharacterClass, options.class_hint), 'invalid class hint!');
    let change_made = false; // so far
    // User
    // User class
    if (state.avatar.klass === state_character_1.CharacterClass.novice) {
        // change class
        let new_class = options.class_hint || random_1.Random.pick(random_1.Random.engines.nativeMath, typescript_string_enums_1.Enum.values(state_character_1.CharacterClass));
        state = change_avatar_class(state, new_class);
    }
    // inventory
    // better gear
    //const better_weapon =
    // inventory full
    if (selectors_1.is_inventory_full(state)) {
        // sell stuff
        // TODO
    }
}
// will use up to 1 energy and do everything needed
function autoplay(state, options) {
    // use 1 energy on what's needed the most
}
/////////////////////
//# sourceMappingURL=state.js.map