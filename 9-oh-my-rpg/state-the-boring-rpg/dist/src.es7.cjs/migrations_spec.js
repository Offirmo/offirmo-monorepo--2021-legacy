"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const migration_tester_1 = require("@oh-my-rpg/migration-tester");
const consts_1 = require("./consts");
const migrations_1 = require("./migrations");
const sec_1 = require("./sec");
const state_1 = require("./state");
describe('⚔ 👑 😪  The Boring RPG - schema migration', function () {
    describe('migration of an active savegame', function () {
        migration_tester_1.test_migrations({
            use_hints: true,
            //read_only: false, // XXX
            migration_hints_for_chaining: state_1.MIGRATION_HINTS_FOR_TESTS,
            SCHEMA_VERSION: consts_1.SCHEMA_VERSION,
            LATEST_EXPECTED_DATA: state_1.DEMO_STATE,
            migrate_to_latest: migrations_1.migrate_to_latest.bind(null, sec_1.get_SEC()),
            absolute_dir_path: require('path').join(__dirname, '../../src/migrations_of_active_state_specs'),
            expect: chai_1.expect, context, it,
        });
    });
    describe('migration of a new savegame', function () {
        migration_tester_1.test_migrations({
            use_hints: false,
            //read_only: false, // XXX
            SCHEMA_VERSION: consts_1.SCHEMA_VERSION,
            LATEST_EXPECTED_DATA: state_1.create(),
            migrate_to_latest: migrations_1.migrate_to_latest.bind(null, sec_1.get_SEC()),
            absolute_dir_path: require('path').join(__dirname, '../../src/migrations_of_blank_state_specs'),
            expect: chai_1.expect, context, it,
        });
    });
});
//# sourceMappingURL=migrations_spec.js.map