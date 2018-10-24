import { CodesConditions, State } from './types';
import { SoftExecutionContext } from './sec';
declare function create(SEC?: SoftExecutionContext): Readonly<State>;
declare function redeem_code(SEC: SoftExecutionContext, state: Readonly<State>, code: string, infos: Readonly<CodesConditions>): Readonly<State>;
export { State, create, redeem_code, };
