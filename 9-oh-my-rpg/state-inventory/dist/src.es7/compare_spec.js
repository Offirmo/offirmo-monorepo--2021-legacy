import { expect } from 'chai';
import { generate_random_demo_armor } from '@oh-my-rpg/logic-armors';
import { generate_random_demo_weapon } from '@oh-my-rpg/logic-weapons';
import { compare_items_by_slot_then_strength, } from '.';
describe('@oh-my-rpg/state-inventory - sorting', function () {
    describe('comparison of different types', function () {
        it('should work - equality', function () {
            const DUMMY_ITEM_01 = generate_random_demo_weapon();
            const DUMMY_ITEM_02 = generate_random_demo_armor();
            expect(compare_items_by_slot_then_strength(DUMMY_ITEM_01, DUMMY_ITEM_01), 'equality - 1').to.equal(0);
            expect(compare_items_by_slot_then_strength(DUMMY_ITEM_02, DUMMY_ITEM_02), 'equality - 2').to.equal(0);
        });
        it('should work - lower/higher than', function () {
            const DUMMY_ITEM_01 = generate_random_demo_weapon();
            const DUMMY_ITEM_02 = generate_random_demo_armor();
            expect(compare_items_by_slot_then_strength(DUMMY_ITEM_01, DUMMY_ITEM_02), 'diff - 1-2').to.equal(-1);
            expect(compare_items_by_slot_then_strength(DUMMY_ITEM_02, DUMMY_ITEM_01), 'diff - 1-2').to.equal(1);
        });
    });
});
//# sourceMappingURL=compare_spec.js.map