"use strict";
////////////////////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
////////////
// actualized strength
// quality multipliers (see spreadsheet for calculation)
const QUALITY_STRENGTH_MULTIPLIER = {
    common: 1,
    uncommon: 19,
    rare: 46,
    epic: 91,
    legendary: 182,
    artifact: 333,
};
exports.QUALITY_STRENGTH_MULTIPLIER = QUALITY_STRENGTH_MULTIPLIER;
const QUALITY_STRENGTH_SPREAD = {
    common: 6,
    uncommon: 5,
    rare: 4,
    epic: 3,
    legendary: 2,
    artifact: 1,
};
exports.QUALITY_STRENGTH_SPREAD = QUALITY_STRENGTH_SPREAD;
const ENHANCEMENT_MULTIPLIER = 0.2;
exports.ENHANCEMENT_MULTIPLIER = ENHANCEMENT_MULTIPLIER;
const MIN_ENHANCEMENT_LEVEL = 0;
exports.MIN_ENHANCEMENT_LEVEL = MIN_ENHANCEMENT_LEVEL;
const MAX_ENHANCEMENT_LEVEL = 8;
exports.MAX_ENHANCEMENT_LEVEL = MAX_ENHANCEMENT_LEVEL;
const MIN_STRENGTH = 1;
exports.MIN_STRENGTH = MIN_STRENGTH;
const MAX_STRENGTH = 20;
exports.MAX_STRENGTH = MAX_STRENGTH;
////////////////////////////////////
//# sourceMappingURL=consts.js.map