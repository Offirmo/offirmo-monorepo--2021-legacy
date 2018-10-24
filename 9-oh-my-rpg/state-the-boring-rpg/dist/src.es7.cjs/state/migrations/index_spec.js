"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const migration_tester_1 = require("@oh-my-rpg/migration-tester");
const consts_1 = require("../../consts");
const _1 = require(".");
const sec_1 = require("../../sec");
const __1 = require("..");
const examples_1 = require("../../examples");
describe('@oh-my-rpg/state-the-boring-rpg - schema migration', function () {
    describe('migration of an existing state', function () {
        // TODO ALPHA remove skip
        migration_tester_1.test_migrations.skip({
            use_hints: true,
            //read_only: false, // XXX
            migration_hints_for_chaining: examples_1.MIGRATION_HINTS_FOR_TESTS,
            SCHEMA_VERSION: consts_1.SCHEMA_VERSION,
            LATEST_EXPECTED_DATA: examples_1.DEMO_STATE,
            migrate_to_latest: _1.migrate_to_latest.bind(null, sec_1.get_lib_SEC()),
            absolute_dir_path: require('path').join(__dirname, '../../../src/state/migrations/migrations_of_active_state_specs'),
            describe, context, it, expect: chai_1.expect,
        });
    });
    describe('migration of a new state', function () {
        const new_state = __1.create();
        // alter seed to avoid migration
        new_state.prng.seed = 1234; // should match blank state spec
        // TODO ALPHA remove skip
        migration_tester_1.test_migrations.skip({
            use_hints: false,
            //read_only: false, // XXX
            SCHEMA_VERSION: consts_1.SCHEMA_VERSION,
            LATEST_EXPECTED_DATA: new_state,
            migrate_to_latest: _1.migrate_to_latest.bind(null, sec_1.get_lib_SEC()),
            absolute_dir_path: require('path').join(__dirname, '../../../src/state/migrations/migrations_of_blank_state_specs'),
            describe, context, it, expect: chai_1.expect,
        });
    });
});
//# sourceMappingURL=index_spec.js.map