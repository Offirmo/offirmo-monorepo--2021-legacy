import { expect } from 'chai';
import { i18n_messages, ENTRIES, } from '.';
describe('@oh-my-rpg/logic-adventures - data:', function () {
    const _ = i18n_messages.en;
    const ARCHETYPES = {};
    ENTRIES.forEach(entry => ARCHETYPES[entry.hid] = entry);
    Object.keys(_.adventures).forEach(function (key) {
        describe(`i18n key "${key}"`, function () {
            it('should have the correct format', () => {
                expect(_.adventures[key]).to.be.a('string');
            });
            it('should have a corresponding descriptor', () => {
                expect(ARCHETYPES).to.have.property(key);
            });
        });
    });
    Object.keys(ARCHETYPES).forEach(function (hid) {
        describe(`hid "${hid}"`, function () {
            it('should have the correct format', () => {
                expect(ARCHETYPES[hid]).to.have.property('good');
                expect(ARCHETYPES[hid]).to.have.property('outcome');
            });
            it('should have an en i18n message', () => {
                expect(_).to.have.nested.property(`adventures.${hid}`);
            });
        });
    });
    describe('stats', function () {
        it('brags', () => {
            const ENTRIES_GOOD = ENTRIES.filter(entry => entry.good);
            console.log('Good entries: # ' + ENTRIES_GOOD.length);
        });
        it('has a correct distribution of outcomes');
        it('has an outcome of each type');
    });
});
//# sourceMappingURL=index_spec.js.map