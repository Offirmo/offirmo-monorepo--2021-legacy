import { State } from './types';
declare const MIGRATION_HINTS_FOR_TESTS: {
    'to_v1': {};
    'to_v2': {};
};
declare function migrate_to_latest(legacy_state: any, hints?: any): State;
export { migrate_to_latest, MIGRATION_HINTS_FOR_TESTS, };
