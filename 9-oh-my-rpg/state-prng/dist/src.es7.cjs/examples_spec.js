"use strict";
/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const consts_1 = require("./consts");
const sec_1 = require("./sec");
const examples_1 = require("./examples");
const migrations_1 = require("./migrations");
/////////////////////
describe(`${consts_1.LIB} - examples`, function () {
    describe('DEMO_STATE', function () {
        it('should be stable and up to date', () => {
            const migrated = migrations_1.migrate_to_latest(sec_1.get_lib_SEC(), examples_1.DEMO_STATE);
            chai_1.expect(migrated).to.equal(examples_1.DEMO_STATE);
        });
    });
});
//# sourceMappingURL=examples_spec.js.map