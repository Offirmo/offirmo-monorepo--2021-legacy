"use strict";
/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_string_enums_1 = require("typescript-string-enums");
const deepFreeze = require("deep-freeze-strict");
const consts_1 = require("./consts");
const types_1 = require("./types");
exports.CharacterAttribute = types_1.CharacterAttribute;
exports.CharacterClass = types_1.CharacterClass;
const sec_1 = require("./sec");
/////////////////////
const CHARACTER_ATTRIBUTES = typescript_string_enums_1.Enum.keys(types_1.CharacterAttribute);
exports.CHARACTER_ATTRIBUTES = CHARACTER_ATTRIBUTES;
const CHARACTER_ATTRIBUTES_SORTED = [
    'level',
    'health',
    'mana',
    'strength',
    'agility',
    'charisma',
    'wisdom',
    'luck',
];
exports.CHARACTER_ATTRIBUTES_SORTED = CHARACTER_ATTRIBUTES_SORTED;
sec_1.get_SEC().xTry('boot checks', () => {
    if (CHARACTER_ATTRIBUTES.length !== CHARACTER_ATTRIBUTES_SORTED.length)
        throw new Error(`CHARACTER_ATTRIBUTES to update!`);
});
const CHARACTER_CLASSES = typescript_string_enums_1.Enum.keys(types_1.CharacterClass);
exports.CHARACTER_CLASSES = CHARACTER_CLASSES;
///////
function create(SEC) {
    return sec_1.get_SEC(SEC).xTry('create', ({ enforce_immutability }) => {
        return enforce_immutability({
            schema_version: consts_1.SCHEMA_VERSION,
            revision: 0,
            name: '[anonymous]',
            klass: types_1.CharacterClass.novice,
            attributes: {
                level: 1,
                // TODO improve this
                health: 1,
                mana: 0,
                strength: 1,
                agility: 1,
                charisma: 1,
                wisdom: 1,
                luck: 1
            },
        });
    });
}
exports.create = create;
/////////////////////
function rename(SEC, state, new_name) {
    return sec_1.get_SEC(SEC).xTry('rename', ({ enforce_immutability }) => {
        if (!new_name)
            throw new Error(`Error while renaming to "${new_name}: invalid target value!`); // TODO details
        if (new_name === state.name)
            return state;
        return enforce_immutability(Object.assign({}, state, { name: new_name, revision: state.revision + 1 }));
    });
}
exports.rename = rename;
function switch_class(SEC, state, klass) {
    return sec_1.get_SEC(SEC).xTry('switch_class', ({ enforce_immutability }) => {
        if (klass === state.klass)
            return state;
        return enforce_immutability(Object.assign({}, state, { klass, revision: state.revision + 1 }));
    });
}
exports.switch_class = switch_class;
function increase_stat(SEC, state, stat, amount = 1) {
    return sec_1.get_SEC(SEC).xTry('increase_stat', ({ enforce_immutability }) => {
        if (amount <= 0)
            throw new Error(`Error while increasing stat "${stat}": invalid amount!`); // TODO details
        // TODO stats caps
        return enforce_immutability(Object.assign({}, state, { attributes: Object.assign({}, state.attributes, { [stat]: state.attributes[stat] + amount }), revision: state.revision + 1 }));
    });
}
exports.increase_stat = increase_stat;
/////////////////////
// needed to test migrations, both here and in composing parents
// a full featured, non-trivial demo state
// needed for demos
const DEMO_STATE = deepFreeze({
    schema_version: 2,
    revision: 42,
    name: 'Perte',
    klass: types_1.CharacterClass.paladin,
    attributes: {
        level: 13,
        health: 12,
        mana: 23,
        strength: 4,
        agility: 5,
        charisma: 6,
        wisdom: 7,
        luck: 8,
    },
});
exports.DEMO_STATE = DEMO_STATE;
// the oldest format we can migrate from
// must correspond to state above
const OLDEST_LEGACY_STATE_FOR_TESTS = deepFreeze({
    // no schema_version = 0
    name: 'Perte',
    klass: 'paladin',
    characteristics: {
        level: 13,
        health: 12,
        mana: 23,
        strength: 4,
        agility: 5,
        charisma: 6,
        wisdom: 7,
        luck: 8,
    },
});
exports.OLDEST_LEGACY_STATE_FOR_TESTS = OLDEST_LEGACY_STATE_FOR_TESTS;
// some hints may be needed to migrate to demo state
const MIGRATION_HINTS_FOR_TESTS = deepFreeze({
    to_v2: {
        revision: 42
    },
});
exports.MIGRATION_HINTS_FOR_TESTS = MIGRATION_HINTS_FOR_TESTS;
/////////////////////
//# sourceMappingURL=state.js.map