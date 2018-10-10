"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const random_1 = require("@offirmo/random");
const _1 = require(".");
describe('@oh-my-rpg/logic-weapons - selectors', function () {
    describe('damage', function () {
        const rng = random_1.Random.engines.mt19937().seed(789);
        describe('interval', function () {
            it('should work', () => {
                const [min, max] = _1.get_damage_interval(_1.create(rng, {
                    base_hid: 'luth',
                    qualifier1_hid: 'simple',
                    qualifier2_hid: 'mercenary',
                    quality: 'legendary',
                    base_strength: 14,
                    enhancement_level: 3,
                }));
                chai_1.expect(min).to.be.a('number');
                chai_1.expect(max).to.be.a('number');
                chai_1.expect(max).to.be.above(min);
                chai_1.expect(min).to.be.above(291); // min for legend+3
                chai_1.expect(min).to.be.below(5824); // max for legend+3
                chai_1.expect(max).to.be.above(291); // min for legend+3
                chai_1.expect(max).to.be.below(5824); // max for legend+3
                chai_1.expect(min).to.equal(3494);
                chai_1.expect(max).to.equal(4659);
            });
            [
                {
                    quality: 'common',
                    min: 1,
                    max: 60,
                },
                {
                    quality: 'uncommon',
                    min: 19,
                    max: 1140,
                },
                {
                    quality: 'rare',
                    min: 46,
                    max: 2760,
                },
                {
                    quality: 'epic',
                    min: 91,
                    max: 5460,
                },
                {
                    quality: 'legendary',
                    min: 182,
                    max: 10920,
                },
                {
                    quality: 'artifact',
                    min: 333,
                    max: 19980,
                },
            ].forEach(quality_limits => {
                it(`should have the correct minimal limit for quality "${quality_limits.quality}"`, () => {
                    const [min, max] = _1.get_damage_interval(_1.create(rng, {
                        base_hid: 'whatever',
                        qualifier1_hid: 'whatever',
                        qualifier2_hid: 'whatever',
                        quality: quality_limits.quality,
                        base_strength: 1,
                        enhancement_level: 0,
                    }));
                    chai_1.expect(min).to.be.a('number');
                    chai_1.expect(min).to.equal(quality_limits.min);
                });
                it(`should have the correct maximal limit for quality "${quality_limits.quality}"`, () => {
                    const [min, max] = _1.get_damage_interval(_1.create(rng, {
                        base_hid: 'whatever',
                        qualifier1_hid: 'whatever',
                        qualifier2_hid: 'whatever',
                        quality: quality_limits.quality,
                        base_strength: 20,
                        enhancement_level: 10,
                    }));
                    chai_1.expect(max).to.be.a('number');
                    chai_1.expect(max).to.equal(quality_limits.max);
                });
            });
        });
        describe('medium', function () {
            it('should work', () => {
                const med = _1.get_medium_damage(_1.create(rng, {
                    base_hid: 'luth',
                    qualifier1_hid: 'simple',
                    qualifier2_hid: 'mercenary',
                    quality: 'legendary',
                    base_strength: 14,
                    enhancement_level: 3,
                }));
                chai_1.expect(med).to.be.a('number');
                chai_1.expect(med).to.be.above(291); // min for legend+3
                chai_1.expect(med).to.be.below(5824); // max for legend+3
                chai_1.expect(med).to.equal(Math.round((4659 + 3494) / 2));
            });
        });
    });
});
//# sourceMappingURL=selectors_spec.js.map