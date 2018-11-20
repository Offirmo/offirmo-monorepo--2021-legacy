"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_string_enums_1 = require("typescript-string-enums");
const consts_1 = require("./consts");
const types_1 = require("./types");
const GENDER_TO_UNICODE = {
    [types_1.Gender.unknown]: '',
    [types_1.Gender.male]: consts_1.GENDER_MALE,
    [types_1.Gender.female]: consts_1.GENDER_FEMALE,
    [types_1.Gender.neutral]: '',
};
exports.GENDER_TO_UNICODE = GENDER_TO_UNICODE;
if (Object.keys(GENDER_TO_UNICODE).length !== typescript_string_enums_1.Enum.keys(types_1.Gender).length)
    throw new Error('GENDER_TO_UNICODE is not up to date!');
const SKIN_TONE_TO_UNICODE = {
    [types_1.SkinTone.unknown]: '',
    [types_1.SkinTone.yellow]: '',
    [types_1.SkinTone.fp1]: '🏻',
    [types_1.SkinTone.fp2]: '🏼',
    [types_1.SkinTone.fp3]: '🏽',
    [types_1.SkinTone.fp4]: '🏾',
    [types_1.SkinTone.fp5]: '🏿',
    [types_1.SkinTone.white]: '🏻',
    [types_1.SkinTone.cream_white]: '🏼',
    [types_1.SkinTone.light_brown]: '🏽',
    [types_1.SkinTone.brown]: '🏾',
    [types_1.SkinTone.dark_brown]: '🏿',
};
exports.SKIN_TONE_TO_UNICODE = SKIN_TONE_TO_UNICODE;
if (Object.keys(SKIN_TONE_TO_UNICODE).length !== typescript_string_enums_1.Enum.keys(types_1.SkinTone).length)
    throw new Error('SKIN_TONE_TO_UNICODE is not up to date!');
//# sourceMappingURL=data.js.map