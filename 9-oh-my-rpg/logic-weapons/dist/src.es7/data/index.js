/////////////////////
import { WeaponPartType } from '../types';
import en from './i18n_en';
import { ENTRIES } from './entries';
/////////////////////
const i18n_messages = {
    en,
};
/////////////////////
const WEAPON_BASES = ENTRIES.filter((armor_component) => armor_component.type === WeaponPartType.base);
const WEAPON_QUALIFIERS1 = ENTRIES.filter((armor_component) => armor_component.type === WeaponPartType.qualifier1);
const WEAPON_QUALIFIERS2 = ENTRIES.filter((armor_component) => armor_component.type === WeaponPartType.qualifier2);
/////////////////////
export { i18n_messages, WEAPON_BASES, WEAPON_QUALIFIERS1, WEAPON_QUALIFIERS2, };
//# sourceMappingURL=index.js.map