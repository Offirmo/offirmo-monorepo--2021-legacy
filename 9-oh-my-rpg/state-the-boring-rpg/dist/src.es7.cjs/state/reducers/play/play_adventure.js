"use strict";
/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const uuid_1 = require("@offirmo/uuid");
const random_1 = require("@offirmo/random");
/////////////////////
const definitions_1 = require("@oh-my-rpg/definitions");
const state_character_1 = require("@oh-my-rpg/state-character");
const InventoryState = tslib_1.__importStar(require("@oh-my-rpg/state-inventory"));
const PRNGState = tslib_1.__importStar(require("@oh-my-rpg/state-prng"));
const state_prng_1 = require("@oh-my-rpg/state-prng");
const logic_weapons_1 = require("@oh-my-rpg/logic-weapons");
const logic_armors_1 = require("@oh-my-rpg/logic-armors");
const logic_monsters_1 = require("@oh-my-rpg/logic-monsters");
const logic_adventures_1 = require("@oh-my-rpg/logic-adventures");
const consts_1 = require("../../../consts");
const base_1 = require("../base");
/////////////////////
const STATS = ['health', 'mana', 'strength', 'agility', 'charisma', 'wisdom', 'luck'];
const PRIMARY_STATS_BY_CLASS = {
    [state_character_1.CharacterClass.novice]: ['health', 'mana', 'strength', 'agility', 'charisma', 'wisdom', 'luck'],
    [state_character_1.CharacterClass.warrior]: ['strength'],
    [state_character_1.CharacterClass.barbarian]: ['strength'],
    [state_character_1.CharacterClass.paladin]: ['strength', 'mana'],
    [state_character_1.CharacterClass.sculptor]: ['agility'],
    [state_character_1.CharacterClass.pirate]: ['luck'],
    [state_character_1.CharacterClass.ninja]: ['agility'],
    [state_character_1.CharacterClass.rogue]: ['agility'],
    [state_character_1.CharacterClass.wizard]: ['mana'],
    [state_character_1.CharacterClass.hunter]: ['agility'],
    [state_character_1.CharacterClass.druid]: ['wisdom', 'mana'],
    [state_character_1.CharacterClass.priest]: ['charisma', 'mana'],
};
const SECONDARY_STATS_BY_CLASS = {
    [state_character_1.CharacterClass.novice]: ['health', 'mana', 'strength', 'agility', 'charisma', 'wisdom', 'luck'],
    [state_character_1.CharacterClass.warrior]: ['health'],
    [state_character_1.CharacterClass.barbarian]: ['health'],
    [state_character_1.CharacterClass.paladin]: ['health'],
    [state_character_1.CharacterClass.sculptor]: ['charisma'],
    [state_character_1.CharacterClass.pirate]: ['charisma'],
    [state_character_1.CharacterClass.ninja]: ['health'],
    [state_character_1.CharacterClass.rogue]: ['luck'],
    [state_character_1.CharacterClass.wizard]: ['wisdom'],
    [state_character_1.CharacterClass.hunter]: ['strength'],
    [state_character_1.CharacterClass.druid]: ['strength'],
    [state_character_1.CharacterClass.priest]: ['wisdom'],
};
function _instantiate_adventure_archetype(rng, aa, character, inventory) {
    let { hid, good, type, outcome } = aa;
    let should_gain = Object.assign({}, outcome);
    // instantiate the special gains
    if (should_gain.random_attribute) {
        const stat = random_1.Random.pick(rng, STATS);
        should_gain[stat] = true;
    }
    if (should_gain.lowest_attribute) {
        const lowest_stat = STATS.reduce((acc, val) => {
            return character.attributes[acc] < character.attributes[val] ? acc : val;
        }, 'health');
        should_gain[lowest_stat] = true;
    }
    if (should_gain.class_primary_attribute) {
        const stat = random_1.Random.pick(rng, PRIMARY_STATS_BY_CLASS[character.klass]);
        should_gain[stat] = true;
    }
    if (should_gain.class_secondary_attribute) {
        const stat = random_1.Random.pick(rng, SECONDARY_STATS_BY_CLASS[character.klass]);
        should_gain[stat] = true;
    }
    if (should_gain.armor_or_weapon) {
        // TODO take into account the existing inventory?
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
    const new_player_level = character.attributes.level + (should_gain.level ? 1 : 0);
    // TODO check multiple charac gain (should not happen)
    return {
        uuid: uuid_1.generate_uuid(),
        hid,
        good,
        encounter: type === logic_adventures_1.AdventureType.fight ? logic_monsters_1.create(rng, { level: character.attributes.level }) : undefined,
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
/////////////////////
function play_adventure(state, aa) {
    const rng = state_prng_1.get_prng(state.prng);
    const adventure = _instantiate_adventure_archetype(rng, aa, state.avatar, state.inventory);
    state = Object.assign({}, state, { last_adventure: adventure });
    const { gains: gained } = adventure;
    let gain_count = 0;
    let item_gain_count = 0;
    if (gained.level) {
        gain_count++;
        state = base_1._receive_stat_increase(state, state_character_1.CharacterAttribute.level);
    }
    if (gained.health) {
        gain_count++;
        state = base_1._receive_stat_increase(state, state_character_1.CharacterAttribute.health, gained.health);
    }
    if (gained.mana) {
        gain_count++;
        state = base_1._receive_stat_increase(state, state_character_1.CharacterAttribute.mana, gained.mana);
    }
    if (gained.strength) {
        gain_count++;
        state = base_1._receive_stat_increase(state, state_character_1.CharacterAttribute.strength, gained.strength);
    }
    if (gained.agility) {
        gain_count++;
        state = base_1._receive_stat_increase(state, state_character_1.CharacterAttribute.agility, gained.agility);
    }
    if (gained.charisma) {
        gain_count++;
        state = base_1._receive_stat_increase(state, state_character_1.CharacterAttribute.charisma, gained.charisma);
    }
    if (gained.wisdom) {
        gain_count++;
        state = base_1._receive_stat_increase(state, state_character_1.CharacterAttribute.wisdom, gained.wisdom);
    }
    if (gained.luck) {
        gain_count++;
        state = base_1._receive_stat_increase(state, state_character_1.CharacterAttribute.luck, gained.luck);
    }
    if (gained.coin) {
        gain_count++;
        state = base_1._receive_coins(state, gained.coin);
    }
    if (gained.token) {
        gain_count++;
        state = base_1._receive_tokens(state, gained.token);
    }
    if (gained.weapon) {
        gain_count++;
        item_gain_count++;
        state = base_1._receive_item(state, gained.weapon);
    }
    if (gained.armor) {
        gain_count++;
        item_gain_count++;
        state = base_1._receive_item(state, gained.armor);
    }
    if (gained.weapon_improvement) {
        gain_count++;
        let weapon_to_enhance = InventoryState.get_item_in_slot(state.inventory, definitions_1.InventorySlot.weapon);
        if (weapon_to_enhance && weapon_to_enhance.enhancement_level < logic_weapons_1.MAX_ENHANCEMENT_LEVEL)
            logic_weapons_1.enhance(weapon_to_enhance);
        // TODO immutable instead of in-place
        // TODO enhance another weapon as fallback
    }
    if (gained.armor_improvement) {
        gain_count++;
        const armor_to_enhance = InventoryState.get_item_in_slot(state.inventory, definitions_1.InventorySlot.armor);
        if (armor_to_enhance && armor_to_enhance.enhancement_level < logic_armors_1.MAX_ENHANCEMENT_LEVEL)
            logic_armors_1.enhance(armor_to_enhance);
        // TODO immutable instead of in-place
        // TODO enhance another armor as fallback
    }
    if (aa.good && !gain_count) {
        //dump_pretty_json('Error NO gain!', {aa, adventure})
        throw new Error(`${consts_1.LIB}: play_adventure() for "good click" hid "${aa.hid}" unexpectedly resulted in NO gains!`);
    }
    if (item_gain_count > 1) {
        //dump_pretty_json('Error 2x item gain!', {aa, adventure})
        throw new Error(`${consts_1.LIB}: play_adventure() for hid "${aa.hid}" unexpectedly resulted in ${item_gain_count} item gains!`);
    }
    state = Object.assign({}, state, { prng: PRNGState.update_use_count(state.prng, rng, {
            // we can't know because it depends on the adventure,
            // ex. generate a random weapon
            I_swear_I_really_cant_know_whether_the_rng_was_used: true
        }) });
    return state;
}
exports.play_adventure = play_adventure;
/////////////////////
//# sourceMappingURL=play_adventure.js.map