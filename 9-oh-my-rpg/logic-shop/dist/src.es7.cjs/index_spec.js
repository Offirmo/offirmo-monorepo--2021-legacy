"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const definitions_1 = require("@oh-my-rpg/definitions");
const _1 = require(".");
describe('📦 💰 📤 📥  shop logic:', function () {
    describe('appraisal', function () {
        context('of armors', function () {
            it('should work', () => {
                const price = _1.appraise({
                    slot: definitions_1.InventorySlot.armor,
                    base_hid: 'whatever',
                    qualifier1_hid: 'whatever',
                    qualifier2_hid: 'whatever',
                    quality: definitions_1.ItemQuality.legendary,
                    base_strength: 14,
                    enhancement_level: 3,
                });
                chai_1.expect(price).to.be.a('number');
                chai_1.expect(price).to.equal(3670);
            });
        });
        context('of weapons', function () {
            it('should work', () => {
                const price = _1.appraise({
                    slot: definitions_1.InventorySlot.weapon,
                    base_hid: 'whatever',
                    qualifier1_hid: 'whatever',
                    qualifier2_hid: 'whatever',
                    quality: definitions_1.ItemQuality.legendary,
                    base_strength: 14,
                    enhancement_level: 3,
                });
                chai_1.expect(price).to.be.a('number');
                chai_1.expect(price).to.equal(3262);
            });
        });
    });
});
//# sourceMappingURL=index_spec.js.map