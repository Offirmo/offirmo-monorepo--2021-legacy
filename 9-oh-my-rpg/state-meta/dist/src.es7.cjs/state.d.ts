import { State } from './types';
declare const DEFAULT_NAME = "anonymous";
declare function create(): State;
declare function rename(state: State, new_name: string): State;
declare function set_email(state: State, email: string): State;
export { State, DEFAULT_NAME, create, rename, set_email, };
