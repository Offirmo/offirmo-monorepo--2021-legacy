/////////////////////
import { get_human_readable_UTC_timestamp_minutes } from '@offirmo/timestamps';
import { generate_uuid } from '@offirmo/uuid';
/////////////////////
import { ItemQuality } from '@oh-my-rpg/definitions';
import * as CharacterState from '@oh-my-rpg/state-character';
import { rename, switch_class, } from '@oh-my-rpg/state-character';
import * as WalletState from '@oh-my-rpg/state-wallet';
import { Currency } from '@oh-my-rpg/state-wallet';
import * as InventoryState from '@oh-my-rpg/state-inventory';
import * as EnergyState from '@oh-my-rpg/state-energy';
import * as EngagementState from '@oh-my-rpg/state-engagement';
import * as PRNGState from '@oh-my-rpg/state-prng';
import { get_prng, generate_random_seed, } from '@oh-my-rpg/state-prng';
import { create as create_weapon, } from '@oh-my-rpg/logic-weapons';
import { create as create_armor, } from '@oh-my-rpg/logic-armors';
import * as CodesState from '@oh-my-rpg/state-codes';
/////////////////////
import { SCHEMA_VERSION } from '../consts';
import { EngagementKey } from '../engagement';
import { appraise_item_value, get_energy_snapshot, } from '../selectors';
import { get_lib_SEC } from '../sec';
import { receive_item } from './play_adventure';
import { play_good } from './play_good';
import { play_bad } from './play_bad';
/////////////////////
function create(SEC) {
    return get_lib_SEC(SEC).xTry('create', ({ enforce_immutability }) => {
        let state = {
            schema_version: SCHEMA_VERSION,
            revision: 0,
            uuid: generate_uuid(),
            creation_date: get_human_readable_UTC_timestamp_minutes(),
            avatar: CharacterState.create(SEC),
            inventory: InventoryState.create(),
            wallet: WalletState.create(),
            prng: PRNGState.create(),
            energy: EnergyState.create(),
            engagement: EngagementState.create(SEC),
            codes: CodesState.create(SEC),
            last_adventure: null,
            click_count: 0,
            good_click_count: 0,
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
function reseed(state, seed) {
    seed = seed || generate_random_seed();
    state = Object.assign({}, state, { prng: PRNGState.set_seed(state.prng, seed) });
    return state;
}
// note: allows passing an explicit adventure archetype for testing
function play(state, explicit_adventure_archetype_hid) {
    const energy_snapshot = EnergyState.get_snapshot(state.energy);
    const intermediate_state = (energy_snapshot.available_energy < 1)
        ? Object.assign({}, play_bad(state, explicit_adventure_archetype_hid), { energy: EnergyState.loose_all_energy(state.energy) }) : Object.assign({}, play_good(state, explicit_adventure_archetype_hid), { energy: EnergyState.use_energy(state.energy) });
    state = Object.assign({}, intermediate_state, { revision: state.revision + 1, click_count: state.click_count + 1 });
    return state;
}
function equip_item(state, uuid) {
    state = Object.assign({}, state, { inventory: InventoryState.equip_item(state.inventory, uuid), revision: state.revision + 1 });
    return state;
}
function sell_item(state, uuid) {
    const price = appraise_item_value(state, uuid);
    state = Object.assign({}, state, { inventory: InventoryState.remove_item_from_unslotted(state.inventory, uuid), wallet: WalletState.add_amount(state.wallet, Currency.coin, price), revision: state.revision + 1 });
    return state;
}
function rename_avatar(state, new_name) {
    state = Object.assign({}, state, { avatar: rename(get_lib_SEC(), state.avatar, new_name), revision: state.revision + 1 });
    return state;
}
function change_avatar_class(state, new_class) {
    state = Object.assign({}, state, { avatar: switch_class(get_lib_SEC(), state.avatar, new_class), revision: state.revision + 1 });
    return state;
}
function attempt_to_redeem_code(state, code) {
    const infos = {
        has_energy_depleted: get_energy_snapshot(state).available_energy < 1,
        good_play_count: state.good_click_count,
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
                        name: 'flow from TESTNOTIFS',
                    }) });
                state = Object.assign({}, state, { engagement: EngagementState.enqueue(state.engagement, {
                        type: EngagementState.EngagementType.aside,
                        key: EngagementKey['hello_world--aside'],
                    }, {
                        name: 'aside from TESTNOTIFS',
                    }) });
                state = Object.assign({}, state, { engagement: EngagementState.enqueue(state.engagement, {
                        type: EngagementState.EngagementType.warning,
                        key: EngagementKey['hello_world--warning'],
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
function acknowledge_engagement_msg_seen(state, key) {
    return Object.assign({}, state, { engagement: EngagementState.acknowledge_seen(state.engagement, key), revision: state.revision + 1 });
}
/////////////////////
export { create, reseed, play, equip_item, sell_item, rename_avatar, change_avatar_class, attempt_to_redeem_code, acknowledge_engagement_msg_seen, };
/////////////////////
//# sourceMappingURL=state.js.map