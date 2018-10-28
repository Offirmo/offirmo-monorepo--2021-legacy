import { State, CodesConditions } from './types';
import normalize_code from './normalize-code';
declare function is_code(code: string): boolean;
declare function is_code_redeemable(state: Readonly<State>, code: string, infos: Readonly<CodesConditions>): boolean;
export { normalize_code, is_code, is_code_redeemable, };
