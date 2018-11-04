import { expect } from 'chai';
import deepFreeze from 'deep-freeze-strict';
import { test_migrations } from '@oh-my-rpg/migration-tester';
import { SCHEMA_VERSION } from './consts';
import { migrate_to_latest, MIGRATION_HINTS_FOR_TESTS } from './migrations';
import { DEMO_STATE } from './examples';
import { get_lib_SEC } from './sec';
import { create } from './state';
describe('@oh-my-rpg/state-engagement - migration', function () {
    it('should correctly migrate a fresh new state (by touching nothing)', () => {
        const old_state = deepFreeze(create());
        const new_state = migrate_to_latest(get_lib_SEC(), old_state);
        //expect(new_state).to.equal(old_state)
        expect(new_state).to.deep.equal(old_state);
    });
    describe('migration of a new state', function () {
        const new_state = create();
        // TODO ALPHA remove skip
        test_migrations.skip({
            use_hints: false,
            //read_only: false, // XXX
            SCHEMA_VERSION,
            LATEST_EXPECTED_DATA: new_state,
            migrate_to_latest: migrate_to_latest.bind(null, get_lib_SEC()),
            absolute_dir_path: require('path').join(__dirname, '../../src/migrations_of_blank_state_specs'),
            describe, context, it, expect,
        });
    });
    describe('migration of an existing state', function () {
        // TODO ALPHA remove skip
        test_migrations.skip({
            use_hints: true,
            //read_only: false, // XXX
            migration_hints_for_chaining: MIGRATION_HINTS_FOR_TESTS,
            SCHEMA_VERSION,
            LATEST_EXPECTED_DATA: DEMO_STATE,
            migrate_to_latest: migrate_to_latest.bind(null, get_lib_SEC()),
            absolute_dir_path: require('path').join(__dirname, '../../src/migrations_of_active_state_specs'),
            describe, context, it, expect,
        });
    });
});
//# sourceMappingURL=migrations_spec.js.map