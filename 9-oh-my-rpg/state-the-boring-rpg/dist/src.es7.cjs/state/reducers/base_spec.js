"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const state_prng_1 = require("@oh-my-rpg/state-prng");
const consts_1 = require("../../consts");
describe(`${consts_1.LIB} - reducer`, function () {
    beforeEach(() => state_prng_1.xxx_internal_reset_prng_cache());
    describe('👆🏾 user actions', function () {
        describe('inventory management', function () {
            it('should allow un-equiping an item'); // not now, but useful for ex. for immediately buying a better item on the market
            it('should allow equiping an item, correctly swapping with an already equipped item');
            it('should allow selling an item');
        });
    });
});
//# sourceMappingURL=base_spec.js.map