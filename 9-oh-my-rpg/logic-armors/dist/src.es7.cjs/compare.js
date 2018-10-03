"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const definitions_1 = require("@oh-my-rpg/definitions");
const utils_1 = require("./utils");
function compare_armors_by_strength(a, b) {
    const a_dmg = utils_1.get_medium_damage_reduction(a);
    const b_dmg = utils_1.get_medium_damage_reduction(b);
    if (a_dmg !== b_dmg)
        return b_dmg - a_dmg;
    // with equal damage, the least enhanced has more potential
    if (a.enhancement_level !== b.enhancement_level)
        return a.enhancement_level - b.enhancement_level;
    // fallback to other attributes
    return definitions_1.compare_items_by_quality(a, b) || a.uuid.localeCompare(b.uuid);
}
exports.compare_armors_by_strength = compare_armors_by_strength;
//# sourceMappingURL=compare.js.map