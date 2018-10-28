"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const consts_1 = require("./consts");
const _1 = require(".");
const sec_1 = require("./sec");
describe('@oh-my-rpg/state-engagement - reducer', function () {
    describe('🆕  initial state', function () {
        it('should have correct defaults', function () {
            const state = _1.create(sec_1.get_lib_SEC());
            chai_1.expect(state).to.deep.equal({
                schema_version: consts_1.SCHEMA_VERSION,
                revision: 0,
                queue: [],
            });
        });
    });
});
//# sourceMappingURL=state_spec.js.map