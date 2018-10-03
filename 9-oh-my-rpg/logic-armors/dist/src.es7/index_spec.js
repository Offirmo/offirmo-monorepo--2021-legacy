import { expect } from 'chai';
import { InventorySlot, ItemQuality, ElementType, xxx_test_unrandomize_element, } from '@oh-my-rpg/definitions';
import { Random } from '@offirmo/random';
import { MAX_ENHANCEMENT_LEVEL, create, generate_random_demo_armor, enhance, get_damage_reduction_interval, get_medium_damage_reduction, compare_armors_by_strength, } from '.';
describe('@oh-my-rpg/logic-armors - logic', function () {
    describe('creation', function () {
        it('should allow creating a random armor', function () {
            const rng = Random.engines.mt19937().seed(789);
            const armor1 = xxx_test_unrandomize_element(create(rng));
            expect(armor1).to.deep.equal({
                uuid: 'uu1~test~test~test~test~',
                element_type: ElementType.item,
                slot: InventorySlot.armor,
                base_hid: 'socks',
                qualifier1_hid: 'onyx',
                qualifier2_hid: 'tormentor',
                quality: ItemQuality.uncommon,
                base_strength: 17,
                enhancement_level: 0
            });
            expect(rng.getUseCount(), '# rng draws 1').to.equal(6);
            const armor2 = create(rng);
            expect(rng.getUseCount(), '# rng draws 2').to.equal(11);
            expect(armor2).not.to.deep.equal(armor1);
        });
        it('should allow creating a partially predefined armor', function () {
            const rng = Random.engines.mt19937().seed(789);
            const armor = xxx_test_unrandomize_element(create(rng, {
                base_hid: 'shoes',
                quality: 'artifact',
            }));
            expect(armor).to.deep.equal({
                uuid: 'uu1~test~test~test~test~',
                element_type: ElementType.item,
                slot: InventorySlot.armor,
                base_hid: 'shoes',
                qualifier1_hid: 'skeleton',
                qualifier2_hid: 'training',
                quality: ItemQuality.artifact,
                base_strength: 19,
                enhancement_level: 0
            });
            expect(rng.getUseCount(), '# rng draws').to.equal(3); // 2 less random picks
        });
    });
    describe('enhancement', function () {
        it('should allow enhancing a armor', function () {
            let armor = generate_random_demo_armor();
            armor.enhancement_level = 0;
            armor = enhance(armor);
            expect(armor.enhancement_level, String(1)).to.equal(1);
            for (let i = 2; i <= MAX_ENHANCEMENT_LEVEL; ++i) {
                armor = enhance(armor);
                expect(armor.enhancement_level, String(i)).to.equal(i);
            }
            expect(armor.enhancement_level, 'max').to.equal(MAX_ENHANCEMENT_LEVEL);
        });
        it('should fail if armor is already at max enhancement level', () => {
            let armor = generate_random_demo_armor();
            armor.enhancement_level = MAX_ENHANCEMENT_LEVEL;
            function attempt_enhance() {
                armor = enhance(armor);
            }
            expect(attempt_enhance).to.throw('maximal enhancement level!');
        });
    });
    describe('damage reduction', function () {
        const ATTACK_VS_DEFENSE_RATIO = 0.5;
        function gen_test_armor() {
            const rng = Random.engines.mt19937().seed(789);
            return create(rng, {
                base_hid: 'shield',
                qualifier1_hid: 'simple',
                qualifier2_hid: 'mercenary',
                quality: 'legendary',
                base_strength: 14,
                enhancement_level: 3,
            });
        }
        describe('interval', function () {
            it('should work', () => {
                const [min, max] = get_damage_reduction_interval(gen_test_armor());
                expect(min).to.be.a('number');
                expect(max).to.be.a('number');
                expect(max).to.be.above(min);
                expect(min).to.be.above(291 * ATTACK_VS_DEFENSE_RATIO); // min for legend+3
                expect(min).to.be.below(5824 * ATTACK_VS_DEFENSE_RATIO); // max for legend+3
                expect(max).to.be.above(291 * ATTACK_VS_DEFENSE_RATIO); // min for legend+3
                expect(max).to.be.below(5824 * ATTACK_VS_DEFENSE_RATIO); // max for legend+3
                expect(min).to.equal(1747);
                expect(max).to.equal(2330);
            });
        });
        describe('medium', function () {
            it('should work', () => {
                const med = get_medium_damage_reduction(gen_test_armor());
                expect(med).to.be.a('number');
                expect(med).to.be.above(291 * ATTACK_VS_DEFENSE_RATIO); // min for legend+3
                expect(med).to.be.below(5824 * ATTACK_VS_DEFENSE_RATIO); // max for legend+3
                expect(med).to.equal(Math.round((1747 + 2330) / 2));
            });
        });
    });
    describe('comparison', function () {
        it('should sort properly by strength', () => {
            const armors = [
                generate_random_demo_armor(),
                generate_random_demo_armor(),
                generate_random_demo_armor(),
            ].sort(compare_armors_by_strength);
            const [s1, s2, s3] = armors.map(get_medium_damage_reduction);
            expect(s1).to.be.above(s2);
            expect(s2).to.be.above(s3);
        });
        context('when strength is equal', () => {
            it('should take into account the potential', () => {
                const rng = Random.engines.mt19937().seed(789);
                const armors = [
                    create(rng, { base_strength: 1, quality: ItemQuality.common, enhancement_level: 4 }),
                    create(rng, { base_strength: 1, quality: ItemQuality.common, enhancement_level: 3 }),
                    create(rng, { base_strength: 1, quality: ItemQuality.common, enhancement_level: 5 }),
                ].sort(compare_armors_by_strength);
                const [s1, s2, s3] = armors.map(get_medium_damage_reduction);
                expect(s1).to.equal(s2);
                expect(s1).to.equal(s3);
                const [a1, a2, a3] = armors;
                expect(a1.enhancement_level).to.be.below(a2.enhancement_level);
                expect(a2.enhancement_level).to.be.below(a3.enhancement_level);
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
});
//# sourceMappingURL=index_spec.js.map