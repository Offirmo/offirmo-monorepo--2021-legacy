"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chai_1 = require("chai");
const deep_freeze_strict_1 = tslib_1.__importDefault(require("deep-freeze-strict"));
const migration_tester_1 = require("@oh-my-rpg/migration-tester");
const consts_1 = require("./consts");
const migrations_1 = require("./migrations");
const examples_1 = require("./examples");
const sec_1 = require("./sec");
const state_1 = require("./state");
describe('@oh-my-rpg/state-prng - schema migration', function () {
    it('should correctly migrate a fresh new state (by touching nothing)', () => {
        const old_state = deep_freeze_strict_1.default(state_1.create());
        const new_state = migrations_1.migrate_to_latest(sec_1.get_lib_SEC(), old_state);
        //expect(new_state).to.equal(old_state)
        chai_1.expect(new_state).to.deep.equal(old_state);
    });
    describe('migration of a new state', function () {
        const new_state = state_1.create();
        // TODO ALPHA remove skip
        migration_tester_1.test_migrations.skip({
            use_hints: false,
            //read_only: false, // XXX
            SCHEMA_VERSION: consts_1.SCHEMA_VERSION,
            LATEST_EXPECTED_DATA: new_state,
            migrate_to_latest: migrations_1.migrate_to_latest.bind(null, sec_1.get_lib_SEC()),
            absolute_dir_path: require('path').join(__dirname, '../../src/migrations_of_blank_state_specs'),
            describe, context, it, expect: chai_1.expect,
        });
    });
    describe('migration of an existing state', function () {
        // TODO ALPHA remove skip
        migration_tester_1.test_migrations.skip({
            use_hints: true,
            //read_only: false, // XXX
            migration_hints_for_chaining: migrations_1.MIGRATION_HINTS_FOR_TESTS,
            SCHEMA_VERSION: consts_1.SCHEMA_VERSION,
            LATEST_EXPECTED_DATA: examples_1.DEMO_STATE,
            migrate_to_latest: migrations_1.migrate_to_latest.bind(null, sec_1.get_lib_SEC()),
            absolute_dir_path: require('path').join(__dirname, '../../src/migrations_of_active_state_specs'),
            describe, context, it, expect: chai_1.expect,
        });
    });
});
//# sourceMappingURL=migrations_spec.js.map