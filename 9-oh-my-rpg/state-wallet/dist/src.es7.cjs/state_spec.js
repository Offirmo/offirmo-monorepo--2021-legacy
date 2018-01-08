"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const consts_1 = require("./consts");
const _1 = require(".");
describe('💰 💰 💎  Currencies wallet state - reducer', function () {
    const EXPECTED_CURRENCY_SLOT_COUNT = 2;
    describe('🆕 initial state', function () {
        it('should have correct defaults to 0', function () {
            const state = _1.create();
            chai_1.expect(state).to.deep.equal({
                schema_version: consts_1.SCHEMA_VERSION,
                revision: 0,
                coin_count: 0,
                token_count: 0,
            });
            chai_1.expect(_1.ALL_CURRENCIES).to.have.lengthOf(EXPECTED_CURRENCY_SLOT_COUNT);
            _1.ALL_CURRENCIES.forEach((currency) => chai_1.expect(_1.get_currency_amount(state, currency), currency).to.equal(0));
        });
    });
    describe('📥 currency addition', function () {
        it('should work on initial state', function () {
            let state = _1.create();
            state = _1.add_amount(state, _1.Currency.coin, 3);
            chai_1.expect(_1.get_currency_amount(state, _1.Currency.coin), _1.Currency.coin).to.equal(3);
            chai_1.expect(_1.get_currency_amount(state, _1.Currency.token), _1.Currency.token).to.equal(0);
        });
        it('should work on simple non-empty state', function () {
            let state = _1.create();
            state = _1.add_amount(state, _1.Currency.coin, 3);
            state = _1.add_amount(state, _1.Currency.coin, 6);
            chai_1.expect(_1.get_currency_amount(state, _1.Currency.coin), _1.Currency.coin).to.equal(9);
            chai_1.expect(_1.get_currency_amount(state, _1.Currency.token), _1.Currency.token).to.equal(0);
        });
        it('should cap to a limit');
    });
    describe('📤 currency withdraw', function () {
        it('should throw on empty currency slot', function () {
            let state = _1.create();
            function remove() {
                state = _1.remove_amount(state, _1.Currency.coin, 3);
            }
            chai_1.expect(remove).to.throw('state-wallet: can\'t remove more than available, no credit !');
        });
        it('should throw on currency slot too low', function () {
            let state = _1.create();
            state = _1.add_amount(state, _1.Currency.coin, 3);
            function remove() {
                state = _1.remove_amount(state, _1.Currency.coin, 6);
            }
            chai_1.expect(remove).to.throw('state-wallet: can\'t remove more than available, no credit !');
        });
        it('should work in nominal case', function () {
            let state = _1.create();
            state = _1.add_amount(state, _1.Currency.coin, 3);
            state = _1.remove_amount(state, _1.Currency.coin, 2);
            chai_1.expect(_1.get_currency_amount(state, _1.Currency.coin), _1.Currency.coin).to.equal(1);
            chai_1.expect(_1.get_currency_amount(state, _1.Currency.token), _1.Currency.token).to.equal(0);
        });
    });
    describe('misc currency iteration', function () {
        it('should yield all currency slots');
    });
});
//# sourceMappingURL=state_spec.js.map