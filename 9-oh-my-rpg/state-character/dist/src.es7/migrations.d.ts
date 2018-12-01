import { State } from './types';
import { SoftExecutionContext } from './sec';
declare const MIGRATION_HINTS_FOR_TESTS: any;
declare function migrate_to_latest(SEC: SoftExecutionContext, legacy_state: Readonly<any>, hints?: Readonly<any>): State;
export { migrate_to_latest, MIGRATION_HINTS_FOR_TESTS, };
