import { State, CodesConditions } from './types';
declare function is_code(code: string): boolean;
declare function is_code_redeemable(state: Readonly<State>, code: string, infos: Readonly<CodesConditions>): boolean;
export { is_code, is_code_redeemable, };
