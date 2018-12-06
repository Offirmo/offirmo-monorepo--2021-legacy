"use strict";
/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const typescript_string_enums_1 = require("typescript-string-enums");
const random_1 = require("@offirmo/random");
const timestamps_1 = require("@offirmo/timestamps");
/////////////////////
const definitions_1 = require("@oh-my-rpg/definitions");
const logic_shop_1 = require("@oh-my-rpg/logic-shop");
const CharacterState = tslib_1.__importStar(require("@oh-my-rpg/state-character"));
const EngagementState = tslib_1.__importStar(require("@oh-my-rpg/state-engagement"));
const EnergyState = tslib_1.__importStar(require("@oh-my-rpg/state-energy"));
const state_character_1 = require("@oh-my-rpg/state-character");
const logic_weapons_1 = require("@oh-my-rpg/logic-weapons");
const logic_armors_1 = require("@oh-my-rpg/logic-armors");
const selectors_1 = require("../../selectors");
const base_1 = require("./base");
const play_1 = require("./play");
const create_1 = require("./create");
/////////////////////
function compare_items_by_normalized_power(a, b) {
    const power_a = logic_shop_1.appraise_power_normalized(a);
    const power_b = logic_shop_1.appraise_power_normalized(b);
    return power_b - power_a;
}
function _ack_all_engagements(state) {
    if (!state.engagement.queue.length)
        return state;
    return Object.assign({}, state, { engagement: EngagementState.acknowledge_all_seen(state.engagement), revision: state.revision + 1 });
}
function _auto_make_room(state, options = {}) {
    const { DEBUG } = options;
    if (DEBUG)
        console.log(`  - _auto_make_room()… (inventory holding ${state.inventory.unslotted.length} items)`);
    // inventory full
    if (selectors_1.is_inventory_full(state)) {
        if (DEBUG)
            console.log(`    Inventory is full (${state.inventory.unslotted.length} items)`);
        let freed_count = 0;
        // sell stuff, starting from the worst, but keeping the starting items (for sentimental reasons)
        Array.from(state.inventory.unslotted)
            .filter((e) => {
            switch (e.slot) {
                case definitions_1.InventorySlot.armor:
                    if (logic_armors_1.matches(e, create_1.STARTING_ARMOR_SPEC))
                        return false;
                    break;
                case definitions_1.InventorySlot.weapon:
                    if (logic_weapons_1.matches(e, create_1.STARTING_WEAPON_SPEC))
                        return false;
                    break;
                default:
                    break;
            }
            return true;
        })
            .sort(compare_items_by_normalized_power)
            .reverse() // to put the lowest quality items first
            .forEach((e) => {
            //console.log(e.quality, e.slot, appraise_power_normalized(e))
            switch (e.slot) {
                case definitions_1.InventorySlot.armor:
                    if (logic_armors_1.matches(e, create_1.STARTING_ARMOR_SPEC))
                        return;
                    break;
                case definitions_1.InventorySlot.weapon:
                    if (logic_weapons_1.matches(e, create_1.STARTING_WEAPON_SPEC))
                        return;
                    break;
                default:
                    break;
            }
            if (e.quality === definitions_1.ItemQuality.common || freed_count === 0) {
                //console.log('    - selling:', e)
                state = base_1.sell_item(state, e.uuid);
                freed_count++;
                return;
            }
        });
        if (freed_count === 0)
            throw new Error('Internal error: _auto_make_room(): inventory is full and couldn’t free stuff!');
        if (DEBUG)
            console.log(`    Freed ${freed_count} items, inventory now holding ${state.inventory.unslotted.length} items.`);
    }
    return state;
}
exports._auto_make_room = _auto_make_room;
function _autogroom(state, options = {}) {
    const { DEBUG } = options;
    if (DEBUG)
        console.log(`  - Autogroom… (inventory holding ${state.inventory.unslotted.length} items)`);
    // User
    // User class
    if (state.avatar.klass === state_character_1.CharacterClass.novice) {
        // change class
        let new_class = random_1.Random.pick(random_1.Random.engines.nativeMath, typescript_string_enums_1.Enum.values(state_character_1.CharacterClass));
        if (DEBUG)
            console.log(`    - Changing class to ${new_class}…`);
        state = base_1.change_avatar_class(state, new_class);
    }
    // User name
    if (state.avatar.name === CharacterState.DEFAULT_AVATAR_NAME) {
        let new_name = 'A' + state.uuid.slice(3);
        if (DEBUG)
            console.log(`    - renaming to ${new_name}…`);
        state = base_1.rename_avatar(state, new_name);
    }
    // inventory
    // equip best gear
    const better_weapon = selectors_1.find_better_unequipped_weapon(state);
    if (better_weapon) {
        state = base_1.equip_item(state, better_weapon.uuid);
    }
    const better_armor = selectors_1.find_better_unequipped_armor(state);
    if (better_armor) {
        state = base_1.equip_item(state, better_armor.uuid);
    }
    // inventory full
    state = _auto_make_room(state, options);
    // misc: ack the possible notifications
    state = _ack_all_engagements(state);
    return state;
}
exports._autogroom = _autogroom;
/* Autoplay,
 * as efficiently as possible,
 * trying to restore as much achievements as possible
 */
function autoplay(state, options = {}) {
    let { target_good_play_count, target_bad_play_count, DEBUG } = options;
    if (DEBUG)
        console.log(`- Autoplay...`);
    target_good_play_count = target_good_play_count || 0;
    target_bad_play_count = target_bad_play_count || 0;
    if (target_good_play_count < 0)
        throw new Error('invalid target_good_play_count!');
    if (target_bad_play_count < 0)
        throw new Error('invalid target_bad_play_count!');
    if (target_good_play_count === 0 && target_bad_play_count === 0)
        target_good_play_count = state.progress.statistics.good_play_count + 1;
    let last_visited_timestamp_num = (() => {
        const days_needed = Math.ceil((target_good_play_count - state.progress.statistics.good_play_count) / 8);
        const from_now = Number(timestamps_1.get_human_readable_UTC_timestamp_days()) - days_needed;
        return Math.min(from_now, Number(state.progress.statistics.last_visited_timestamp));
    })();
    if (last_visited_timestamp_num !== Number(state.progress.statistics.last_visited_timestamp)) {
        state = Object.assign({}, state, { progress: Object.assign({}, state.progress, { statistics: Object.assign({}, state.progress.statistics, { last_visited_timestamp: String(last_visited_timestamp_num) }) }) });
    }
    state = _autogroom(state, options);
    // do we have energy?
    let energy_snapshot = EnergyState.get_snapshot(state.energy);
    let have_energy = energy_snapshot.available_energy >= 1;
    if (target_bad_play_count > state.progress.statistics.bad_play_count) {
        if (have_energy) {
            // deplete it
            state = Object.assign({}, state, { energy: EnergyState.loose_all_energy(state.energy) });
        }
        // play bad
        for (let i = state.progress.statistics.bad_play_count; i < target_bad_play_count; ++i) {
            if (DEBUG)
                console.log('  - playing bad...');
            state = play_1.play(state);
            state = _autogroom(state, options);
        }
    }
    if (target_good_play_count > state.progress.statistics.good_play_count) {
        // play good
        for (let i = state.progress.statistics.good_play_count; i < target_good_play_count; ++i) {
            energy_snapshot = EnergyState.get_snapshot(state.energy);
            have_energy = energy_snapshot.available_energy >= 1;
            if (!have_energy) {
                // replenish and pretend one day has passed
                last_visited_timestamp_num++;
                state = Object.assign({}, state, { energy: EnergyState.restore_energy(state.energy), progress: Object.assign({}, state.progress, { statistics: Object.assign({}, state.progress.statistics, { last_visited_timestamp: String(last_visited_timestamp_num) }) }) });
            }
            if (DEBUG)
                console.log('  - playing good...');
            state = play_1.play(state);
            state = _autogroom(state, options);
        }
    }
    // misc: ack the possible notifications
    state = _ack_all_engagements(state);
    return state;
}
exports.autoplay = autoplay;
//# sourceMappingURL=autoplay.js.map