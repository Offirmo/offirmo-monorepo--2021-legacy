"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
describe('@oh-my-rpg/definitions - constants', function () {
    describe('item quality', function () {
        describe('mapping to int', function () {
            it('should be up-to-date', () => {
                chai_1.expect(Object.keys(_1.ITEM_QUALITIES_TO_INT)).to.have.lengthOf(_1.ITEM_QUALITIES.length);
            });
        });
    });
    describe('inventory slots', function () {
        describe('mapping to int', function () {
            it('should be up-to-date', () => {
                chai_1.expect(Object.keys(_1.ITEM_SLOTS_TO_INT)).to.have.lengthOf(_1.ITEM_SLOTS.length);
            });
        });
    });
});
//# sourceMappingURL=consts_spec.js.map