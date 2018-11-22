/////////////////////
import { Enum } from 'typescript-string-enums';
import invariant from 'tiny-invariant';
import { Random } from '@offirmo/random';
import { get_human_readable_UTC_timestamp_minutes } from '@offirmo/timestamps';
import { generate_uuid } from '@offirmo/uuid';
/////////////////////
import { ItemQuality } from '@oh-my-rpg/definitions';
import * as CharacterState from '@oh-my-rpg/state-character';
import { CharacterClass, rename, switch_class, } from '@oh-my-rpg/state-character';
import * as WalletState from '@oh-my-rpg/state-wallet';
import * as InventoryState from '@oh-my-rpg/state-inventory';
import * as EnergyState from '@oh-my-rpg/state-energy';
import * as EngagementState from '@oh-my-rpg/state-engagement';
import * as PRNGState from '@oh-my-rpg/state-prng';
import * as CodesState from '@oh-my-rpg/state-codes';
import * as ProgressState from '@oh-my-rpg/state-progress';
import { Currency } from '@oh-my-rpg/state-wallet';
import { get_prng, generate_random_seed, } from '@oh-my-rpg/state-prng';
import { create as create_weapon, } from '@oh-my-rpg/logic-weapons';
import { create as create_armor, } from '@oh-my-rpg/logic-armors';
/////////////////////
import { SCHEMA_VERSION } from '../../consts';
import { EngagementKey } from '../../engagement';
import { appraise_item_value, get_energy_snapshot, is_inventory_full, } from '../../selectors';
import { get_lib_SEC } from '../../sec';
import { receive_item } from './play/play_adventure';
import { play_good } from './play/play_good';
import { play_bad } from './play/play_bad';
import { _refresh_achievements } from './achievements';
/////////////////////
function create(SEC) {
    return get_lib_SEC(SEC).xTry('create', ({ enforce_immutability }) => {
        let state = {
            schema_version: SCHEMA_VERSION,
            revision: 0,
            uuid: generate_uuid(),
            creation_date: get_human_readable_UTC_timestamp_minutes(),
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
        let rng = get_prng(state.prng);
        const starting_weapon = create_weapon(rng, {
            base_hid: 'spoon',
            qualifier1_hid: 'used',
            qualifier2_hid: 'noob',
            quality: ItemQuality.common,
            base_strength: 1,
        });
        state = receive_item(state, starting_weapon);
        state = equip_item(state, starting_weapon.uuid);
        const starting_armor = create_armor(rng, {
            base_hid: 'socks',
            qualifier1_hid: 'used',
            qualifier2_hid: 'noob',
            quality: 'common',
            base_strength: 1,
        });
        state = receive_item(state, starting_armor);
        state = equip_item(state, starting_armor.uuid);
        state = _refresh_achievements(state); // there are some initial achievements
        // reset engagements that may have been created by noisy initial achievements
        state = Object.assign({}, state, { engagement: Object.assign({}, state.engagement, { queue: [] }) });
        // now insert some relevant start engagements
        state = Object.assign({}, state, { engagement: EngagementState.enqueue(state.engagement, {
                type: EngagementState.EngagementType.flow,
                key: EngagementKey['tip--first_play']
            }) });
        //state.prng = PRNGState.update_use_count(state.prng, rng)
        state = Object.assign({}, state, { 
            // to compensate sub-functions use during build
            revision: 0 });
        return enforce_immutability(state);
    });
}
function on_start_session(state) {
    // 1. statistics (may trigger achievements)
    state = Object.assign({}, state, { progress: ProgressState.on_start_session(state.progress), revision: state.revision + 1 });
    // 2. new achievements may have appeared
    return _refresh_achievements(state);
}
// note: allows passing an explicit adventure archetype for testing
function play(state, explicit_adventure_archetype_hid) {
    const energy_snapshot = EnergyState.get_snapshot(state.energy);
    const good = energy_snapshot.available_energy >= 1;
    state = good
        ? Object.assign({}, play_good(state, explicit_adventure_archetype_hid), { energy: EnergyState.use_energy(state.energy) }) : Object.assign({}, play_bad(state, explicit_adventure_archetype_hid), { energy: EnergyState.loose_all_energy(state.energy) });
    state = Object.assign({}, state, { progress: ProgressState.on_played(state.progress, {
            good,
            adventure_key: state.last_adventure.hid,
            encountered_monster_key: state.last_adventure.encounter
                ? state.last_adventure.encounter.name
                : null,
            active_class: state.avatar.klass,
        }), revision: state.revision + 1 });
    //console.log(state.progress)
    return _refresh_achievements(state);
}
function equip_item(state, uuid) {
    state = Object.assign({}, state, { inventory: InventoryState.equip_item(state.inventory, uuid), revision: state.revision + 1 });
    return _refresh_achievements(state);
}
function sell_item(state, uuid) {
    const price = appraise_item_value(state, uuid);
    state = Object.assign({}, state, { inventory: InventoryState.remove_item_from_unslotted(state.inventory, uuid), wallet: WalletState.add_amount(state.wallet, Currency.coin, price), revision: state.revision + 1 });
    return _refresh_achievements(state);
}
function rename_avatar(state, new_name) {
    state = Object.assign({}, state, { avatar: rename(get_lib_SEC(), state.avatar, new_name), revision: state.revision + 1 });
    return _refresh_achievements(state);
}
function change_avatar_class(state, new_class) {
    state = Object.assign({}, state, { avatar: switch_class(get_lib_SEC(), state.avatar, new_class), revision: state.revision + 1 });
    return _refresh_achievements(state);
}
function attempt_to_redeem_code(state, code) {
    const infos = {
        has_energy_depleted: get_energy_snapshot(state).available_energy < 1,
        good_play_count: state.progress.statistics.good_play_count,
        is_alpha_player: true,
        is_player_since_alpha: true,
    };
    let engagement_key = EngagementKey['code_redemption--failed'];
    let engagement_params = {};
    if (!CodesState.is_code_redeemable(state.codes, code, infos)) {
    }
    else {
        state = Object.assign({}, state, { codes: CodesState.redeem_code(get_lib_SEC(), state.codes, code, infos) });
        code = CodesState.normalize_code(code);
        engagement_key = EngagementKey['code_redemption--succeeded'];
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
                        key: EngagementKey['hello_world--flow'],
                    }, {
                        // TODO make flow have semantic levels as well!
                        name: 'flow from TESTNOTIFS',
                    }) });
                state = Object.assign({}, state, { engagement: EngagementState.enqueue(state.engagement, {
                        type: EngagementState.EngagementType.aside,
                        key: EngagementKey['hello_world--aside'],
                    }, {
                        name: 'aside default from TESTNOTIFS',
                    }) });
                state = Object.assign({}, state, { engagement: EngagementState.enqueue(state.engagement, {
                        type: EngagementState.EngagementType.aside,
                        key: EngagementKey['hello_world--aside'],
                    }, {
                        semantic_level: 'error',
                        name: 'aside error from TESTNOTIFS',
                    }) });
                state = Object.assign({}, state, { engagement: EngagementState.enqueue(state.engagement, {
                        type: EngagementState.EngagementType.aside,
                        key: EngagementKey['hello_world--aside'],
                    }, {
                        semantic_level: 'warning',
                        name: 'aside warning from TESTNOTIFS',
                    }) });
                state = Object.assign({}, state, { engagement: EngagementState.enqueue(state.engagement, {
                        type: EngagementState.EngagementType.aside,
                        key: EngagementKey['hello_world--aside'],
                    }, {
                        semantic_level: 'info',
                        name: 'aside info from TESTNOTIFS',
                    }) });
                state = Object.assign({}, state, { engagement: EngagementState.enqueue(state.engagement, {
                        type: EngagementState.EngagementType.aside,
                        key: EngagementKey['hello_world--aside'],
                    }, {
                        semantic_level: 'success',
                        name: 'aside success from TESTNOTIFS',
                    }) });
                state = Object.assign({}, state, { engagement: EngagementState.enqueue(state.engagement, {
                        type: EngagementState.EngagementType.warning,
                        key: EngagementKey['hello_world--warning'],
                    }, {
                        name: 'warning from TESTNOTIFS',
                    }) });
                break;
            case 'TESTACH':
                // this will auto-re-gain this achievement
                state = Object.assign({}, state, { progress: ProgressState.on_achieved(state.progress, 'TEST', ProgressState.AchievementStatus.revealed) });
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
    return _refresh_achievements(Object.assign({}, state, { engagement: EngagementState.enqueue(state.engagement, {
            type: EngagementState.EngagementType.flow,
            key: engagement_key,
        }, engagement_params), revision: state.revision + 1 }));
}
function acknowledge_engagement_msg_seen(state, uid) {
    return Object.assign({}, state, { engagement: EngagementState.acknowledge_seen(state.engagement, uid), revision: state.revision + 1 });
}
/////////////////////
function reseed(state, seed) {
    seed = seed || generate_random_seed();
    state = Object.assign({}, state, { prng: PRNGState.set_seed(state.prng, seed) });
    return state;
}
function autogroom(state, options = {}) {
    invariant(!options.class_hint || Enum.isType(CharacterClass, options.class_hint), 'invalid class hint!');
    let change_made = false; // so far
    // User
    // User class
    if (state.avatar.klass === CharacterClass.novice) {
        // change class
        let new_class = options.class_hint || Random.pick(Random.engines.nativeMath, Enum.values(CharacterClass));
        state = change_avatar_class(state, new_class);
    }
    // inventory
    // better gear
    //const better_weapon =
    // inventory full
    if (is_inventory_full(state)) {
        // sell stuff
        // TODO
    }
}
// will use up to 1 energy and do everything needed
function autoplay(state, options) {
    // use 1 energy on what's needed the most
}
/*
 (() => {
            const rng = get_prng(state.prng)

            const new_class = Random.pick(Random.engines.nativeMath, Enum.values(CharacterClass))

            state = {
                ...state,
                prng: PRNGState.update_use_count(state.prng, rng)
            }

            return new_class
        })()
 */
/////////////////////
export { create, on_start_session, reseed, play, equip_item, sell_item, rename_avatar, change_avatar_class, attempt_to_redeem_code, acknowledge_engagement_msg_seen, };
/////////////////////
//# sourceMappingURL=state.js.map