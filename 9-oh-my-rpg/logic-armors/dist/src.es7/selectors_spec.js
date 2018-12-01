import { expect } from 'chai';
import { LIB } from './consts';
import { InventorySlot, ItemQuality, } from '@oh-my-rpg/definitions';
import { Random } from '@offirmo/random';
import { create, matches } from '.';
describe(`${LIB} - selectors`, function () {
    describe('matches', function () {
        const rng = Random.engines.mt19937().seed(789);
        const REF = create(rng, {
            quality: ItemQuality.rare,
            base_hid: 'socks',
            qualifier1_hid: 'onyx',
            qualifier2_hid: 'tormentor',
            base_strength: 17,
        });
        it('should correctly match when appropriate', function () {
            expect(matches(REF, {}), '0').to.be.true;
            expect(matches(REF, {
                quality: ItemQuality.rare,
            }), '1a').to.be.true;
            expect(matches(REF, {
                qualifier1_hid: 'onyx',
            }), '1b').to.be.true;
            expect(matches(REF, {
                quality: ItemQuality.rare,
                base_hid: 'socks',
            }), '2a').to.be.true;
            expect(matches(REF, {
                quality: ItemQuality.rare,
                base_hid: 'socks',
                qualifier1_hid: 'onyx',
                qualifier2_hid: 'tormentor',
                base_strength: 17,
            }), '5').to.be.true;
        });
        it('should correctly NOT match when appropriate', function () {
            expect(matches(REF, {
                quality: ItemQuality.common,
            }), '1a').to.be.false;
            expect(matches(REF, {
                qualifier1_hid: 'dwarven',
            }), '1b').to.be.false;
            expect(matches(REF, {
                quality: ItemQuality.rare,
                base_hid: 'mantle',
            }), '2a').to.be.false;
            expect(matches(REF, {
                quality: ItemQuality.legendary,
                base_hid: 'socks',
            }), '2b').to.be.false;
            expect(matches(REF, {
                quality: ItemQuality.rare,
                base_hid: 'socks',
                qualifier1_hid: 'onyx',
                qualifier2_hid: 'tormentor',
                base_strength: 20,
            }), '5').to.be.false;
        });
        it('should correctly throw when appropriate', function () {
            expect(() => {
                matches(REF, {
                    slot: InventorySlot.weapon,
                });
            }, 'slot').to.throw('non-armor slot');
            expect(() => {
                matches(REF, {
                    foo: 42,
                });
            }, 'foreign').to.throw('non-armor key');
        });
    });
});
//# sourceMappingURL=selectors_spec.js.map