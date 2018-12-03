import { State, CodeSpec } from './types';
import normalize_code from './normalize-code';
declare function is_code(code: string): boolean;
declare function is_code_redeemable<T>(state: Readonly<State>, code_spec: Readonly<CodeSpec<T>>, infos: Readonly<T>): boolean;
export { normalize_code, is_code, is_code_redeemable, };
