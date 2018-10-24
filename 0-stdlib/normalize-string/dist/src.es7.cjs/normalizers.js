"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const normalize_1 = require("./normalize");
/////////////////////
const capitalize = s => s.length === 0
    ? s
    : s[0].toUpperCase() + s.slice(1);
const to_lower_case = s => s.toLowerCase();
const to_upper_case = s => s.toUpperCase();
// https://devdocs.io/javascript/global_objects/string/trim
const trim = s => s.trim();
// https://thread.engineering/2018-08-29-searching-and-sorting-text-with-diacritical-marks-in-javascript/
const coerce_to_ascii = s => s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
// https://devdocs.io/javascript/global_objects/string/normalize
const normalize_unicode = s => s.normalize();
// https://stackoverflow.com/a/1981366/587407
const ANY_BLANK_REGEXP = /\s+/g;
const coerce_blanks_to_single_spaces = s => s.replace(ANY_BLANK_REGEXP, ' ');
// https://stackoverflow.com/a/19313707/587407
const ANY_DELIMITER_REGEXP = new RegExp('[-+()*/:? _]', 'g');
const coerce_delimiters_to_space = s => s.replace(ANY_DELIMITER_REGEXP, ' ');
const convert_spaces_to_camel_case = s => s.split(' ').map(capitalize).join('');
// for user names, player names...
const coerce_to_safe_nickname = normalize_1.combine_normalizers(trim, coerce_to_ascii, to_lower_case, coerce_delimiters_to_space, coerce_blanks_to_single_spaces, convert_spaces_to_camel_case);
const coerce_to_redeemable_code = normalize_1.combine_normalizers(trim, coerce_to_ascii, to_upper_case, coerce_delimiters_to_space, convert_spaces_to_camel_case);
/////////////////////
const NORMALIZERS = {
    capitalize,
    to_lower_case,
    to_upper_case,
    trim,
    coerce_to_ascii,
    normalize_unicode,
    coerce_blanks_to_single_spaces,
    coerce_delimiters_to_space,
    convert_spaces_to_camel_case,
    coerce_to_safe_nickname,
    coerce_to_redeemable_code,
};
exports.NORMALIZERS = NORMALIZERS;
//# sourceMappingURL=normalizers.js.map