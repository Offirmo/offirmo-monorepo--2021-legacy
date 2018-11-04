"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const definitions_1 = require("@oh-my-rpg/definitions");
const random_1 = require("@offirmo/random");
const _1 = require(".");
describe('@oh-my-rpg/logic-armors - comparison', function () {
    it('should sort properly by strength', () => {
        const rng = random_1.Random.engines.mt19937().seed(789);
        const armors = [
            _1.generate_random_demo_armor(rng),
            _1.generate_random_demo_armor(rng),
            _1.generate_random_demo_armor(rng),
        ].sort(_1.compare_armors_by_strength);
        const [s1, s2, s3] = armors.map(_1.get_medium_damage_reduction);
        chai_1.expect(s1).to.be.above(s2);
        chai_1.expect(s2).to.be.above(s3);
    });
    context('when strength is equal', () => {
        it('should take into account the potential', () => {
            const rng = random_1.Random.engines.mt19937().seed(789);
            const armors = [
                _1.create(rng, { base_strength: 1, quality: definitions_1.ItemQuality.common, enhancement_level: 4 }),
                _1.create(rng, { base_strength: 1, quality: definitions_1.ItemQuality.common, enhancement_level: 3 }),
                _1.create(rng, { base_strength: 1, quality: definitions_1.ItemQuality.common, enhancement_level: 5 }),
            ].sort(_1.compare_armors_by_strength);
            const [s1, s2, s3] = armors.map(_1.get_medium_damage_reduction);
            chai_1.expect(s1).to.equal(s2);
            chai_1.expect(s1).to.equal(s3);
            const [a1, a2, a3] = armors;
            chai_1.expect(a1.enhancement_level).to.be.below(a2.enhancement_level);
            chai_1.expect(a2.enhancement_level).to.be.below(a3.enhancement_level);
        });
        // extremely rare cases, hard to compute, not even sure it's possible since quality impacts strength
        context('when potential is also equal', function () {
            it('should take into account the quality');
            context('when quality is also equal', function () {
                it('should fallback to uuid');
            });
        });
    });
});
//# sourceMappingURL=compare_spec.js.map