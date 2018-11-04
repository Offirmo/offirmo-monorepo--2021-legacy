"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const deep_freeze_strict_1 = tslib_1.__importDefault(require("deep-freeze-strict"));
const chai_1 = require("chai");
const consts_1 = require("./consts");
const _1 = require(".");
const sec_1 = require("./sec");
describe('@oh-my-rpg/state-codes - reducer', function () {
    describe('🆕  initial state', function () {
        it('should have correct defaults', function () {
            const state = _1.create(sec_1.get_lib_SEC());
            chai_1.expect(state).to.deep.equal({
                schema_version: consts_1.SCHEMA_VERSION,
                revision: 0,
                redeemed_codes: {},
            });
        });
    });
    describe('code redemption', function () {
        const BASE_INFOS = deep_freeze_strict_1.default({
            has_energy_depleted: false,
            good_play_count: 0,
            is_alpha_player: true,
            is_player_since_alpha: true,
        });
        context('when the code is unknown or when the conditions are NOT met', function () {
            // no need to test detailed, see selectors
            it('should reject and not update the state', () => {
                let state = _1.create();
                let SEC = sec_1.get_lib_SEC();
                const do_it = () => _1.redeem_code(SEC, state, 'TESTNEVER', BASE_INFOS);
                chai_1.expect(do_it).to.throw('This code is either non-existing or non redeemable at the moment');
                chai_1.expect(state.redeemed_codes).to.deep.equal({});
                chai_1.expect(state.revision).to.equal(0);
            });
        });
        context('when the conditions are met', function () {
            it('should update the state', () => {
                let state = _1.create();
                let SEC = sec_1.get_lib_SEC();
                const code = 'TESTALWAYS';
                state = _1.redeem_code(SEC, state, code, BASE_INFOS);
                chai_1.expect(state.redeemed_codes).to.have.property(code);
                chai_1.expect(state.redeemed_codes[code]).to.have.property('redeem_count', 1);
                chai_1.expect(state.redeemed_codes[code]).to.have.property('last_redeem_date_minutes');
                chai_1.expect(state.revision).to.equal(1);
                state = _1.redeem_code(SEC, state, code, BASE_INFOS);
                chai_1.expect(state.redeemed_codes).to.have.property(code);
                chai_1.expect(state.redeemed_codes[code]).to.have.property('redeem_count', 2);
                chai_1.expect(state.redeemed_codes[code]).to.have.property('last_redeem_date_minutes');
                chai_1.expect(state.revision).to.equal(2);
            });
        });
    });
});
//# sourceMappingURL=state_spec.js.map