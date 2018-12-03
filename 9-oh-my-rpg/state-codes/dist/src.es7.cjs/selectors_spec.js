"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chai_1 = require("chai");
const deep_freeze_strict_1 = tslib_1.__importDefault(require("deep-freeze-strict"));
const consts_1 = require("./consts");
const _1 = require(".");
const test_1 = require("./test");
/////////////////////
describe(`${consts_1.LIB} - selectors`, function () {
    describe('is_code()', function () {
        context('when the code is not a string', function () {
            it('should return false', () => {
                const fut = _1.is_code;
                chai_1.expect(fut()).to.be.false;
                chai_1.expect(fut(null)).to.be.false;
                chai_1.expect(fut(42)).to.be.false;
            });
        });
        context('when the code normalizes to an empty string', function () {
            it('should return false', () => {
                chai_1.expect(_1.is_code(' 	 ')).to.be.false;
                chai_1.expect(_1.is_code(' - ')).to.be.false;
            });
        });
        context('when the code is correct', function () {
            it('should return true', () => {
                chai_1.expect(_1.is_code(' TESTNEVER')).to.be.true;
            });
        });
    });
    describe('is_code_redeemable()', function () {
        // using is_code() so no need to re-test
        //context('when the code is not valid')
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
                    const code_spec = test_1.CODESPECS_BY_KEY['TESTONCE'];
                    chai_1.expect(_1.is_code_redeemable(state, code_spec, BASE_INFOS), '#1').to.be.true;
                    state = _1.attempt_to_redeem_code(state, code_spec, BASE_INFOS);
                    chai_1.expect(_1.is_code_redeemable(state, code_spec, BASE_INFOS), '#2').to.be.false;
                });
                it('should return true until the limit is met - twice', () => {
                    let state = _1.create();
                    const code_spec = test_1.CODESPECS_BY_KEY['TESTTWICE'];
                    chai_1.expect(_1.is_code_redeemable(state, code_spec, BASE_INFOS), '#1').to.be.true;
                    state = _1.attempt_to_redeem_code(state, code_spec, BASE_INFOS);
                    chai_1.expect(_1.is_code_redeemable(state, code_spec, BASE_INFOS), '#2').to.be.true;
                    state = _1.attempt_to_redeem_code(state, code_spec, BASE_INFOS);
                    chai_1.expect(_1.is_code_redeemable(state, code_spec, BASE_INFOS), '#3').to.be.false;
                });
            });
            describe('is_redeemable custom condition', function () {
                context('when the conditions are met', function () {
                    it('should always return true', () => {
                        const code_spec = test_1.CODESPECS_BY_KEY['TESTALWAYS'];
                        chai_1.expect(_1.is_code_redeemable(_1.create(), code_spec, BASE_INFOS)).to.be.true;
                    });
                });
                context('when the condition are NOT met', function () {
                    it('should return false', () => {
                        const code_spec = test_1.CODESPECS_BY_KEY['TESTNEVER'];
                        chai_1.expect(_1.is_code_redeemable(_1.create(), code_spec, BASE_INFOS)).to.be.false;
                    });
                });
            });
        });
    });
});
//# sourceMappingURL=selectors_spec.js.map