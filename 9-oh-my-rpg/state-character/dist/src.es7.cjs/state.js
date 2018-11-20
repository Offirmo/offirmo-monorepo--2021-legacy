"use strict";
/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_string_enums_1 = require("typescript-string-enums");
const consts_1 = require("./consts");
const types_1 = require("./types");
exports.CharacterAttribute = types_1.CharacterAttribute;
exports.CharacterClass = types_1.CharacterClass;
const sec_1 = require("./sec");
/////////////////////
const DEFAULT_AVATAR_NAME = '[anonymous]';
exports.DEFAULT_AVATAR_NAME = DEFAULT_AVATAR_NAME;
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
sec_1.get_lib_SEC().xTry('boot checks', () => {
    if (CHARACTER_ATTRIBUTES.length !== CHARACTER_ATTRIBUTES_SORTED.length)
        throw new Error('CHARACTER_ATTRIBUTES to update!');
});
const CHARACTER_CLASSES = typescript_string_enums_1.Enum.keys(types_1.CharacterClass);
exports.CHARACTER_CLASSES = CHARACTER_CLASSES;
///////
function create(SEC) {
    return sec_1.get_lib_SEC(SEC).xTry('create', ({ enforce_immutability }) => {
        return enforce_immutability({
            schema_version: consts_1.SCHEMA_VERSION,
            revision: 0,
            name: DEFAULT_AVATAR_NAME,
            klass: types_1.CharacterClass.novice,
            attributes: {
                level: 1,
                // TODO improve this one day
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
    return sec_1.get_lib_SEC(SEC).xTry('rename', ({ enforce_immutability }) => {
        // TODO name normalization
        if (!new_name)
            throw new Error(`Error while renaming to "${new_name}: invalid target value!`); // TODO details
        if (new_name === state.name)
            return state;
        return enforce_immutability(Object.assign({}, state, { name: new_name, revision: state.revision + 1 }));
    });
}
exports.rename = rename;
function switch_class(SEC, state, klass) {
    return sec_1.get_lib_SEC(SEC).xTry('switch_class', ({ enforce_immutability }) => {
        if (klass === state.klass)
            return state;
        return enforce_immutability(Object.assign({}, state, { klass, revision: state.revision + 1 }));
    });
}
exports.switch_class = switch_class;
function increase_stat(SEC, state, stat, amount = 1) {
    return sec_1.get_lib_SEC(SEC).xTry('increase_stat', ({ enforce_immutability }) => {
        if (amount <= 0)
            throw new Error(`Error while increasing stat "${stat}": invalid amount!`); // TODO details
        // TODO stats caps?
        return enforce_immutability(Object.assign({}, state, { attributes: Object.assign({}, state.attributes, { [stat]: state.attributes[stat] + amount }), revision: state.revision + 1 }));
    });
}
exports.increase_stat = increase_stat;
/////////////////////
//# sourceMappingURL=state.js.map