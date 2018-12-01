"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const consts_1 = require("./consts");
const definitions_1 = require("@oh-my-rpg/definitions");
const random_1 = require("@offirmo/random");
const _1 = require(".");
describe(`${consts_1.LIB} - selectors`, function () {
    describe('matches', function () {
        const rng = random_1.Random.engines.mt19937().seed(789);
        const REF = _1.create(rng, {
            quality: definitions_1.ItemQuality.rare,
            base_hid: 'socks',
            qualifier1_hid: 'onyx',
            qualifier2_hid: 'tormentor',
            base_strength: 17,
        });
        it('should correctly match when appropriate', function () {
            chai_1.expect(_1.matches(REF, {}), '0').to.be.true;
            chai_1.expect(_1.matches(REF, {
                quality: definitions_1.ItemQuality.rare,
            }), '1a').to.be.true;
            chai_1.expect(_1.matches(REF, {
                qualifier1_hid: 'onyx',
            }), '1b').to.be.true;
            chai_1.expect(_1.matches(REF, {
                quality: definitions_1.ItemQuality.rare,
                base_hid: 'socks',
            }), '2a').to.be.true;
            chai_1.expect(_1.matches(REF, {
                quality: definitions_1.ItemQuality.rare,
                base_hid: 'socks',
                qualifier1_hid: 'onyx',
                qualifier2_hid: 'tormentor',
                base_strength: 17,
            }), '5').to.be.true;
        });
        it('should correctly NOT match when appropriate', function () {
            chai_1.expect(_1.matches(REF, {
                quality: definitions_1.ItemQuality.common,
            }), '1a').to.be.false;
            chai_1.expect(_1.matches(REF, {
                qualifier1_hid: 'dwarven',
            }), '1b').to.be.false;
            chai_1.expect(_1.matches(REF, {
                quality: definitions_1.ItemQuality.rare,
                base_hid: 'mantle',
            }), '2a').to.be.false;
            chai_1.expect(_1.matches(REF, {
                quality: definitions_1.ItemQuality.legendary,
                base_hid: 'socks',
            }), '2b').to.be.false;
            chai_1.expect(_1.matches(REF, {
                quality: definitions_1.ItemQuality.rare,
                base_hid: 'socks',
                qualifier1_hid: 'onyx',
                qualifier2_hid: 'tormentor',
                base_strength: 20,
            }), '5').to.be.false;
        });
        it('should correctly throw when appropriate', function () {
            chai_1.expect(() => {
                _1.matches(REF, {
                    slot: definitions_1.InventorySlot.weapon,
                });
            }, 'slot').to.throw('non-armor slot');
            chai_1.expect(() => {
                _1.matches(REF, {
                    foo: 42,
                });
            }, 'foreign').to.throw('non-armor key');
        });
    });
});
//# sourceMappingURL=selectors_spec.js.map