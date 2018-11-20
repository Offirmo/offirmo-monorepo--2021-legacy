"use strict";
/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const deep_freeze_strict_1 = tslib_1.__importDefault(require("deep-freeze-strict"));
const Character = tslib_1.__importStar(require("@oh-my-rpg/state-character"));
const Inventory = tslib_1.__importStar(require("@oh-my-rpg/state-inventory"));
const Wallet = tslib_1.__importStar(require("@oh-my-rpg/state-wallet"));
const PRNG = tslib_1.__importStar(require("@oh-my-rpg/state-prng"));
const Energy = tslib_1.__importStar(require("@oh-my-rpg/state-energy"));
const Engagement = tslib_1.__importStar(require("@oh-my-rpg/state-engagement"));
const Codes = tslib_1.__importStar(require("@oh-my-rpg/state-codes"));
const Progress = tslib_1.__importStar(require("@oh-my-rpg/state-progress"));
const logic_weapons_1 = require("@oh-my-rpg/logic-weapons");
const logic_monsters_1 = require("@oh-my-rpg/logic-monsters");
/////////////////////
const consts_1 = require("./consts");
/////////////////////
// needed to test migrations, both here and in composing parents
// a full featured, non-trivial demo state
// with dev gain
const DEMO_ADVENTURE_01 = deep_freeze_strict_1.default({
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
const DEMO_ADVENTURE_02 = deep_freeze_strict_1.default({
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
const DEMO_ADVENTURE_03 = deep_freeze_strict_1.default({
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
const DEMO_ADVENTURE_04 = deep_freeze_strict_1.default({
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
const DEMO_STATE = deep_freeze_strict_1.default({
    uuid: "uu1EO9VgTjPlR1YPj0yfdWjG",
    creation_date: "20180813_00h33",
    schema_version: consts_1.SCHEMA_VERSION,
    revision: 203,
    avatar: Character.DEMO_STATE,
    inventory: Inventory.DEMO_STATE,
    wallet: Wallet.DEMO_STATE,
    prng: PRNG.DEMO_STATE,
    energy: Energy.DEMO_STATE,
    engagement: Engagement.DEMO_STATE,
    codes: Codes.DEMO_STATE,
    progress: Progress.DEMO_STATE,
    last_adventure: DEMO_ADVENTURE_01,
});
exports.DEMO_STATE = DEMO_STATE;
/////////////////////
//# sourceMappingURL=examples.js.map