import { State } from '../types';
import { Action } from './types';
declare function reduce_action(state: Readonly<State>, action: Action): Readonly<State>;
export { reduce_action, };
