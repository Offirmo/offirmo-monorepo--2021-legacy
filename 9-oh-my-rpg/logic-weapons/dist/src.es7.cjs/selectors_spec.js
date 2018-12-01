"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const definitions_1 = require("@oh-my-rpg/definitions");
const random_1 = require("@offirmo/random");
const consts_1 = require("./consts");
const _1 = require(".");
describe(`${consts_1.LIB} - selectors`, function () {
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
    describe('matches', function () {
        const rng = random_1.Random.engines.mt19937().seed(789);
        const REF = _1.create(rng, {
            quality: definitions_1.ItemQuality.rare,
            base_hid: 'socks',
            qualifier1_hid: 'onyx',
            qualifier2_hid: 'tormentor',
            base_strength: 17,
        });
        it('should correctly match when appropriate', function () {
            chai_1.expect(_1.matches(REF, {}), '0').to.be.true;
            chai_1.expect(_1.matches(REF, {
                quality: definitions_1.ItemQuality.rare,
            }), '1a').to.be.true;
            chai_1.expect(_1.matches(REF, {
                qualifier1_hid: 'onyx',
            }), '1b').to.be.true;
            chai_1.expect(_1.matches(REF, {
                quality: definitions_1.ItemQuality.rare,
                base_hid: 'socks',
            }), '2a').to.be.true;
            chai_1.expect(_1.matches(REF, {
                quality: definitions_1.ItemQuality.rare,
                base_hid: 'socks',
                qualifier1_hid: 'onyx',
                qualifier2_hid: 'tormentor',
                base_strength: 17,
            }), '5').to.be.true;
        });
        it('should correctly NOT match when appropriate', function () {
            chai_1.expect(_1.matches(REF, {
                quality: definitions_1.ItemQuality.common,
            }), '1a').to.be.false;
            chai_1.expect(_1.matches(REF, {
                qualifier1_hid: 'dwarven',
            }), '1b').to.be.false;
            chai_1.expect(_1.matches(REF, {
                quality: definitions_1.ItemQuality.rare,
                base_hid: 'mantle',
            }), '2a').to.be.false;
            chai_1.expect(_1.matches(REF, {
                quality: definitions_1.ItemQuality.legendary,
                base_hid: 'socks',
            }), '2b').to.be.false;
            chai_1.expect(_1.matches(REF, {
                quality: definitions_1.ItemQuality.rare,
                base_hid: 'socks',
                qualifier1_hid: 'onyx',
                qualifier2_hid: 'tormentor',
                base_strength: 20,
            }), '5').to.be.false;
        });
        it('should correctly throw when appropriate', function () {
            chai_1.expect(() => {
                _1.matches(REF, {
                    slot: definitions_1.InventorySlot.armor,
                });
            }, 'slot').to.throw('non-weapon slot');
            chai_1.expect(() => {
                _1.matches(REF, {
                    foo: 42,
                });
            }, 'foreign').to.throw('non-weapon key');
        });
    });
});
//# sourceMappingURL=selectors_spec.js.map