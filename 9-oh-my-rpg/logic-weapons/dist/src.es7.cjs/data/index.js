"use strict";
/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const types_1 = require("../types");
const i18n_en_1 = tslib_1.__importDefault(require("./i18n_en"));
const entries_1 = require("./entries");
/////////////////////
const i18n_messages = {
    en: i18n_en_1.default,
};
exports.i18n_messages = i18n_messages;
/////////////////////
const WEAPON_BASES = entries_1.ENTRIES.filter((armor_component) => armor_component.type === types_1.WeaponPartType.base);
exports.WEAPON_BASES = WEAPON_BASES;
const WEAPON_QUALIFIERS1 = entries_1.ENTRIES.filter((armor_component) => armor_component.type === types_1.WeaponPartType.qualifier1);
exports.WEAPON_QUALIFIERS1 = WEAPON_QUALIFIERS1;
const WEAPON_QUALIFIERS2 = entries_1.ENTRIES.filter((armor_component) => armor_component.type === types_1.WeaponPartType.qualifier2);
exports.WEAPON_QUALIFIERS2 = WEAPON_QUALIFIERS2;
//# sourceMappingURL=index.js.map