/////////////////////
import * as deepFreeze from 'deep-freeze-strict';
/////////////////////
import { ItemQuality, } from '@oh-my-rpg/definitions';
import * as MetaState from '@oh-my-rpg/state-meta';
import * as CharacterState from '@oh-my-rpg/state-character';
import { rename, switch_class, } from '@oh-my-rpg/state-character';
import * as WalletState from '@oh-my-rpg/state-wallet';
import { Currency } from '@oh-my-rpg/state-wallet';
import * as InventoryState from '@oh-my-rpg/state-inventory';
import * as PRNGState from '@oh-my-rpg/state-prng';
import { get_prng, generate_random_seed, } from '@oh-my-rpg/state-prng';
import { create as create_weapon, DEMO_WEAPON_1, } from '@oh-my-rpg/logic-weapons';
import { create as create_armor, } from '@oh-my-rpg/logic-armors';
import { DEMO_MONSTER_01, } from '@oh-my-rpg/logic-monsters';
import { appraise, } from '@oh-my-rpg/logic-shop';
import { SCHEMA_VERSION } from './consts';
import { GainType, } from './types';
import { play_good, receive_item } from './play';
import { get_SEC } from './sec';
/////////////////////
function appraise_item(state, uuid) {
    const item_to_sell = InventoryState.get_item(state.inventory, uuid);
    if (!item_to_sell)
        throw new Error('Sell: No item!');
    return appraise(item_to_sell);
}
///////
function create() {
    let state = {
        schema_version: SCHEMA_VERSION,
        revision: 0,
        meta: MetaState.create(),
        avatar: CharacterState.create(get_SEC()),
        inventory: InventoryState.create(),
        wallet: WalletState.create(),
        prng: PRNGState.create(),
        last_adventure: null,
        click_count: 0,
        good_click_count: 0,
        meaningful_interaction_count: 0,
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
    //state.prng = PRNGState.update_use_count(state.prng, rng)
    state.meaningful_interaction_count = 0; // to compensate sub-functions use
    state.revision = 0; // could have been inc by internally calling actions
    return state;
}
function reseed(state, seed) {
    seed = seed || generate_random_seed();
    state.prng = PRNGState.set_seed(state.prng, seed);
    return state;
}
// note: allows passing an explicit adventure archetype for testing
function play(state, explicit_adventure_archetype_hid) {
    state.click_count++;
    // TODO good / bad
    state = play_good(state, explicit_adventure_archetype_hid);
    state.revision++;
    return state;
}
function equip_item(state, uuid) {
    state.inventory = InventoryState.equip_item(state.inventory, uuid);
    // TODO count it as a meaningful interaction only if positive (or with a limit)
    state.meaningful_interaction_count++;
    state.revision++;
    return state;
}
function sell_item(state, uuid) {
    const price = appraise_item(state, uuid);
    state.inventory = InventoryState.remove_item_from_unslotted(state.inventory, uuid);
    state.wallet = WalletState.add_amount(state.wallet, Currency.coin, price);
    // TODO count it as a meaningful interaction only if positive (or with a limit)
    state.meaningful_interaction_count++;
    state.revision++;
    return state;
}
function rename_avatar(state, new_name) {
    state.avatar = rename(get_SEC(), state.avatar, new_name);
    // TODO count it as a meaningful interaction once
    state.meaningful_interaction_count++;
    state.revision++;
    return state;
}
function change_avatar_class(state, klass) {
    // TODO make this have an effect (in v2 ?)
    state.avatar = switch_class(get_SEC(), state.avatar, klass);
    // TODO count it as a meaningful interaction only if positive (or with a limit)
    state.meaningful_interaction_count++;
    state.revision++;
    return state;
}
/////////////////////
// needed to test migrations, both here and in composing parents
// a full featured, non-trivial demo state
// with dev gain
const DEMO_ADVENTURE_01 = deepFreeze({
    hid: 'fight_lost_any',
    uuid: 'uu1de1~EVAdXlW5_p23Ro4OH',
    good: true,
    encounter: DEMO_MONSTER_01,
    gains: {
        level: 0,
        health: 0,
        mana: 0,
        strength: 0,
        agility: 0,
        charisma: 0,
        wisdom: 0,
        luck: 1,
        coin: 0,
        token: 0,
        armor: null,
        weapon: null,
        armor_improvement: false,
        weapon_improvement: false,
    },
});
// with coin gain
const DEMO_ADVENTURE_02 = deepFreeze({
    hid: 'dying_man',
    uuid: 'uu1de2~p23Ro4OH_EVAdXlW5',
    good: true,
    gains: {
        level: 0,
        health: 0,
        mana: 0,
        strength: 0,
        agility: 0,
        charisma: 0,
        wisdom: 0,
        luck: 0,
        coin: 1234,
        token: 0,
        weapon: null,
        armor: null,
        weapon_improvement: false,
        armor_improvement: false,
    }
});
// with loot gain
const DEMO_ADVENTURE_03 = deepFreeze({
    hid: 'rare_goods_seller',
    uuid: 'uu1de2~p23Ro4OH_EVAdXlW5',
    good: true,
    gains: {
        level: 0,
        health: 0,
        mana: 0,
        strength: 0,
        agility: 0,
        charisma: 0,
        wisdom: 0,
        luck: 0,
        coin: 0,
        token: 0,
        weapon: DEMO_WEAPON_1,
        armor: null,
        weapon_improvement: false,
        armor_improvement: false,
    }
});
// with weapon enhancement gain
const DEMO_ADVENTURE_04 = deepFreeze({
    hid: 'princess',
    uuid: 'uu1de2~p23Ro4OH_EVAdXlW5',
    good: true,
    gains: {
        level: 0,
        health: 0,
        mana: 0,
        strength: 0,
        agility: 0,
        charisma: 0,
        wisdom: 0,
        luck: 0,
        coin: 123,
        token: 0,
        weapon: null,
        armor: null,
        weapon_improvement: false,
        armor_improvement: true,
    }
});
const DEMO_STATE = deepFreeze({
    schema_version: 4,
    revision: 203,
    meta: MetaState.DEMO_STATE,
    avatar: CharacterState.DEMO_STATE,
    inventory: InventoryState.DEMO_STATE,
    wallet: WalletState.DEMO_STATE,
    prng: PRNGState.DEMO_STATE,
    last_adventure: DEMO_ADVENTURE_01,
    click_count: 86,
    good_click_count: 86,
    meaningful_interaction_count: 86,
});
// the oldest format we can migrate from
// must correspond to state above
const OLDEST_LEGACY_STATE_FOR_TESTS = deepFreeze({
    "schema_version": 4,
    "revision": 203,
    "meta": {
        "schema_version": 1,
        "revision": 5,
        "uuid": "uu1dgqu3h0FydqWyQ~6cYv3g",
        "name": "Offirmo",
        "email": "offirmo.net@gmail.com",
        "allow_telemetry": false
    },
    "avatar": {
        "schema_version": 2,
        "revision": 42,
        "name": "Perte",
        "klass": "paladin",
        "attributes": {
            "level": 13,
            "health": 12,
            "mana": 23,
            "strength": 4,
            "agility": 5,
            "charisma": 6,
            "wisdom": 7,
            "luck": 8
        }
    },
    "inventory": {
        "schema_version": 1,
        "revision": 42,
        "unslotted_capacity": 20,
        "slotted": {
            "armor": {
                "uuid": "uu1~test~demo~armor~0002",
                "element_type": "item",
                "slot": "armor",
                "base_hid": "belt",
                "qualifier1_hid": "brass",
                "qualifier2_hid": "apprentice",
                "quality": "legendary",
                "base_strength": 19,
                "enhancement_level": 8
            },
            "weapon": {
                "uuid": "uu1~test~demo~weapon~001",
                "element_type": "item",
                "slot": "weapon",
                "base_hid": "axe",
                "qualifier1_hid": "admirable",
                "qualifier2_hid": "adjudicator",
                "quality": "uncommon",
                "base_strength": 2,
                "enhancement_level": 0
            }
        },
        "unslotted": [
            {
                "uuid": "uu1~test~demo~weapon~002",
                "element_type": "item",
                "slot": "weapon",
                "base_hid": "bow",
                "qualifier1_hid": "arcanic",
                "qualifier2_hid": "ambassador",
                "quality": "legendary",
                "base_strength": 19,
                "enhancement_level": 8
            },
            {
                "uuid": "uu1~test~demo~armor~0001",
                "element_type": "item",
                "slot": "armor",
                "base_hid": "armguards",
                "qualifier1_hid": "bone",
                "qualifier2_hid": "ancients",
                "quality": "uncommon",
                "base_strength": 2,
                "enhancement_level": 0
            },
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null
        ]
    },
    "wallet": {
        "schema_version": 1,
        "revision": 42,
        "coin_count": 23456,
        "token_count": 89
    },
    "prng": {
        "schema_version": 1,
        "revision": 108,
        "seed": 1234,
        "use_count": 107
    },
    "last_adventure": {
        "hid": "fight_lost_any",
        "uuid": "uu1de1~EVAdXlW5_p23Ro4OH",
        "good": true,
        "encounter": {
            "name": "chicken",
            "level": 7,
            "rank": "elite",
            "possible_emoji": "🐓"
        },
        "gains": {
            "level": 0,
            "health": 0,
            "mana": 0,
            "strength": 0,
            "agility": 0,
            "charisma": 0,
            "wisdom": 0,
            "luck": 1,
            "coin": 0,
            "token": 0,
            "armor": null,
            "weapon": null,
            "armor_improvement": false,
            "weapon_improvement": false
        }
    },
    "click_count": 86,
    "good_click_count": 86,
    "meaningful_interaction_count": 86
});
// some hints may be needed to migrate to demo state
const MIGRATION_HINTS_FOR_TESTS = deepFreeze({
    to_v5: {},
    meta: MetaState.MIGRATION_HINTS_FOR_TESTS,
    avatar: CharacterState.MIGRATION_HINTS_FOR_TESTS,
    inventory: InventoryState.MIGRATION_HINTS_FOR_TESTS,
    wallet: WalletState.MIGRATION_HINTS_FOR_TESTS,
    prng: PRNGState.MIGRATION_HINTS_FOR_TESTS,
});
/////////////////////
export { GainType, appraise_item, create, reseed, play, equip_item, sell_item, rename_avatar, change_avatar_class, DEMO_ADVENTURE_01, DEMO_ADVENTURE_02, DEMO_ADVENTURE_03, DEMO_ADVENTURE_04, DEMO_STATE, OLDEST_LEGACY_STATE_FOR_TESTS, MIGRATION_HINTS_FOR_TESTS, };
/////////////////////
//# sourceMappingURL=state.js.map