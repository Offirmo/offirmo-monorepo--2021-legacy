"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const consts_1 = require("./consts");
const types_1 = require("./types");
const _1 = require(".");
describe('state - reducer', function () {
    const EXPECTED_CURRENCY_SLOT_COUNT = 2;
    describe('🆕 initial state', function () {
        it('should have correct defaults', function () {
            const state = _1.create();
            chai_1.expect(state).to.deep.equal({
                schema_version: consts_1.SCHEMA_VERSION,
                revision: 0,
                statistics: {
                // TODO
                }
            });
        });
    });
    describe('get_sorted_visible_achievements()', function () {
        it('should work on initial state', function () {
            const state = _1.create();
            chai_1.expect(_1.get_sorted_visible_achievements(state)).to.deep.equal([
                {
                    key: 'The First Step',
                    status: types_1.AchievementStatus.unlocked,
                }
            ]);
        });
    });
});
//# sourceMappingURL=state_spec.js.map