import { State } from './types';
declare function create(): State;
declare function use_energy(state: State, qty?: number, date?: Date): State;
export { State, create, use_energy };
