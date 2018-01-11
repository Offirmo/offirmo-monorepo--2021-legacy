"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const types_1 = require("./types");
const _1 = require("./");
describe('@oh-my-rpg/definitions - item utilities', function () {
    describe('compare_items_by_slot', function () {
        it('should sort correctly', () => {
            const list = [
                _1.create_item_base(types_1.InventorySlot.weapon),
                _1.create_item_base(types_1.InventorySlot.armor),
                _1.create_item_base(types_1.InventorySlot.armor),
                _1.create_item_base(types_1.InventorySlot.weapon),
            ];
            const [w1, a1, a2, w2] = list;
            chai_1.expect(list.sort(_1.compare_items_by_slot)).to.deep.equal([
                w1,
                w2,
                a1,
                a2,
            ]);
        });
    });
    describe('compare_items_by_quality', function () {
        it('should sort correctly', () => {
            const list = [
                _1.create_item_base(types_1.InventorySlot.weapon, types_1.ItemQuality.artifact),
                _1.create_item_base(types_1.InventorySlot.weapon, types_1.ItemQuality.common),
                _1.create_item_base(types_1.InventorySlot.weapon, types_1.ItemQuality.uncommon),
                _1.create_item_base(types_1.InventorySlot.weapon, types_1.ItemQuality.legendary),
                _1.create_item_base(types_1.InventorySlot.weapon, types_1.ItemQuality.rare),
                _1.create_item_base(types_1.InventorySlot.weapon, types_1.ItemQuality.epic),
            ];
            const [artifact, common, uncommon, legendary, rare, epic] = list;
            chai_1.expect(list.sort(_1.compare_items_by_quality)).to.deep.equal([
                artifact,
                legendary,
                epic,
                rare,
                uncommon,
                common,
            ]);
        });
    });
});
//# sourceMappingURL=item_spec.js.map