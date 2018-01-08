import { State } from './types';
declare const DEFAULT_NAME = "anonymous";
declare function create(): State;
declare function rename(state: State, new_name: string): State;
declare function set_email(state: State, email: string): State;
declare const DEMO_STATE: State;
declare const OLDEST_LEGACY_STATE_FOR_TESTS: any;
declare const MIGRATION_HINTS_FOR_TESTS: any;
export { State, DEFAULT_NAME, create, rename, set_email, DEMO_STATE, OLDEST_LEGACY_STATE_FOR_TESTS, MIGRATION_HINTS_FOR_TESTS };
