import { CodeSpec, State } from './types';
import { SoftExecutionContext } from './sec';
declare function create(SEC?: SoftExecutionContext): Readonly<State>;
declare function attempt_to_redeem_code<T>(state: Readonly<State>, code_spec: Readonly<CodeSpec<T>>, infos: Readonly<T>): Readonly<State>;
export { create, attempt_to_redeem_code, };
