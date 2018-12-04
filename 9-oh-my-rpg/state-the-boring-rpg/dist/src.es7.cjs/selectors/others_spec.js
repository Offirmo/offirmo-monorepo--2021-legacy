"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const state_prng_1 = require("@oh-my-rpg/state-prng");
const consts_1 = require("../consts");
const __1 = require("..");
const others_1 = require("./others");
describe(`${consts_1.LIB} - selectors / others`, function () {
    beforeEach(() => state_prng_1.xxx_internal_reset_prng_cache());
    describe('find_element() by uuid', function () {
        context('when the element refers to an item', function () {
            it('should find it', () => {
                const state = __1.create();
                const armor = state.inventory.slotted.armor;
                const element = others_1.find_element(state, armor.uuid);
                chai_1.expect(element).to.deep.equal(armor);
            });
        });
        context('when the uuid refers to nothing', function () {
            it('should return null', () => {
                const state = __1.create();
                const element = others_1.find_element(state, 'foo');
                chai_1.expect(element).to.be.null;
            });
        });
    });
});
//# sourceMappingURL=others_spec.js.map