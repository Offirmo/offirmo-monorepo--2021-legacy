"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const migration_tester_1 = require("@oh-my-rpg/migration-tester");
const consts_1 = require("./consts");
const migrations_1 = require("./migrations");
const state_1 = require("./state");
const examples_1 = require("./examples");
describe('@oh-my-rpg/state-prng - schema migration', function () {
    describe('migration of a new state', function () {
        const new_state = state_1.create();
        migration_tester_1.test_migrations({
            //read_only: false, // XXX
            use_hints: false,
            SCHEMA_VERSION: consts_1.SCHEMA_VERSION,
            LATEST_EXPECTED_DATA: new_state,
            migrate_to_latest: migrations_1.migrate_to_latest,
            absolute_dir_path: require('path').join(__dirname, '../../src/migrations_of_blank_state_specs'),
            describe, context, it, expect: chai_1.expect,
        });
    });
    describe('migration of an active state', function () {
        migration_tester_1.test_migrations({
            //read_only: false, // XXX
            use_hints: true,
            SCHEMA_VERSION: consts_1.SCHEMA_VERSION,
            LATEST_EXPECTED_DATA: examples_1.DEMO_STATE,
            migration_hints_for_chaining: migrations_1.MIGRATION_HINTS_FOR_TESTS,
            migrate_to_latest: migrations_1.migrate_to_latest,
            absolute_dir_path: require('path').join(__dirname, '../../src/migrations_of_active_state_specs'),
            describe, context, it, expect: chai_1.expect,
        });
    });
});
//# sourceMappingURL=migrations_spec.js.map