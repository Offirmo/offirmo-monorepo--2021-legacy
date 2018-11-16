"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const consts_1 = require("./consts");
const types_1 = require("./types");
const GENDER_TO_UNICODE = {
    [types_1.Gender.undef]: '',
    [types_1.Gender.unknown]: '',
    [types_1.Gender.neutral]: '',
    [types_1.Gender.male]: consts_1.GENDER_MALE,
    [types_1.Gender.female]: consts_1.GENDER_FEMALE,
};
exports.GENDER_TO_UNICODE = GENDER_TO_UNICODE;
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
//# sourceMappingURL=data.js.map