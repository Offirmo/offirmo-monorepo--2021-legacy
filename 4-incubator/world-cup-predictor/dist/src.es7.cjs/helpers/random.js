"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}
exports.getRandomIntInclusive = getRandomIntInclusive;
function pickRandom(...choices) {
    const min = 0;
    const max = choices.length - 1;
    return choices[getRandomIntInclusive(min, max)];
}
exports.pickRandom = pickRandom;
//# sourceMappingURL=random.js.map