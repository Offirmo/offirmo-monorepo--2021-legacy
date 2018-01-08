"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const lodash_1 = require("lodash");
const consts_1 = require("./consts");
const migrations_1 = require("./migrations");
const state_1 = require("./state");
const DATA_v0 = state_1.OLDEST_LEGACY_STATE_FOR_TESTS;
const DATA_OLDEST = DATA_v0;
const DATA_v1 = state_1.DEMO_STATE;
const DATA_LATEST = state_1.DEMO_STATE;
describe('📦 📦 📦  Inventory state - schema migration', function () {
    context('when the version is more recent', function () {
        it('should throw with a meaningful error', () => {
            function load() {
                migrations_1.migrate_to_latest({ schema_version: 99999 });
            }
            chai_1.expect(load).to.throw('more recent version');
        });
    });
    context('when the version is up to date', function () {
        it('should return the state without change', () => {
            chai_1.expect(DATA_LATEST.schema_version).to.equal(consts_1.SCHEMA_VERSION); // make sure our tests are up to date
            chai_1.expect(migrations_1.migrate_to_latest(lodash_1.cloneDeep(DATA_LATEST))).to.deep.equal(DATA_LATEST);
        });
    });
    context('when the version is outdated', function () {
        it('should migrate to latest version', () => {
            chai_1.expect(migrations_1.migrate_to_latest(lodash_1.cloneDeep(DATA_OLDEST), state_1.MIGRATION_HINTS_FOR_TESTS)).to.deep.equal(DATA_LATEST);
        });
    });
    describe('individual migration functions', function () {
        describe(`1 to latest`, function () {
            it('should work', () => {
                chai_1.expect(migrations_1.migrate_to_latest(lodash_1.cloneDeep(DATA_v1), state_1.MIGRATION_HINTS_FOR_TESTS)).to.deep.equal(DATA_LATEST);
            });
        });
        describe(`0 to latest`, function () {
            it('should work', () => {
                chai_1.expect(migrations_1.migrate_to_latest(lodash_1.cloneDeep(DATA_v0), state_1.MIGRATION_HINTS_FOR_TESTS)).to.deep.equal(DATA_LATEST);
            });
        });
    });
});
//# sourceMappingURL=migrations_spec.js.map