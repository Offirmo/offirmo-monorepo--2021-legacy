"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const consts_1 = require("./consts");
const _1 = require(".");
describe('🤕 ❤️  Meta state - reducer', function () {
    describe('🆕  initial state', function () {
        const TEST_UUID_v1 = 'uu1dgqu3h0FydqWyQ~6cYv3g';
        it('should have correct defaults and a unique uuid', function () {
            let state = _1.create();
            // uuid is random
            chai_1.expect(state.uuid).to.have.lengthOf(TEST_UUID_v1.length);
            state = Object.assign({}, state, { uuid: TEST_UUID_v1 });
            chai_1.expect(state).to.deep.equal({
                schema_version: consts_1.SCHEMA_VERSION,
                revision: 0,
                uuid: TEST_UUID_v1,
                name: 'anonymous',
                email: null,
                allow_telemetry: true,
            });
        });
    });
});
//# sourceMappingURL=state_spec.js.map