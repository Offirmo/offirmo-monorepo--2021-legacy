import { State } from './types';
declare function create(): State;
declare function use_energy(state: State, qty?: number, date?: Date): State;
declare function loose_all_energy(state: State, date?: Date): State;
declare function replenish_energy(state: State, date?: Date): State;
export { State, create, use_energy, loose_all_energy, replenish_energy };
