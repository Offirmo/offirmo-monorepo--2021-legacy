"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const state_prng_1 = require("@oh-my-rpg/state-prng");
const consts_1 = require("../consts");
const reducers_1 = require("../state/reducers");
const inventory_1 = require("./inventory");
describe(`${consts_1.LIB} - selectors / inventory`, function () {
    beforeEach(() => state_prng_1.xxx_internal_reset_prng_cache());
    // TODO
    describe('appraise_item_value() by uuid', function () {
        context('when the element refers to an item', function () {
            it('should find it and appraise its value', () => {
                const state = reducers_1.create();
                const armor = state.inventory.slotted.armor;
                const price = inventory_1.appraise_item_value(state, armor.uuid);
                chai_1.expect(price).to.equal(5);
            });
        });
        context('when the uuid refers to nothing', function () {
            it('should throw', () => {
                const state = reducers_1.create();
                const attempt_appraise = () => void inventory_1.appraise_item_value(state, 'foo');
                chai_1.expect(attempt_appraise).to.throw('No item');
            });
        });
    });
});
//# sourceMappingURL=inventory_spec.js.map