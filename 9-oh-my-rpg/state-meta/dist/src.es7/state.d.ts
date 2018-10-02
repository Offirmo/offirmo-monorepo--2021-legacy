import { State } from './types';
declare const DEFAULT_NAME = "anonymous";
declare function create(): Readonly<State>;
declare function rename(state: Readonly<State>, name: string): Readonly<State>;
declare function set_email(state: Readonly<State>, email: string): Readonly<State>;
export { State, DEFAULT_NAME, create, rename, set_email, };
