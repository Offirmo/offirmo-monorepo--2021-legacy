"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
let missing_descriptors = [];
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
                if (!ARCHETYPES[key]) {
                    missing_descriptors.push(key);
                }
                chai_1.expect(ARCHETYPES).to.have.property(key);
            });
        });
    });
    Object.keys(ARCHETYPES).forEach(function (hid) {
        describe(`hid "${hid}"`, function () {
            it('should have the correct format', () => {
                chai_1.expect(ARCHETYPES[hid]).to.have.property('good');
                chai_1.expect(ARCHETYPES[hid]).to.have.property('outcome');
                if (ARCHETYPES[hid].good)
                    chai_1.expect(Object.keys(ARCHETYPES[hid].outcome).length, 'outcome length').to.be.above(0);
            });
            it('should have an en i18n message', () => {
                chai_1.expect(_).to.have.nested.property(`adventures.${hid}`);
            });
        });
    });
    describe('stats', function () {
        it('brags about the number of stories', () => {
            const ENTRIES_GOOD = _1.ENTRIES.filter(entry => entry.good);
            console.log('Good entries: # ' + ENTRIES_GOOD.length);
        });
        it('has a correct distribution of outcomes');
        it('has an outcome of each type');
        it('auto helps to fix the errors', () => {
            if (missing_descriptors.length) {
                missing_descriptors.forEach(key => {
                    const outcome = {};
                    const text = _.adventures[key];
                    if (text.includes('{{level}}'))
                        outcome.level = true;
                    if (text.includes('{{health}}'))
                        outcome.health = true;
                    if (text.includes('{{mana}}'))
                        outcome.mana = true;
                    if (text.includes('{{strength}}'))
                        outcome.strength = true;
                    if (text.includes('{{agility}}'))
                        outcome.agility = true;
                    if (text.includes('{{charisma}}'))
                        outcome.charisma = true;
                    if (text.includes('{{wisdom}}'))
                        outcome.wisdom = true;
                    if (text.includes('{{luck}}'))
                        outcome.luck = true;
                    if (text.includes('{{attr_name}}'))
                        outcome.XXX_attribute = true;
                    if (text.includes('{{coin}}'))
                        outcome.coin = 'XXX';
                    if (text.includes('{{token}}'))
                        outcome.token = 1;
                    if (text.includes('{{item}}'))
                        outcome.XXX_armor_or_weapon = true;
                    if (Object.keys(outcome).length === 0)
                        outcome.armor_or_weapon_improvement = true;
                    const hid_part = `hid: '${key}',                              `;
                    console.log(`	{ good: true, type: story, ${hid_part.slice(0, 34)} outcome: ${JSON.stringify(outcome)}},`);
                });
            }
        });
    });
});
//# sourceMappingURL=index_spec.js.map