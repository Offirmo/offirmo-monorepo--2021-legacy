"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const logic_armors_1 = require("@oh-my-rpg/logic-armors");
const logic_weapons_1 = require("@oh-my-rpg/logic-weapons");
const _1 = require(".");
describe('@oh-my-rpg/state-inventory - sorting', function () {
    describe('comparison of different types', function () {
        it('should work - equality', function () {
            const DUMMY_ITEM_01 = logic_weapons_1.generate_random_demo_weapon();
            const DUMMY_ITEM_02 = logic_armors_1.generate_random_demo_armor();
            chai_1.expect(_1.compare_items(DUMMY_ITEM_01, DUMMY_ITEM_01), 'equality - 1').to.equal(0);
            chai_1.expect(_1.compare_items(DUMMY_ITEM_02, DUMMY_ITEM_02), 'equality - 2').to.equal(0);
        });
        it('should work - lower/higher than', function () {
            const DUMMY_ITEM_01 = logic_weapons_1.generate_random_demo_weapon();
            const DUMMY_ITEM_02 = logic_armors_1.generate_random_demo_armor();
            chai_1.expect(_1.compare_items(DUMMY_ITEM_01, DUMMY_ITEM_02), 'diff - 1-2').to.equal(-1);
            chai_1.expect(_1.compare_items(DUMMY_ITEM_02, DUMMY_ITEM_01), 'diff - 1-2').to.equal(1);
        });
    });
});
//# sourceMappingURL=compare_spec.js.map