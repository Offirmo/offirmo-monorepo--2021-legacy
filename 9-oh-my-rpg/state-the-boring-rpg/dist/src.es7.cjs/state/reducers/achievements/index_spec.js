"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const typescript_string_enums_1 = require("typescript-string-enums");
const chai_1 = require("chai");
const state_progress_1 = require("@oh-my-rpg/state-progress");
const state_prng_1 = require("@oh-my-rpg/state-prng");
const consts_1 = require("../../../consts");
const __1 = require("..");
const _1 = require(".");
const achievements_1 = tslib_1.__importDefault(require("../../../data/achievements"));
describe(`${consts_1.LIB} - reducer`, function () {
    beforeEach(() => state_prng_1.xxx_internal_reset_prng_cache());
    describe('_refresh_achievements()', function () {
        context('🚫  when having no new achievements', function () {
            it('should not change the state at all', () => {
                const state = __1.create(); // includes an initial refresh
                // a second time
                const new_state = _1._refresh_achievements(state);
                chai_1.expect(new_state).to.equal(state); // immutability
            });
        });
        context('✅  when having new achievements', function () {
            it('should generate only a bunch of basic achievements', () => {
                let state = __1.create();
                // trigger an achievement out of band (would never happen for real)
                state = Object.assign({}, state, { avatar: Object.assign({}, state.avatar, { name: 'Foo' }) });
                const new_state = _1._refresh_achievements(state);
                chai_1.expect(new_state).not.to.equal(state); // immutability
            });
        });
    });
    describe('achievements', function () {
        achievements_1.default.forEach((definition) => {
            describe(`achievements "${definition.name}"`, function () {
                it('should be testable and not throw', () => {
                    let state = __1.create();
                    const status = definition.get_status(state);
                    chai_1.expect(typescript_string_enums_1.Enum.isType(state_progress_1.AchievementStatus, status)).to.be.true;
                });
            });
        });
        describe('statistics', function () {
            it(`achievements count: ${achievements_1.default.length}`);
        });
    });
});
//# sourceMappingURL=index_spec.js.map