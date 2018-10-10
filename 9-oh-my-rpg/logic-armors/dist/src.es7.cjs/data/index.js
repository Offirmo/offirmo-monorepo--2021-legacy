"use strict";
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
const ARMOR_BASES = entries_1.ENTRIES.filter((armor_component) => armor_component.type === types_1.ArmorPartType.base);
exports.ARMOR_BASES = ARMOR_BASES;
const ARMOR_QUALIFIERS1 = entries_1.ENTRIES.filter((armor_component) => armor_component.type === types_1.ArmorPartType.qualifier1);
exports.ARMOR_QUALIFIERS1 = ARMOR_QUALIFIERS1;
const ARMOR_QUALIFIERS2 = entries_1.ENTRIES.filter((armor_component) => armor_component.type === types_1.ArmorPartType.qualifier2);
exports.ARMOR_QUALIFIERS2 = ARMOR_QUALIFIERS2;
//# sourceMappingURL=index.js.map