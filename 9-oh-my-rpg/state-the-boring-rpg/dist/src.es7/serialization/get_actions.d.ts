import { UUID } from '@offirmo/uuid';
import { State } from '../types';
import { Action } from './types';
declare function get_actions_for_element(state: Readonly<State>, uuid: UUID): Readonly<Action>[];
export { get_actions_for_element, };
