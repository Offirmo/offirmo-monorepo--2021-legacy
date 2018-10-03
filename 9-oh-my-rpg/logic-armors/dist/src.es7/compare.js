import { compare_items_by_quality, } from '@oh-my-rpg/definitions';
import { get_medium_damage_reduction } from './utils';
function compare_armors_by_strength(a, b) {
    const a_dmg = get_medium_damage_reduction(a);
    const b_dmg = get_medium_damage_reduction(b);
    if (a_dmg !== b_dmg)
        return b_dmg - a_dmg;
    // with equal damage, the least enhanced has more potential
    if (a.enhancement_level !== b.enhancement_level)
        return a.enhancement_level - b.enhancement_level;
    // fallback to other attributes
    return compare_items_by_quality(a, b) || a.uuid.localeCompare(b.uuid);
}
export { compare_armors_by_strength, };
//# sourceMappingURL=compare.js.map