import { expect } from 'chai';
import { xxx_internal_reset_prng_cache } from '@oh-my-rpg/state-prng';
import { LIB } from '../consts';
import { create } from '..';
import { find_element, } from './others';
describe(`${LIB} - selectors / others`, function () {
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
});
//# sourceMappingURL=others_spec.js.map