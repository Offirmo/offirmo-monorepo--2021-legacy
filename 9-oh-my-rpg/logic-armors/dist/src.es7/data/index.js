import { ArmorPartType } from '../types';
import en from './i18n_en';
import { ENTRIES } from './entries';
/////////////////////
const i18n_messages = {
    en,
};
const ARMOR_BASES = ENTRIES.filter((armor_component) => armor_component.type === ArmorPartType.base);
const ARMOR_QUALIFIERS1 = ENTRIES.filter((armor_component) => armor_component.type === ArmorPartType.qualifier1);
const ARMOR_QUALIFIERS2 = ENTRIES.filter((armor_component) => armor_component.type === ArmorPartType.qualifier2);
export { i18n_messages, ARMOR_BASES, ARMOR_QUALIFIERS1, ARMOR_QUALIFIERS2, };
//# sourceMappingURL=index.js.map