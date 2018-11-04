import { expect } from 'chai';
import { xxx_internal_reset_prng_cache } from '@oh-my-rpg/state-prng';
import { create, find_element, appraise_item_value, } from '..';
describe('@oh-my-rpg/state-the-boring-rpg - selectors', function () {
    beforeEach(() => xxx_internal_reset_prng_cache());
    describe('find_element() by uuid', function () {
        context('when the element refers to an item', function () {
            it('should find it', () => {
                const state = create();
                const armor = state.inventory.slotted.armor;
                const element = find_element(state, armor.uuid);
                expect(element).to.deep.equal(armor);
            });
        });
        context('when the uuid refers to nothing', function () {
            it('should return null', () => {
                const state = create();
                const element = find_element(state, 'foo');
                expect(element).to.be.null;
            });
        });
    });
    describe('appraise_item_value() by uuid', function () {
        context('when the element refers to an item', function () {
            it('should find it and appraise its value', () => {
                const state = create();
                const armor = state.inventory.slotted.armor;
                const price = appraise_item_value(state, armor.uuid);
                expect(price).to.equal(5);
            });
        });
        context('when the uuid refers to nothing', function () {
            it('should throw', () => {
                const state = create();
                const attempt_appraise = () => void appraise_item_value(state, 'foo');
                expect(attempt_appraise).to.throw('No item');
            });
        });
    });
});
//# sourceMappingURL=index_spec.js.map