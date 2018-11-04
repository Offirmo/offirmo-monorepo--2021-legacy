"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chai_1 = require("chai");
const deep_freeze_strict_1 = tslib_1.__importDefault(require("deep-freeze-strict"));
const _1 = require(".");
const sec_1 = require("./sec");
describe('@oh-my-rpg/state-codes - selectors', function () {
    describe('is_code()', function () {
        context('when the code is not a string', function () {
            it('should return false', () => {
                const fut = _1.is_code;
                chai_1.expect(fut()).to.be.false;
                chai_1.expect(fut(null)).to.be.false;
                chai_1.expect(fut(42)).to.be.false;
            });
        });
        context('when the code is unknown', function () {
            it('should return false', () => {
                chai_1.expect(_1.is_code('FOO')).to.be.false;
            });
        });
        context('when the code is known', function () {
            it('should return true', () => {
                chai_1.expect(_1.is_code('TESTNEVER')).to.be.true;
            });
        });
    });
    describe('is_code_redeemable()', function () {
        // should be using is_code() so no need to re-test
        context('when the code is not valid or not known', function () {
            it('should return false', () => {
                const fut = _1.is_code_redeemable;
                chai_1.expect(fut()).to.be.false;
                chai_1.expect(fut({}, null)).to.be.false;
                chai_1.expect(fut({}, 42)).to.be.false;
                chai_1.expect(fut({}, 'FOO')).to.be.false;
            });
        });
        context('when the code is known', function () {
            const BASE_INFOS = deep_freeze_strict_1.default({
                has_energy_depleted: false,
                good_play_count: 0,
                is_alpha_player: true,
                is_player_since_alpha: true,
            });
            describe('count integrated condition', function () {
                it('should return true until the limit is met - once', () => {
                    let state = _1.create();
                    let SEC = sec_1.get_lib_SEC();
                    chai_1.expect(_1.is_code_redeemable(state, 'TESTONCE', BASE_INFOS), '#1').to.be.true;
                    state = _1.redeem_code(SEC, state, 'TESTONCE', BASE_INFOS);
                    chai_1.expect(_1.is_code_redeemable(state, 'TESTONCE', BASE_INFOS), '#2').to.be.false;
                });
                it('should return true until the limit is met - twice', () => {
                    let state = _1.create();
                    let SEC = sec_1.get_lib_SEC();
                    chai_1.expect(_1.is_code_redeemable(state, 'TESTTWICE', BASE_INFOS), '#1').to.be.true;
                    state = _1.redeem_code(SEC, state, 'TESTTWICE', BASE_INFOS);
                    chai_1.expect(_1.is_code_redeemable(state, 'TESTTWICE', BASE_INFOS), '#2').to.be.true;
                    state = _1.redeem_code(SEC, state, 'TESTTWICE', BASE_INFOS);
                    chai_1.expect(_1.is_code_redeemable(state, 'TESTTWICE', BASE_INFOS), '#3').to.be.false;
                });
            });
            describe('is_redeemable custom condition', function () {
                context('when the conditions are met', function () {
                    it('should always return true', () => {
                        chai_1.expect(_1.is_code_redeemable(_1.create(), 'TESTALWAYS', BASE_INFOS)).to.be.true;
                    });
                });
                context('when the condition are NOT met', function () {
                    it('should return false', () => {
                        chai_1.expect(_1.is_code_redeemable(_1.create(), 'TESTNEVER', BASE_INFOS)).to.be.false;
                    });
                });
            });
        });
    });
});
//# sourceMappingURL=selectors_spec.js.map