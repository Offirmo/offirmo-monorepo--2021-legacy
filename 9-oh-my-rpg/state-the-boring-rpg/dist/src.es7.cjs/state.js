"use strict";
/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
const deepFreeze = require("deep-freeze-strict");
/////////////////////
const definitions_1 = require("@oh-my-rpg/definitions");
const CharacterState = require("@oh-my-rpg/state-character");
const state_character_1 = require("@oh-my-rpg/state-character");
const WalletState = require("@oh-my-rpg/state-wallet");
const state_wallet_1 = require("@oh-my-rpg/state-wallet");
const InventoryState = require("@oh-my-rpg/state-inventory");
const PRNGState = require("@oh-my-rpg/state-prng");
const state_prng_1 = require("@oh-my-rpg/state-prng");
const logic_weapons_1 = require("@oh-my-rpg/logic-weapons");
const logic_armors_1 = require("@oh-my-rpg/logic-armors");
const logic_monsters_1 = require("@oh-my-rpg/logic-monsters");
const logic_shop_1 = require("@oh-my-rpg/logic-shop");
/////////////////////
const consts_1 = require("./consts");
const types_1 = require("./types");
exports.GainType = types_1.GainType;
const serializable_actions_1 = require("./serializable_actions");
const play_1 = require("./play");
const sec_1 = require("./sec");
/////////////////////
function appraise_item(state, uuid) {
    const item_to_sell = InventoryState.get_item(state.inventory, uuid);
    if (!item_to_sell)
        throw new Error('Sell: No item!');
    return logic_shop_1.appraise(item_to_sell);
}
exports.appraise_item = appraise_item;
function find_element(state, uuid) {
    return InventoryState.get_item(state.inventory, uuid);
}
exports.find_element = find_element;
function get_actions_for_unslotted_item(state, uuid) {
    const actions = [];
    const equip = {
        type: serializable_actions_1.ActionType.equip_item,
        category: serializable_actions_1.ActionCategory.inventory,
        expected_state_revision: state.revision,
        target_uuid: uuid,
    };
    actions.push(equip);
    const sell = {
        type: serializable_actions_1.ActionType.sell_item,
        category: serializable_actions_1.ActionCategory.inventory,
        expected_state_revision: state.revision,
        target_uuid: uuid,
    };
    actions.push(sell);
    return actions;
}
function get_actions_for_element(state, uuid) {
    const actions = [];
    const as_unslotted_item = InventoryState.get_unslotted_item(state.inventory, uuid);
    if (as_unslotted_item)
        actions.push(...get_actions_for_unslotted_item(state, uuid));
    return actions;
}
exports.get_actions_for_element = get_actions_for_element;
///////
function create() {
    let state = {
        schema_version: consts_1.SCHEMA_VERSION,
        revision: 0,
        avatar: CharacterState.create(sec_1.get_SEC()),
        inventory: InventoryState.create(),
        wallet: WalletState.create(),
        prng: PRNGState.create(),
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
    state = play_1.receive_item(state, starting_weapon);
    state = equip_item(state, starting_weapon.uuid);
    const starting_armor = logic_armors_1.create(rng, {
        base_hid: 'socks',
        qualifier1_hid: 'used',
        qualifier2_hid: 'noob',
        quality: 'common',
        base_strength: 1,
    });
    state = play_1.receive_item(state, starting_armor);
    state = equip_item(state, starting_armor.uuid);
    //state.prng = PRNGState.update_use_count(state.prng, rng)
    state.meaningful_interaction_count = 0; // to compensate sub-functions use
    state.revision = 0; // could have been inc by internally calling actions
    return state;
}
exports.create = create;
function reseed(state, seed) {
    seed = seed || state_prng_1.generate_random_seed();
    state.prng = PRNGState.set_seed(state.prng, seed);
    return state;
}
exports.reseed = reseed;
// note: allows passing an explicit adventure archetype for testing
function play(state, explicit_adventure_archetype_hid) {
    state.click_count++;
    // TODO good / bad
    state = play_1.play_good(state, explicit_adventure_archetype_hid);
    state.revision++;
    return state;
}
exports.play = play;
function equip_item(state, uuid) {
    state.inventory = InventoryState.equip_item(state.inventory, uuid);
    // TODO count it as a meaningful interaction only if positive (or with a limit)
    state.meaningful_interaction_count++;
    state.revision++;
    return state;
}
exports.equip_item = equip_item;
function sell_item(state, uuid) {
    const price = appraise_item(state, uuid);
    state.inventory = InventoryState.remove_item_from_unslotted(state.inventory, uuid);
    state.wallet = WalletState.add_amount(state.wallet, state_wallet_1.Currency.coin, price);
    // TODO count it as a meaningful interaction only if positive (or with a limit)
    state.meaningful_interaction_count++;
    state.revision++;
    return state;
}
exports.sell_item = sell_item;
function rename_avatar(state, new_name) {
    state.avatar = state_character_1.rename(sec_1.get_SEC(), state.avatar, new_name);
    // TODO count it as a meaningful interaction once
    state.meaningful_interaction_count++;
    state.revision++;
    return state;
}
exports.rename_avatar = rename_avatar;
function change_avatar_class(state, new_class) {
    // TODO make this have an effect (in v2 ?)
    state.avatar = state_character_1.switch_class(sec_1.get_SEC(), state.avatar, new_class);
    // TODO count it as a meaningful interaction only if positive (or with a limit)
    state.meaningful_interaction_count++;
    state.revision++;
    return state;
}
exports.change_avatar_class = change_avatar_class;
/////////////////////
function execute(state, action) {
    const { expected_state_revision } = action;
    if (expected_state_revision) {
        if (state.revision !== expected_state_revision)
            throw new Error(`Trying to execute an outdated action!`);
    }
    switch (action.type) {
        case serializable_actions_1.ActionType.play:
            return play(state);
        case serializable_actions_1.ActionType.equip_item:
            return equip_item(state, action.target_uuid);
        case serializable_actions_1.ActionType.sell_item:
            return sell_item(state, action.target_uuid);
        case serializable_actions_1.ActionType.rename_avatar:
            return rename_avatar(state, action.new_name);
        case serializable_actions_1.ActionType.change_avatar_class:
            return change_avatar_class(state, action.new_class);
        default:
            throw new Error(`Unrecognized action!`);
    }
}
exports.execute = execute;
/////////////////////
// needed to test migrations, both here and in composing parents
// a full featured, non-trivial demo state
// with dev gain
const DEMO_ADVENTURE_01 = deepFreeze({
    hid: 'fight_lost_any',
    uuid: 'uu1de1~EVAdXlW5_p23Ro4OH',
    good: true,
    encounter: logic_monsters_1.DEMO_MONSTER_01,
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
exports.DEMO_ADVENTURE_01 = DEMO_ADVENTURE_01;
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
exports.DEMO_ADVENTURE_02 = DEMO_ADVENTURE_02;
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
        weapon: logic_weapons_1.DEMO_WEAPON_1,
        armor: null,
        weapon_improvement: false,
        armor_improvement: false,
    }
});
exports.DEMO_ADVENTURE_03 = DEMO_ADVENTURE_03;
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
exports.DEMO_ADVENTURE_04 = DEMO_ADVENTURE_04;
const DEMO_STATE = deepFreeze({
    schema_version: 4,
    revision: 203,
    avatar: CharacterState.DEMO_STATE,
    inventory: InventoryState.DEMO_STATE,
    wallet: WalletState.DEMO_STATE,
    prng: PRNGState.DEMO_STATE,
    last_adventure: DEMO_ADVENTURE_01,
    click_count: 86,
    good_click_count: 86,
    meaningful_interaction_count: 86,
});
exports.DEMO_STATE = DEMO_STATE;
// the oldest format we can migrate from
// must correspond to state above
const OLDEST_LEGACY_STATE_FOR_TESTS = deepFreeze({
    "schema_version": 4,
    "revision": 203,
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
exports.OLDEST_LEGACY_STATE_FOR_TESTS = OLDEST_LEGACY_STATE_FOR_TESTS;
// some hints may be needed to migrate to demo state
const MIGRATION_HINTS_FOR_TESTS = deepFreeze({
    to_v5: {},
    avatar: CharacterState.MIGRATION_HINTS_FOR_TESTS,
    inventory: InventoryState.MIGRATION_HINTS_FOR_TESTS,
    wallet: WalletState.MIGRATION_HINTS_FOR_TESTS,
    prng: PRNGState.MIGRATION_HINTS_FOR_TESTS,
});
exports.MIGRATION_HINTS_FOR_TESTS = MIGRATION_HINTS_FOR_TESTS;
/////////////////////
//# sourceMappingURL=state.js.map