"use strict";
/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
const random_1 = require("@offirmo/random");
const deepFreeze = require("deep-freeze-strict");
/////////////////////
const definitions_1 = require("@oh-my-rpg/definitions");
const MetaState = require("@oh-my-rpg/state-meta");
const CharacterState = require("@oh-my-rpg/state-character");
const state_character_1 = require("@oh-my-rpg/state-character");
const WalletState = require("@oh-my-rpg/state-wallet");
const state_wallet_1 = require("@oh-my-rpg/state-wallet");
const InventoryState = require("@oh-my-rpg/state-inventory");
const state_inventory_1 = require("@oh-my-rpg/state-inventory");
const PRNGState = require("@oh-my-rpg/state-prng");
const state_prng_1 = require("@oh-my-rpg/state-prng");
const logic_weapons_1 = require("@oh-my-rpg/logic-weapons");
const logic_armors_1 = require("@oh-my-rpg/logic-armors");
const logic_monsters_1 = require("@oh-my-rpg/logic-monsters");
const logic_shop_1 = require("@oh-my-rpg/logic-shop");
const logic_adventures_1 = require("@oh-my-rpg/logic-adventures");
const consts_1 = require("./consts");
const types_1 = require("./types");
exports.GainType = types_1.GainType;
const sec_1 = require("./sec");
/////////////////////
function create() {
    let state = {
        schema_version: consts_1.SCHEMA_VERSION,
        revision: 0,
        meta: MetaState.create(),
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
    const start_weapon = logic_weapons_1.create(rng, {
        base_hid: 'spoon',
        qualifier1_hid: 'used',
        qualifier2_hid: 'noob',
        quality: definitions_1.ItemQuality.common,
        base_strength: 1,
    });
    state = receive_item(state, start_weapon);
    state = equip_item(state, 0);
    const start_armor = logic_armors_1.create(rng, {
        base_hid: 'socks',
        qualifier1_hid: 'used',
        qualifier2_hid: 'noob',
        quality: 'common',
        base_strength: 1,
    });
    state = receive_item(state, start_armor);
    state = equip_item(state, 0);
    //state.prng = PRNGState.update_use_count(state.prng, rng)
    state.meaningful_interaction_count = 0; // to compensate sub-functions use
    return state;
}
exports.create = create;
/////////////////////
// internal funcs
const STATS = ['health', 'mana', 'strength', 'agility', 'charisma', 'wisdom', 'luck'];
function instantiate_adventure_archetype(rng, aa, character, inventory) {
    let { hid, good, type, outcome: should_gain } = aa;
    should_gain = Object.assign({}, should_gain);
    // instantiate the special gains
    if (should_gain.random_charac) {
        const stat = random_1.Random.pick(rng, STATS);
        should_gain[stat] = true;
    }
    if (should_gain.lowest_charac) {
        const lowest_stat = STATS.reduce((acc, val) => {
            return character[acc] < character[val] ? acc : val;
        }, 'health');
        should_gain[lowest_stat] = true;
    }
    if (should_gain.armor_or_weapon) {
        // TODO take into account the existing inventory
        if (random_1.Random.bool()(rng))
            should_gain.armor = true;
        else
            should_gain.weapon = true;
    }
    if (should_gain.armor_or_weapon_improvement) {
        if (random_1.Random.bool()(rng))
            should_gain.armor_improvement = true;
        else
            should_gain.weapon_improvement = true;
    }
    // intermediate data
    const new_player_level = character.level + (should_gain.level ? 1 : 0);
    // TODO check multiple charac gain (should not happen)
    return {
        uuid: definitions_1.generate_uuid(),
        hid,
        good,
        encounter: type === logic_adventures_1.AdventureType.fight ? logic_monsters_1.create(rng, { level: character.level }) : undefined,
        gains: {
            level: should_gain.level ? 1 : 0,
            health: should_gain.health ? 1 : 0,
            mana: should_gain.mana ? 1 : 0,
            strength: should_gain.strength ? 1 : 0,
            agility: should_gain.agility ? 1 : 0,
            charisma: should_gain.charisma ? 1 : 0,
            wisdom: should_gain.wisdom ? 1 : 0,
            luck: should_gain.luck ? 1 : 0,
            coin: logic_adventures_1.generate_random_coin_gain(rng, should_gain.coin, new_player_level),
            token: should_gain.token ? 1 : 0,
            armor: should_gain.armor ? logic_armors_1.create(rng) : null,
            weapon: should_gain.weapon ? logic_weapons_1.create(rng) : null,
            armor_improvement: should_gain.armor_improvement,
            weapon_improvement: should_gain.weapon_improvement,
        }
    };
}
function receive_stat_increase(state, stat, amount = 1) {
    state.avatar = state_character_1.increase_stat(sec_1.get_SEC(), state.avatar, stat, amount);
    return state;
}
function receive_item(state, item) {
    // TODO handle inventory full
    state.inventory = InventoryState.add_item(state.inventory, item);
    return state;
}
function receive_coins(state, amount) {
    state.wallet = WalletState.add_amount(state.wallet, state_wallet_1.Currency.coin, amount);
    return state;
}
function receive_tokens(state, amount) {
    state.wallet = WalletState.add_amount(state.wallet, state_wallet_1.Currency.token, amount);
    return state;
}
function play_good(state, explicit_adventure_archetype_hid) {
    state.good_click_count++;
    state.meaningful_interaction_count++;
    let rng = state_prng_1.get_prng(state.prng);
    const aa = explicit_adventure_archetype_hid
        ? logic_adventures_1.get_archetype(explicit_adventure_archetype_hid)
        : logic_adventures_1.pick_random_good_archetype(rng);
    if (!aa)
        throw new Error(`play_good(): hinted adventure archetype "${explicit_adventure_archetype_hid}" could not be found!`);
    const adventure = instantiate_adventure_archetype(rng, aa, state.avatar.attributes, state.inventory);
    state.last_adventure = adventure;
    const { gains: gained } = adventure;
    // TODO store hid for no repetition
    let gain_count = 0;
    if (gained.level) {
        gain_count++;
        state = receive_stat_increase(state, state_character_1.CharacterAttribute.level);
    }
    if (gained.health) {
        gain_count++;
        state = receive_stat_increase(state, state_character_1.CharacterAttribute.health, gained.health);
    }
    if (gained.mana) {
        gain_count++;
        state = receive_stat_increase(state, state_character_1.CharacterAttribute.mana, gained.mana);
    }
    if (gained.strength) {
        gain_count++;
        state = receive_stat_increase(state, state_character_1.CharacterAttribute.strength, gained.strength);
    }
    if (gained.agility) {
        gain_count++;
        state = receive_stat_increase(state, state_character_1.CharacterAttribute.agility, gained.agility);
    }
    if (gained.charisma) {
        gain_count++;
        state = receive_stat_increase(state, state_character_1.CharacterAttribute.charisma, gained.charisma);
    }
    if (gained.wisdom) {
        gain_count++;
        state = receive_stat_increase(state, state_character_1.CharacterAttribute.wisdom, gained.wisdom);
    }
    if (gained.luck) {
        gain_count++;
        state = receive_stat_increase(state, state_character_1.CharacterAttribute.luck, gained.luck);
    }
    if (gained.coin) {
        gain_count++;
        state = receive_coins(state, gained.coin);
    }
    if (gained.token) {
        gain_count++;
        state = receive_tokens(state, gained.token);
    }
    if (gained.weapon) {
        gain_count++;
        state = receive_item(state, gained.weapon);
    }
    if (gained.armor) {
        gain_count++;
        state = receive_item(state, gained.armor);
    }
    if (gained.weapon_improvement) {
        gain_count++;
        let weapon_to_enhance = state_inventory_1.get_item_in_slot(state.inventory, definitions_1.InventorySlot.weapon);
        if (weapon_to_enhance && weapon_to_enhance.enhancement_level < logic_weapons_1.MAX_ENHANCEMENT_LEVEL)
            logic_weapons_1.enhance(weapon_to_enhance);
        // TODO enhance another weapon as fallback
    }
    if (gained.armor_improvement) {
        gain_count++;
        const armor_to_enhance = state_inventory_1.get_item_in_slot(state.inventory, definitions_1.InventorySlot.armor);
        if (armor_to_enhance && armor_to_enhance.enhancement_level < logic_armors_1.MAX_ENHANCEMENT_LEVEL)
            logic_armors_1.enhance(armor_to_enhance);
        // TODO enhance another armor as fallback
    }
    if (!gain_count)
        throw new Error(`play_good() for hid "${aa.hid}" unexpectedly resulted in NO gains!`);
    state.prng = PRNGState.update_use_count(state.prng, rng, {
        I_swear_I_really_cant_know_whether_the_rng_was_used: !!explicit_adventure_archetype_hid
    });
    return state;
}
function appraise_item_at_coordinates(state, coordinates) {
    const item_to_sell = state_inventory_1.get_item_at_coordinates(state.inventory, coordinates);
    if (!item_to_sell)
        throw new Error('Sell: No item!');
    return logic_shop_1.appraise(item_to_sell);
}
exports.appraise_item_at_coordinates = appraise_item_at_coordinates;
/////////////////////
function reseed(state, seed) {
    seed = seed || state_prng_1.generate_random_seed();
    state.prng = PRNGState.set_seed(state.prng, seed);
    return state;
}
exports.reseed = reseed;
// allow passing an explicit adventure archetype for testing !
function play(state, explicit_adventure_archetype_hid) {
    state.click_count++;
    // TODO good / bad
    return play_good(state, explicit_adventure_archetype_hid);
}
exports.play = play;
function equip_item(state, coordinates) {
    state.inventory = InventoryState.equip_item(state.inventory, coordinates);
    // TODO count it as a meaningful interaction only if positive (or with a limit)
    state.meaningful_interaction_count++;
    return state;
}
exports.equip_item = equip_item;
function sell_item(state, coordinates) {
    const price = appraise_item_at_coordinates(state, coordinates);
    state.inventory = InventoryState.remove_item(state.inventory, coordinates);
    state.wallet = WalletState.add_amount(state.wallet, state_wallet_1.Currency.coin, price);
    // TODO count it as a meaningful interaction only if positive (or with a limit)
    state.meaningful_interaction_count++;
    return state;
}
exports.sell_item = sell_item;
function rename_avatar(state, new_name) {
    state.avatar = state_character_1.rename(sec_1.get_SEC(), state.avatar, new_name);
    // TODO count it as a meaningful interaction once
    state.meaningful_interaction_count++;
    return state;
}
exports.rename_avatar = rename_avatar;
function change_avatar_class(state, klass) {
    // TODO make this have an effect (in v2 ?)
    state.avatar = state_character_1.switch_class(sec_1.get_SEC(), state.avatar, klass);
    // TODO count it as a meaningful interaction only if positive (or with a limit)
    state.meaningful_interaction_count++;
    return state;
}
exports.change_avatar_class = change_avatar_class;
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
exports.DEMO_STATE = DEMO_STATE;
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
exports.OLDEST_LEGACY_STATE_FOR_TESTS = OLDEST_LEGACY_STATE_FOR_TESTS;
// some hints may be needed to migrate to demo state
const MIGRATION_HINTS_FOR_TESTS = deepFreeze({
    to_v5: {},
    meta: MetaState.MIGRATION_HINTS_FOR_TESTS,
    avatar: CharacterState.MIGRATION_HINTS_FOR_TESTS,
    inventory: InventoryState.MIGRATION_HINTS_FOR_TESTS,
    wallet: WalletState.MIGRATION_HINTS_FOR_TESTS,
    prng: PRNGState.MIGRATION_HINTS_FOR_TESTS,
});
exports.MIGRATION_HINTS_FOR_TESTS = MIGRATION_HINTS_FOR_TESTS;
/////////////////////
//# sourceMappingURL=state.js.map