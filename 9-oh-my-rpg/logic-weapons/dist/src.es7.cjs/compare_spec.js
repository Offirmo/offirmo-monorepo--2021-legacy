"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const random_1 = require("@offirmo/random");
const definitions_1 = require("@oh-my-rpg/definitions");
const consts_1 = require("./consts");
const _1 = require(".");
describe(`${consts_1.LIB} - compare`, function () {
    it('should sort properly by strength', () => {
        const rng = random_1.Random.engines.mt19937().seed(789);
        const items = [
            _1.generate_random_demo_weapon(rng),
            _1.generate_random_demo_weapon(rng),
            _1.generate_random_demo_weapon(rng),
        ].sort(_1.compare_weapons_by_strength);
        const [s1, s2, s3] = items.map(_1.get_medium_damage);
        chai_1.expect(s1).to.be.above(s2);
        chai_1.expect(s2).to.be.above(s3);
    });
    context('when strength is equal', () => {
        it('should take into account the potential', () => {
            const rng = random_1.Random.engines.mt19937().seed(789);
            const items = [
                _1.create(rng, { base_strength: 1, quality: definitions_1.ItemQuality.common, enhancement_level: 5 }),
                _1.create(rng, { base_strength: 1, quality: definitions_1.ItemQuality.common, enhancement_level: 4 }),
            ].sort(_1.compare_weapons_by_strength);
            const [s1, s2] = items.map(_1.get_medium_damage);
            chai_1.expect(s1).to.equal(s2);
            const [w1, w2] = items;
            chai_1.expect(w1.enhancement_level).to.be.below(w2.enhancement_level);
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