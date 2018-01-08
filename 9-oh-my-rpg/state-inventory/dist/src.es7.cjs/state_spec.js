"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const definitions_1 = require("@oh-my-rpg/definitions");
const consts_1 = require("./consts");
const definitions_2 = require("@oh-my-rpg/definitions");
const _1 = require(".");
describe('📦 📦 📦  Inventory state - reducer', function () {
    const EXPECTED_UNSLOTTED_INVENTORY_LENGTH = 20;
    const DUMMY_ITEM = Object.assign({}, definitions_1.create_element_base(definitions_1.ElementType.item), { slot: definitions_2.InventorySlot.none, quality: definitions_2.ItemQuality.common });
    const DUMMY_EQUIPABLE_ITEM = Object.assign({}, definitions_1.create_element_base(definitions_1.ElementType.item), { slot: definitions_2.InventorySlot.weapon, quality: definitions_2.ItemQuality.common });
    const DUMMY_NON_EQUIPABLE_ITEM = DUMMY_ITEM;
    describe('🆕 initial state', function () {
        it('should have correct defaults', function () {
            const state = _1.create();
            chai_1.expect(state).to.deep.equal({
                schema_version: consts_1.SCHEMA_VERSION,
                revision: 0,
                unslotted_capacity: 20,
                slotted: {},
                unslotted: [
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                ],
            });
            chai_1.expect(state.unslotted_capacity).to.equal(EXPECTED_UNSLOTTED_INVENTORY_LENGTH);
            chai_1.expect(state.unslotted).to.have.lengthOf(EXPECTED_UNSLOTTED_INVENTORY_LENGTH);
            chai_1.expect(Object.keys(state.slotted)).to.have.lengthOf(0);
            chai_1.expect(_1.get_item_count(state), 'i').to.equal(0);
            chai_1.expect(_1.get_equiped_item_count(state), 'e').to.equal(0);
            chai_1.expect(_1.get_unequiped_item_count(state), 'u').to.equal(0);
        });
    });
    describe('📥 item addition', function () {
        it('should work on empty state', function () {
            let state = _1.create();
            state = _1.add_item(state, DUMMY_ITEM);
            chai_1.expect(state.unslotted).to.have.lengthOf(EXPECTED_UNSLOTTED_INVENTORY_LENGTH);
            chai_1.expect(_1.get_item_count(state)).to.equal(1);
        });
        it('should work on simple non-empty state', function () {
            let state = _1.create();
            state = _1.add_item(state, DUMMY_ITEM);
            state = _1.add_item(state, DUMMY_ITEM);
            chai_1.expect(state.unslotted, 'unslotted').to.have.lengthOf(EXPECTED_UNSLOTTED_INVENTORY_LENGTH);
            chai_1.expect(_1.get_item_count(state), 'item count').to.equal(2);
        });
        it('should fail when the inventory is full', function () {
            let state = _1.create();
            state = _1.add_item(state, DUMMY_ITEM);
            state = _1.add_item(state, DUMMY_ITEM);
            state = _1.add_item(state, DUMMY_ITEM);
            state = _1.add_item(state, DUMMY_ITEM);
            state = _1.add_item(state, DUMMY_ITEM);
            state = _1.add_item(state, DUMMY_ITEM);
            state = _1.add_item(state, DUMMY_ITEM);
            state = _1.add_item(state, DUMMY_ITEM);
            state = _1.add_item(state, DUMMY_ITEM);
            state = _1.add_item(state, DUMMY_ITEM);
            state = _1.add_item(state, DUMMY_ITEM);
            state = _1.add_item(state, DUMMY_ITEM);
            state = _1.add_item(state, DUMMY_ITEM);
            state = _1.add_item(state, DUMMY_ITEM);
            state = _1.add_item(state, DUMMY_ITEM);
            state = _1.add_item(state, DUMMY_ITEM);
            state = _1.add_item(state, DUMMY_ITEM);
            state = _1.add_item(state, DUMMY_ITEM);
            state = _1.add_item(state, DUMMY_ITEM);
            state = _1.add_item(state, DUMMY_ITEM);
            chai_1.expect(state.unslotted).to.have.lengthOf(EXPECTED_UNSLOTTED_INVENTORY_LENGTH);
            function addLast() {
                state = _1.add_item(state, DUMMY_ITEM);
            }
            chai_1.expect(addLast).to.throw('inventory is full!');
        });
        it('should find a free slot when some items where recently removed', function () {
            const item1 = DUMMY_ITEM;
            const item2 = Object.assign({}, definitions_1.create_element_base(definitions_1.ElementType.item), { slot: definitions_2.InventorySlot.none, quality: definitions_2.ItemQuality.common });
            let state = _1.create();
            state = _1.add_item(state, item1);
            state = _1.add_item(state, item1);
            state = _1.remove_item(state, 0);
            state = _1.add_item(state, item2);
            chai_1.expect(_1.get_item_count(state), 'item count').to.equal(2);
            // note: state was auto-sorted
            chai_1.expect(_1.get_item_at_coordinates(state, 0)).to.equal(item1);
            chai_1.expect(_1.get_item_at_coordinates(state, 1)).to.equal(item2);
        });
    });
    describe('📤 item removal', function () {
        it('should throw on empty target slot', function () {
            let state = _1.create();
            function remove_one() {
                state = _1.remove_item(state, 0);
            }
            chai_1.expect(remove_one).to.throw('can\'t remove item at #0, not found');
        });
        it('should work in nominal case', function () {
            let state = _1.create();
            state = _1.add_item(state, DUMMY_ITEM);
            state = _1.add_item(state, DUMMY_ITEM);
            state = _1.remove_item(state, 0);
            chai_1.expect(_1.get_item_count(state), 'item count').to.equal(1);
            chai_1.expect(_1.get_item_at_coordinates(state, 1)).to.be.null;
            chai_1.expect(_1.get_item_at_coordinates(state, 2)).to.be.null;
        });
    });
    describe('⬆ item equipping', function () {
        it('should fail on missing item', function () {
            let state = _1.create();
            function equip_empty() {
                state = _1.equip_item(state, 0);
            }
            chai_1.expect(equip_empty).to.throw('can\'t equip item at #0, not found!');
        });
        it('should fail on non-equipable item', function () {
            let state = _1.create();
            state = _1.add_item(state, DUMMY_NON_EQUIPABLE_ITEM);
            function equip_unequipable() {
                state = _1.equip_item(state, 0);
            }
            chai_1.expect(equip_unequipable).to.throw('not equipable!');
        });
        it('should work on simple non-empty state, equip to the correct slot and correctly remove from unslotted', function () {
            let state = _1.create();
            state = _1.add_item(state, DUMMY_EQUIPABLE_ITEM);
            chai_1.expect(_1.get_equiped_item_count(state), 'e1').to.equal(0);
            chai_1.expect(_1.get_unequiped_item_count(state), 'u1').to.equal(1);
            chai_1.expect(_1.get_item_count(state), 'i1').to.equal(1);
            state = _1.equip_item(state, 0);
            chai_1.expect(_1.get_equiped_item_count(state), 'e2').to.equal(1);
            chai_1.expect(_1.get_unequiped_item_count(state), 'u2').to.equal(0);
            chai_1.expect(_1.get_item_count(state), 'i1').to.equal(1);
        });
        it('should work on simple non-empty state and correctly swap if the slot was occupied', function () {
            let state = _1.create();
            const item1 = DUMMY_EQUIPABLE_ITEM;
            state = _1.add_item(state, item1);
            state = _1.equip_item(state, 0);
            const item2 = Object.assign({}, definitions_1.create_element_base(definitions_1.ElementType.item), { slot: definitions_2.InventorySlot.weapon, quality: definitions_2.ItemQuality.rare });
            state = _1.add_item(state, item2);
            state = _1.equip_item(state, 0);
            chai_1.expect(_1.get_equiped_item_count(state), 'e').to.equal(1);
            chai_1.expect(_1.get_unequiped_item_count(state), 'u').to.equal(1);
            chai_1.expect(_1.get_item_count(state), 'i').to.equal(2);
            chai_1.expect(_1.get_item_in_slot(state, definitions_2.InventorySlot.weapon)).to.equal(item2);
            chai_1.expect(_1.get_item_at_coordinates(state, 0)).to.equal(item1);
        });
    });
    describe('⬇ item unequipping', function () {
        it('should fail on missing slot', function () {
            let state = _1.create();
            function unequip_empty() {
                state = _1.unequip_item(state, definitions_2.InventorySlot.weapon);
            }
            chai_1.expect(unequip_empty).to.throw('can\'t unequip item from slot weapon, it\'s empty!');
        });
        it('should work on simple non-empty state, unequip to the correct slot and correctly add to unslotted', function () {
            let state = _1.create();
            const item = DUMMY_EQUIPABLE_ITEM;
            state = _1.add_item(state, item);
            state = _1.equip_item(state, 0);
            state = _1.unequip_item(state, definitions_2.InventorySlot.weapon);
            chai_1.expect(_1.get_item_count(state), 'item count 1').to.equal(1);
            chai_1.expect(_1.get_unequiped_item_count(state), 'item count 2').to.equal(1);
            chai_1.expect(_1.get_item_in_slot(state, definitions_2.InventorySlot.weapon)).to.be.null;
        });
        it('should fail when the inventory is full', function () {
            let state = _1.create();
            const item = DUMMY_EQUIPABLE_ITEM;
            state = _1.add_item(state, item);
            state = _1.equip_item(state, 0);
            const itemX = DUMMY_ITEM;
            state = _1.add_item(state, itemX);
            state = _1.add_item(state, itemX);
            state = _1.add_item(state, itemX);
            state = _1.add_item(state, itemX);
            state = _1.add_item(state, itemX);
            state = _1.add_item(state, itemX);
            state = _1.add_item(state, itemX);
            state = _1.add_item(state, itemX);
            state = _1.add_item(state, itemX);
            state = _1.add_item(state, itemX);
            state = _1.add_item(state, itemX);
            state = _1.add_item(state, itemX);
            state = _1.add_item(state, itemX);
            state = _1.add_item(state, itemX);
            state = _1.add_item(state, itemX);
            state = _1.add_item(state, itemX);
            state = _1.add_item(state, itemX);
            state = _1.add_item(state, itemX);
            state = _1.add_item(state, itemX);
            state = _1.add_item(state, itemX);
            chai_1.expect(_1.get_item_count(state), 'item count 1').to.equal(21);
            chai_1.expect(_1.get_unequiped_item_count(state), 'item count 2').to.equal(20);
            function unequip() {
                state = _1.unequip_item(state, definitions_2.InventorySlot.weapon);
            }
            chai_1.expect(unequip).to.throw('inventory is full!');
        });
    });
    describe('misc items iteration', function () {
        it('should yield all unequiped slots', () => {
            const item1 = Object.assign({}, definitions_1.create_element_base(definitions_1.ElementType.item), { slot: definitions_2.InventorySlot.armor, quality: definitions_2.ItemQuality.common });
            const item2 = Object.assign({}, definitions_1.create_element_base(definitions_1.ElementType.item), { slot: definitions_2.InventorySlot.weapon, quality: definitions_2.ItemQuality.common });
            const item3 = Object.assign({}, definitions_1.create_element_base(definitions_1.ElementType.item), { slot: definitions_2.InventorySlot.none, quality: definitions_2.ItemQuality.common });
            let state = _1.create();
            state = _1.add_item(state, item1);
            state = _1.add_item(state, item2);
            state = _1.add_item(state, item3);
            state = _1.remove_item(state, 0);
            const yielded_items = Array.from(_1.iterables_unslotted(state));
            console.log(yielded_items);
            chai_1.expect(yielded_items).to.have.lengthOf(EXPECTED_UNSLOTTED_INVENTORY_LENGTH);
            chai_1.expect(yielded_items[0]).to.equal(item2);
            chai_1.expect(yielded_items[1]).to.equal(item3);
            chai_1.expect(yielded_items[2]).to.be.null;
            chai_1.expect(yielded_items[3]).to.be.null;
            chai_1.expect(yielded_items[EXPECTED_UNSLOTTED_INVENTORY_LENGTH - 1]).to.be.null;
        });
    });
});
//# sourceMappingURL=state_spec.js.map