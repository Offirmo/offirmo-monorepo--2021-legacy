"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const typescript_string_enums_1 = require("typescript-string-enums");
const definitions_1 = require("@oh-my-rpg/definitions");
const random_1 = require("@offirmo/random");
const consts_1 = require("./consts");
const _1 = require(".");
function assert_shape(weapon) {
    chai_1.expect(Object.keys(weapon)).to.have.lengthOf(9);
    chai_1.expect(weapon.uuid).to.equal('uu1~test~test~test~test~');
    chai_1.expect(weapon.element_type).to.be.a('string');
    chai_1.expect(typescript_string_enums_1.Enum.isType(definitions_1.ElementType, weapon.element_type)).to.be.true;
    chai_1.expect(weapon.slot).to.be.a('string');
    chai_1.expect(typescript_string_enums_1.Enum.isType(definitions_1.InventorySlot, weapon.slot)).to.be.true;
    chai_1.expect(weapon.base_hid).to.be.a('string');
    chai_1.expect(weapon.base_hid.length).to.have.above(2);
    chai_1.expect(weapon.qualifier1_hid).to.be.a('string');
    chai_1.expect(weapon.qualifier1_hid.length).to.have.above(2);
    chai_1.expect(weapon.qualifier2_hid).to.be.a('string');
    chai_1.expect(weapon.qualifier2_hid.length).to.have.above(2);
    chai_1.expect(weapon.quality).to.be.a('string');
    chai_1.expect(typescript_string_enums_1.Enum.isType(definitions_1.ItemQuality, weapon.quality)).to.be.true;
    chai_1.expect(weapon.base_strength).to.be.a('number');
    chai_1.expect(weapon.base_strength).to.be.at.least(1);
    chai_1.expect(weapon.base_strength).to.be.at.most(5000); // TODO real max
    chai_1.expect(weapon.enhancement_level).to.be.a('number');
    chai_1.expect(weapon.enhancement_level).to.be.at.least(0);
    chai_1.expect(weapon.enhancement_level).to.be.at.most(_1.MAX_ENHANCEMENT_LEVEL);
}
describe(`${consts_1.LIB} - logic`, function () {
    describe('creation', function () {
        it('should allow creating a random weapon', function () {
            const rng = random_1.Random.engines.mt19937().seed(789);
            const weapon1 = definitions_1.xxx_test_unrandomize_element(_1.create(rng));
            assert_shape(weapon1);
            chai_1.expect(rng.getUseCount(), '# rng draws 1').to.equal(5);
            const weapon2 = definitions_1.xxx_test_unrandomize_element(_1.create(rng));
            assert_shape(weapon2);
            chai_1.expect(rng.getUseCount(), '# rng draws 2').to.equal(10);
            chai_1.expect(weapon2).not.to.deep.equal(weapon1);
        });
        it('should allow creating a partially predefined weapon', function () {
            const rng = random_1.Random.engines.mt19937().seed(789);
            const weapon = definitions_1.xxx_test_unrandomize_element(_1.create(rng, {
                base_hid: 'spoon',
                quality: 'artifact',
            }));
            chai_1.expect(weapon).to.deep.equal({
                uuid: 'uu1~test~test~test~test~',
                element_type: definitions_1.ElementType.item,
                slot: definitions_1.InventorySlot.weapon,
                base_hid: 'spoon',
                qualifier1_hid: 'composite',
                qualifier2_hid: 'twink',
                quality: definitions_1.ItemQuality.artifact,
                base_strength: 19,
                enhancement_level: 0
            });
            chai_1.expect(rng.getUseCount(), '# rng draws').to.equal(3); // 2 less random picks
        });
    });
    describe('enhancement', function () {
        it('should allow enhancing a weapon', function () {
            let weapon = _1.generate_random_demo_weapon();
            weapon.enhancement_level = 0;
            weapon = _1.enhance(weapon);
            chai_1.expect(weapon.enhancement_level, '1').to.equal(1);
            for (let i = 2; i <= _1.MAX_ENHANCEMENT_LEVEL; ++i) {
                weapon = _1.enhance(weapon);
                chai_1.expect(weapon.enhancement_level, String(i)).to.equal(i);
            }
            chai_1.expect(weapon.enhancement_level, 'max').to.equal(_1.MAX_ENHANCEMENT_LEVEL);
        });
        it('should fail if weapon is already at max enhancement level', () => {
            let weapon = _1.generate_random_demo_weapon();
            weapon.enhancement_level = _1.MAX_ENHANCEMENT_LEVEL;
            function attempt_enhance() {
                weapon = _1.enhance(weapon);
            }
            chai_1.expect(attempt_enhance).to.throw('maximal enhancement level!');
        });
    });
});
//# sourceMappingURL=state_spec.js.map