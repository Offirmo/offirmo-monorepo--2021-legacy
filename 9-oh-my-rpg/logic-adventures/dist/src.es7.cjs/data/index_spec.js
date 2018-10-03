"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
describe('@oh-my-rpg/logic-adventures - data:', function () {
    const _ = _1.i18n_messages.en;
    const ARCHETYPES = {};
    _1.ENTRIES.forEach(entry => ARCHETYPES[entry.hid] = entry);
    Object.keys(_.adventures).forEach(function (key) {
        describe(`i18n key "${key}"`, function () {
            it('should have the correct format', () => {
                chai_1.expect(_.adventures[key]).to.be.a('string');
            });
            it('should have a corresponding descriptor', () => {
                chai_1.expect(ARCHETYPES).to.have.property(key);
            });
        });
    });
    Object.keys(ARCHETYPES).forEach(function (hid) {
        describe(`hid "${hid}"`, function () {
            it('should have the correct format', () => {
                chai_1.expect(ARCHETYPES[hid]).to.have.property('good');
                chai_1.expect(ARCHETYPES[hid]).to.have.property('outcome');
            });
            it('should have an en i18n message', () => {
                chai_1.expect(_).to.have.nested.property(`adventures.${hid}`);
            });
        });
    });
    describe('stats', function () {
        it('brags', () => {
            const ENTRIES_GOOD = _1.ENTRIES.filter(entry => entry.good);
            console.log('Good entries: # ' + ENTRIES_GOOD.length);
        });
        it('has a correct distribution of outcomes');
        it('has an outcome of each type');
    });
});
//# sourceMappingURL=index_spec.js.map