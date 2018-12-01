/////////////////////
import { Enum } from 'typescript-string-enums';
import { Random } from '@offirmo/random';
import { get_human_readable_UTC_timestamp_days } from '@offirmo/timestamps';
/////////////////////
import { ItemQuality, InventorySlot } from '@oh-my-rpg/definitions';
import * as CharacterState from '@oh-my-rpg/state-character';
import * as EngagementState from '@oh-my-rpg/state-engagement';
import * as EnergyState from '@oh-my-rpg/state-energy';
import { CharacterClass, } from '@oh-my-rpg/state-character';
import { matches as matches_weapon } from '@oh-my-rpg/logic-weapons';
import { matches as matches_armor } from '@oh-my-rpg/logic-armors';
import { is_inventory_full, find_better_unequipped_armor, find_better_unequipped_weapon, } from '../../selectors';
import { rename_avatar, change_avatar_class, equip_item, sell_item, } from './base';
import { play, } from './play';
import { STARTING_WEAPON_SPEC, STARTING_ARMOR_SPEC, } from './create';
/////////////////////
function _ack_all_engagements(state) {
    if (!state.engagement.queue.length)
        return state;
    return Object.assign({}, state, { engagement: EngagementState.acknowledge_all_seen(state.engagement), revision: state.revision + 1 });
}
function _autogroom(state, options) {
    const { DEBUG } = options;
    if (DEBUG)
        console.log(`  - Autogroom… (inventory holding ${state.inventory.unslotted.length} items)`);
    // User
    // User class
    if (state.avatar.klass === CharacterClass.novice) {
        // change class
        let new_class = Random.pick(Random.engines.nativeMath, Enum.values(CharacterClass));
        if (DEBUG)
            console.log(`    - Changing class to ${new_class}…`);
        state = change_avatar_class(state, new_class);
    }
    // User name
    if (state.avatar.name === CharacterState.DEFAULT_AVATAR_NAME) {
        let new_name = 'A' + state.uuid.slice(3);
        if (DEBUG)
            console.log(`    - renaming to ${new_name}…`);
        state = rename_avatar(state, new_name);
    }
    // inventory
    // equip best gear
    const better_weapon = find_better_unequipped_weapon(state);
    if (better_weapon) {
        state = equip_item(state, better_weapon.uuid);
    }
    const better_armor = find_better_unequipped_armor(state);
    if (better_armor) {
        state = equip_item(state, better_armor.uuid);
    }
    // inventory full
    if (is_inventory_full(state)) {
        if (DEBUG)
            console.log(`    Inventory is full (${state.inventory.unslotted.length} items)`);
        let freed_count = 0;
        // sell stuff, starting from the worst, but keeping the starting items (for sentimental reasons)
        Array.from(state.inventory.unslotted)
            .filter(e => !!e) // TODO useful?
            .reverse() // to put the lowest quality items first
            .forEach((e) => {
            switch (e.slot) {
                case InventorySlot.armor:
                    if (matches_armor(e, STARTING_ARMOR_SPEC))
                        return;
                    break;
                case InventorySlot.weapon:
                    if (matches_weapon(e, STARTING_WEAPON_SPEC))
                        return;
                    break;
                default:
                    break;
            }
            if (e.quality === ItemQuality.common || freed_count === 0) {
                //console.log('    - selling:', e)
                state = sell_item(state, e.uuid);
                freed_count++;
                return;
            }
        });
        if (freed_count === 0)
            throw new Error('Internal error: autogroom: inventory is full and couldnt free stuff!');
        if (DEBUG)
            console.log(`    Freed ${freed_count} items, inventory now holding ${state.inventory.unslotted.length} items.`);
    }
    // misc: ack the possible notifications
    state = _ack_all_engagements(state);
    return state;
}
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
        const from_now = Number(get_human_readable_UTC_timestamp_days()) - days_needed;
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
            state = play(state);
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
            state = play(state);
            state = _autogroom(state, options);
        }
    }
    // misc: ack the possible notifications
    state = _ack_all_engagements(state);
    return state;
}
/////////////////////
export { autoplay, };
//# sourceMappingURL=autoplay.js.map