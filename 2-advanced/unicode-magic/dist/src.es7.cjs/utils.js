"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
const consts_1 = require("./consts");
const data_1 = require("./data");
function render(spec) {
    let { gender, age, skin_tone, hair } = spec;
    //console.log(Object.values(spec))
    let result = '';
    let is_gender_applied = false;
    let is_age_applied = false;
    let is_skin_tone_applied = false;
    let is_hair_applied = false;
    const notes = [];
    let base = (() => {
        switch (age) {
            case types_1.Age.baby:
                is_gender_applied = true; // can't show it with this base
                // TODO warning
                return consts_1.BASES.baby;
            case types_1.Age.child:
                is_gender_applied = true;
                return gender === types_1.Gender.female
                    ? consts_1.BASES.girl
                    : gender === types_1.Gender.male
                        ? consts_1.BASES.boy
                        : consts_1.BASES.child;
            case types_1.Age.elder:
                is_gender_applied = true;
                return gender === types_1.Gender.female
                    ? consts_1.BASES.elder_woman
                    : gender === types_1.Gender.male
                        ? consts_1.BASES.elder_man
                        : consts_1.BASES.elder;
            case types_1.Age.adult:
            default:
                if (hair === types_1.HairColor.blond) {
                    is_hair_applied = true;
                    return consts_1.BASES.person_with_blond_hair;
                }
                is_gender_applied = true;
                return gender === types_1.Gender.female
                    ? consts_1.BASES.woman
                    : gender === types_1.Gender.male
                        ? consts_1.BASES.man
                        : consts_1.BASES.adult;
        }
    })();
    result += base;
    // coercions
    if (hair === types_1.HairColor.black && skin_tone === types_1.SkinTone.fp2) {
        // coerce FP2 to FP1 to have black hair
        skin_tone = types_1.SkinTone.fp1;
    }
    if (hair === types_1.HairColor.brown && skin_tone === types_1.SkinTone.fp2) {
        // coerce FP2 to FP3 to have brown hair
        skin_tone = types_1.SkinTone.fp3;
    }
    if (!is_skin_tone_applied) {
        if (data_1.SKIN_TONE_TO_UNICODE[skin_tone])
            result = result + data_1.SKIN_TONE_TO_UNICODE[skin_tone];
        is_skin_tone_applied = true;
    }
    if (!is_gender_applied) {
        if (data_1.GENDER_TO_UNICODE[gender])
            result = result + consts_1.ZERO_WIDTH_JOINER + data_1.GENDER_TO_UNICODE[gender];
        is_gender_applied = true;
    }
    //console.log(options)
    return [result, notes];
}
exports.render = render;
//# sourceMappingURL=utils.js.map