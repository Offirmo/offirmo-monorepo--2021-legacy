/////////////////////
import deepFreeze from 'deep-freeze-strict';
import * as Character from '@oh-my-rpg/state-character';
import * as Inventory from '@oh-my-rpg/state-inventory';
import * as Wallet from '@oh-my-rpg/state-wallet';
import * as PRNG from '@oh-my-rpg/state-prng';
import * as Energy from '@oh-my-rpg/state-energy';
import * as Engagement from '@oh-my-rpg/state-engagement';
import * as Codes from '@oh-my-rpg/state-codes';
import * as Progress from '@oh-my-rpg/state-progress';
import { DEMO_WEAPON_1 } from '@oh-my-rpg/logic-weapons';
import { DEMO_MONSTER_01 } from '@oh-my-rpg/logic-monsters';
/*
import {
    CoinsGain,
    OutcomeArchetype,
    AdventureType,
    AdventureArchetype,

    get_archetype,
    pick_random_good_archetype,
    pick_random_bad_archetype,
    generate_random_coin_gain,
} from '@oh-my-rpg/logic-adventures'
*/
/////////////////////
import { SCHEMA_VERSION } from './consts';
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
    uuid: "uu1EO9VgTjPlR1YPj0yfdWjG",
    creation_date: "20180813_00h33",
    schema_version: SCHEMA_VERSION,
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
    click_count: 92,
    good_click_count: 86,
});
// the oldest format we can migrate from
// must correspond to state above
const OLDEST_LEGACY_STATE_FOR_TESTS = deepFreeze({
    'schema_version': 4,
    'revision': 203,
    'avatar': {
        'schema_version': 2,
        'revision': 42,
        'name': 'Perte',
        'klass': 'paladin',
        'attributes': {
            'level': 13,
            'health': 12,
            'mana': 23,
            'strength': 4,
            'agility': 5,
            'charisma': 6,
            'wisdom': 7,
            'luck': 8
        }
    },
    'inventory': {
        'schema_version': 1,
        'revision': 42,
        'unslotted_capacity': 20,
        'slotted': {
            'armor': {
                'uuid': 'uu1~test~demo~armor~0002',
                'element_type': 'item',
                'slot': 'armor',
                'base_hid': 'belt',
                'qualifier1_hid': 'brass',
                'qualifier2_hid': 'apprentice',
                'quality': 'legendary',
                'base_strength': 19,
                'enhancement_level': 8
            },
            'weapon': {
                'uuid': 'uu1~test~demo~weapon~001',
                'element_type': 'item',
                'slot': 'weapon',
                'base_hid': 'axe',
                'qualifier1_hid': 'admirable',
                'qualifier2_hid': 'adjudicator',
                'quality': 'uncommon',
                'base_strength': 2,
                'enhancement_level': 0
            }
        },
        'unslotted': [
            {
                'uuid': 'uu1~test~demo~weapon~002',
                'element_type': 'item',
                'slot': 'weapon',
                'base_hid': 'bow',
                'qualifier1_hid': 'arcanic',
                'qualifier2_hid': 'ambassador',
                'quality': 'legendary',
                'base_strength': 19,
                'enhancement_level': 8
            },
            {
                'uuid': 'uu1~test~demo~armor~0001',
                'element_type': 'item',
                'slot': 'armor',
                'base_hid': 'armguards',
                'qualifier1_hid': 'bone',
                'qualifier2_hid': 'ancients',
                'quality': 'uncommon',
                'base_strength': 2,
                'enhancement_level': 0
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
    'wallet': {
        'schema_version': 1,
        'revision': 42,
        'coin_count': 23456,
        'token_count': 89
    },
    'prng': {
        'schema_version': 1,
        'revision': 108,
        'seed': 1234,
        'use_count': 107
    },
    'last_adventure': {
        'hid': 'fight_lost_any',
        'uuid': 'uu1de1~EVAdXlW5_p23Ro4OH',
        'good': true,
        'encounter': {
            'name': 'chicken',
            'level': 7,
            'rank': 'elite',
            'possible_emoji': '🐓'
        },
        'gains': {
            'level': 0,
            'health': 0,
            'mana': 0,
            'strength': 0,
            'agility': 0,
            'charisma': 0,
            'wisdom': 0,
            'luck': 1,
            'coin': 0,
            'token': 0,
            'armor': null,
            'weapon': null,
            'armor_improvement': false,
            'weapon_improvement': false
        }
    },
    'click_count': 86,
    'good_click_count': 86,
});
// some hints may be needed to migrate to demo state
const MIGRATION_HINTS_FOR_TESTS = deepFreeze({
    to_v5: {},
    avatar: Character.MIGRATION_HINTS_FOR_TESTS,
    inventory: Inventory.MIGRATION_HINTS_FOR_TESTS,
    wallet: Wallet.MIGRATION_HINTS_FOR_TESTS,
    prng: PRNG.MIGRATION_HINTS_FOR_TESTS,
    energy: Energy.MIGRATION_HINTS_FOR_TESTS,
    engagement: Engagement.MIGRATION_HINTS_FOR_TESTS,
    codes: Codes.MIGRATION_HINTS_FOR_TESTS,
    progress: Progress.MIGRATION_HINTS_FOR_TESTS,
});
/////////////////////
export { DEMO_ADVENTURE_01, DEMO_ADVENTURE_02, DEMO_ADVENTURE_03, DEMO_ADVENTURE_04, DEMO_STATE, OLDEST_LEGACY_STATE_FOR_TESTS, MIGRATION_HINTS_FOR_TESTS, };
/////////////////////
//# sourceMappingURL=examples.js.map