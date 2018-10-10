import { expect } from 'chai';
import { InventorySlot, ItemQuality } from '@oh-my-rpg/definitions';
import { appraise_value, } from '.';
describe('@oh-my-rpg/logic-shop - selectors:', function () {
    describe('appraisal', function () {
        context('of armors', function () {
            it('should work', () => {
                const price = appraise_value({
                    slot: InventorySlot.armor,
                    base_hid: 'whatever',
                    qualifier1_hid: 'whatever',
                    qualifier2_hid: 'whatever',
                    quality: ItemQuality.legendary,
                    base_strength: 14,
                    enhancement_level: 3,
                });
                expect(price).to.be.a('number');
                expect(price).to.equal(3670);
            });
        });
        context('of weapons', function () {
            it('should work', () => {
                const price = appraise_value({
                    slot: InventorySlot.weapon,
                    base_hid: 'whatever',
                    qualifier1_hid: 'whatever',
                    qualifier2_hid: 'whatever',
                    quality: ItemQuality.legendary,
                    base_strength: 14,
                    enhancement_level: 3,
                });
                expect(price).to.be.a('number');
                expect(price).to.equal(3262);
            });
        });
    });
});
//# sourceMappingURL=selectors_spec.js.map