/////////////////////
import { Enum } from 'typescript-string-enums';
import { SCHEMA_VERSION } from './consts';
import { CharacterAttribute, CharacterClass, } from './types';
import { get_lib_SEC } from './sec';
/////////////////////
const CHARACTER_ATTRIBUTES = Enum.keys(CharacterAttribute);
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
get_lib_SEC().xTry('boot checks', () => {
    if (CHARACTER_ATTRIBUTES.length !== CHARACTER_ATTRIBUTES_SORTED.length)
        throw new Error('CHARACTER_ATTRIBUTES to update!');
});
const CHARACTER_CLASSES = Enum.keys(CharacterClass);
///////
function create(SEC) {
    return get_lib_SEC(SEC).xTry('create', ({ enforce_immutability }) => {
        return enforce_immutability({
            schema_version: SCHEMA_VERSION,
            revision: 0,
            name: '[anonymous]',
            klass: CharacterClass.novice,
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
/////////////////////
function rename(SEC, state, new_name) {
    return get_lib_SEC(SEC).xTry('rename', ({ enforce_immutability }) => {
        // TODO name normalization
        if (!new_name)
            throw new Error(`Error while renaming to "${new_name}: invalid target value!`); // TODO details
        if (new_name === state.name)
            return state;
        return enforce_immutability(Object.assign({}, state, { name: new_name, revision: state.revision + 1 }));
    });
}
function switch_class(SEC, state, klass) {
    return get_lib_SEC(SEC).xTry('switch_class', ({ enforce_immutability }) => {
        if (klass === state.klass)
            return state;
        return enforce_immutability(Object.assign({}, state, { klass, revision: state.revision + 1 }));
    });
}
function increase_stat(SEC, state, stat, amount = 1) {
    return get_lib_SEC(SEC).xTry('increase_stat', ({ enforce_immutability }) => {
        if (amount <= 0)
            throw new Error(`Error while increasing stat "${stat}": invalid amount!`); // TODO details
        // TODO stats caps
        return enforce_immutability(Object.assign({}, state, { attributes: Object.assign({}, state.attributes, { [stat]: state.attributes[stat] + amount }), revision: state.revision + 1 }));
    });
}
/////////////////////
export { CharacterAttribute, CharacterClass, CHARACTER_ATTRIBUTES, CHARACTER_ATTRIBUTES_SORTED, CHARACTER_CLASSES, create, rename, switch_class, increase_stat, };
/////////////////////
//# sourceMappingURL=state.js.map