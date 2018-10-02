import { State } from './types';
declare const OLDEST_LEGACY_STATE_FOR_TESTS: any;
declare const MIGRATION_HINTS_FOR_TESTS: {
    to_v1: {
        revision: number;
    };
};
declare function migrate_to_latest(legacy_state: any, hints?: any): State;
export { OLDEST_LEGACY_STATE_FOR_TESTS, MIGRATION_HINTS_FOR_TESTS, migrate_to_latest, };
