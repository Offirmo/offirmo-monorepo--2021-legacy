"use strict";
/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
const definitions_1 = require("@oh-my-rpg/definitions");
const selectors_1 = require("./selectors");
/////////////////////
// for sorting
function compare_weapons_by_strength(a, b) {
    const a_dmg = selectors_1.get_medium_damage(a);
    const b_dmg = selectors_1.get_medium_damage(b);
    if (a_dmg !== b_dmg)
        return b_dmg - a_dmg;
    // with equal damage, the least enhanced has more potential
    if (a.enhancement_level !== b.enhancement_level)
        return a.enhancement_level - b.enhancement_level;
    // fallback to other attributes
    return definitions_1.compare_items_by_quality(a, b) || a.uuid.localeCompare(b.uuid);
}
exports.compare_weapons_by_strength = compare_weapons_by_strength;
/////////////////////
//# sourceMappingURL=compare.js.map