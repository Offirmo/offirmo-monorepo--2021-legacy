"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const consts_1 = require("./consts");
const _1 = require(".");
const sec_1 = require("./sec");
describe('@oh-my-rpg/state-progress - reducer', function () {
    describe('🆕  initial state', function () {
        it('should have correct defaults', function () {
            const state = _1.create(sec_1.get_lib_SEC());
            chai_1.expect(state).to.deep.equal({
                schema_version: consts_1.SCHEMA_VERSION,
                revision: 0,
                flags: null,
                achievements: null,
                statistics: {
                    good_play_count: 0,
                    bad_play_count: 0,
                    encountered_adventures: {},
                    encountered_monsters: {},
                    good_play_count_by_active_class: {},
                    bad_play_count_by_active_class: {},
                    has_account: false,
                    is_registered_alpha_player: false,
                }
            });
        });
    });
});
//# sourceMappingURL=state_spec.js.map