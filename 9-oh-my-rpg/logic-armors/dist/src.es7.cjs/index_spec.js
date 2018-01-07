"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const definitions_1 = require("@oh-my-rpg/definitions");
const random_1 = require("@offirmo/random");
const _1 = require(".");
describe('🛡 👕  armor logic:', function () {
    describe('creation', function () {
        it('should allow creating a random armor', function () {
            const rng = random_1.Random.engines.mt19937().seed(789);
            const armor1 = definitions_1.xxx_test_unrandomize_element(_1.create(rng));
            chai_1.expect(armor1).to.deep.equal({
                uuid: 'uu1~test~test~test~test~',
                element_type: definitions_1.ElementType.item,
                slot: definitions_1.InventorySlot.armor,
                base_hid: 'socks',
                qualifier1_hid: 'onyx',
                qualifier2_hid: 'tormentor',
                quality: definitions_1.ItemQuality.uncommon,
                base_strength: 17,
                enhancement_level: 0
            });
            chai_1.expect(rng.getUseCount(), '# rng draws 1').to.equal(6);
            const armor2 = _1.create(rng);
            chai_1.expect(rng.getUseCount(), '# rng draws 2').to.equal(11);
            chai_1.expect(armor2).not.to.deep.equal(armor1);
        });
        it('should allow creating a partially predefined armor', function () {
            const rng = random_1.Random.engines.mt19937().seed(789);
            const armor = definitions_1.xxx_test_unrandomize_element(_1.create(rng, {
                base_hid: 'shoes',
                quality: 'artifact',
            }));
            chai_1.expect(armor).to.deep.equal({
                uuid: 'uu1~test~test~test~test~',
                element_type: definitions_1.ElementType.item,
                slot: definitions_1.InventorySlot.armor,
                base_hid: 'shoes',
                qualifier1_hid: 'skeleton',
                qualifier2_hid: 'training',
                quality: definitions_1.ItemQuality.artifact,
                base_strength: 19,
                enhancement_level: 0
            });
            chai_1.expect(rng.getUseCount(), '# rng draws').to.equal(3); // 2 less random picks
        });
    });
    describe('enhancement', function () {
        it('should allow enhancing a armor', function () {
            let armor = _1.generate_random_demo_armor();
            armor.enhancement_level = 0;
            armor = _1.enhance(armor);
            chai_1.expect(armor.enhancement_level, String(1)).to.equal(1);
            for (let i = 2; i <= _1.MAX_ENHANCEMENT_LEVEL; ++i) {
                armor = _1.enhance(armor);
                chai_1.expect(armor.enhancement_level, String(i)).to.equal(i);
            }
            chai_1.expect(armor.enhancement_level, 'max').to.equal(_1.MAX_ENHANCEMENT_LEVEL);
        });
        it('should fail if armor is already at max enhancement level', () => {
            let armor = _1.generate_random_demo_armor();
            armor.enhancement_level = _1.MAX_ENHANCEMENT_LEVEL;
            function attempt_enhance() {
                armor = _1.enhance(armor);
            }
            chai_1.expect(attempt_enhance).to.throw('maximal enhancement level!');
        });
    });
    describe('damage reduction', function () {
        const ATTACK_VS_DEFENSE_RATIO = 0.5;
        function gen_test_armor() {
            const rng = random_1.Random.engines.mt19937().seed(789);
            return _1.create(rng, {
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
                const [min, max] = _1.get_damage_reduction_interval(gen_test_armor());
                chai_1.expect(min).to.be.a('number');
                chai_1.expect(max).to.be.a('number');
                chai_1.expect(max).to.be.above(min);
                chai_1.expect(min).to.be.above(291 * ATTACK_VS_DEFENSE_RATIO); // min for legend+3
                chai_1.expect(min).to.be.below(5824 * ATTACK_VS_DEFENSE_RATIO); // max for legend+3
                chai_1.expect(max).to.be.above(291 * ATTACK_VS_DEFENSE_RATIO); // min for legend+3
                chai_1.expect(max).to.be.below(5824 * ATTACK_VS_DEFENSE_RATIO); // max for legend+3
                chai_1.expect(min).to.equal(1747);
                chai_1.expect(max).to.equal(2330);
            });
        });
        describe('medium', function () {
            it('should work', () => {
                const med = _1.get_medium_damage_reduction(gen_test_armor());
                chai_1.expect(med).to.be.a('number');
                chai_1.expect(med).to.be.above(291 * ATTACK_VS_DEFENSE_RATIO); // min for legend+3
                chai_1.expect(med).to.be.below(5824 * ATTACK_VS_DEFENSE_RATIO); // max for legend+3
                chai_1.expect(med).to.equal(Math.round((1747 + 2330) / 2));
            });
        });
    });
});
//# sourceMappingURL=index_spec.js.map