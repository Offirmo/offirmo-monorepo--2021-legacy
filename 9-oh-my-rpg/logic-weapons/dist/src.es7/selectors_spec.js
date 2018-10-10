import { expect } from 'chai';
import { Random } from '@offirmo/random';
import { create, get_damage_interval, get_medium_damage, } from '.';
describe('@oh-my-rpg/logic-weapons - selectors', function () {
    describe('damage', function () {
        const rng = Random.engines.mt19937().seed(789);
        describe('interval', function () {
            it('should work', () => {
                const [min, max] = get_damage_interval(create(rng, {
                    base_hid: 'luth',
                    qualifier1_hid: 'simple',
                    qualifier2_hid: 'mercenary',
                    quality: 'legendary',
                    base_strength: 14,
                    enhancement_level: 3,
                }));
                expect(min).to.be.a('number');
                expect(max).to.be.a('number');
                expect(max).to.be.above(min);
                expect(min).to.be.above(291); // min for legend+3
                expect(min).to.be.below(5824); // max for legend+3
                expect(max).to.be.above(291); // min for legend+3
                expect(max).to.be.below(5824); // max for legend+3
                expect(min).to.equal(3494);
                expect(max).to.equal(4659);
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
                    const [min, max] = get_damage_interval(create(rng, {
                        base_hid: 'whatever',
                        qualifier1_hid: 'whatever',
                        qualifier2_hid: 'whatever',
                        quality: quality_limits.quality,
                        base_strength: 1,
                        enhancement_level: 0,
                    }));
                    expect(min).to.be.a('number');
                    expect(min).to.equal(quality_limits.min);
                });
                it(`should have the correct maximal limit for quality "${quality_limits.quality}"`, () => {
                    const [min, max] = get_damage_interval(create(rng, {
                        base_hid: 'whatever',
                        qualifier1_hid: 'whatever',
                        qualifier2_hid: 'whatever',
                        quality: quality_limits.quality,
                        base_strength: 20,
                        enhancement_level: 10,
                    }));
                    expect(max).to.be.a('number');
                    expect(max).to.equal(quality_limits.max);
                });
            });
        });
        describe('medium', function () {
            it('should work', () => {
                const med = get_medium_damage(create(rng, {
                    base_hid: 'luth',
                    qualifier1_hid: 'simple',
                    qualifier2_hid: 'mercenary',
                    quality: 'legendary',
                    base_strength: 14,
                    enhancement_level: 3,
                }));
                expect(med).to.be.a('number');
                expect(med).to.be.above(291); // min for legend+3
                expect(med).to.be.below(5824); // max for legend+3
                expect(med).to.equal(Math.round((4659 + 3494) / 2));
            });
        });
    });
});
//# sourceMappingURL=selectors_spec.js.map